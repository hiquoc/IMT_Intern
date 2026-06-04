import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { useState } from "react";
import {
    createTodo,
    deleteTodo as deleteTodoApi,
    deleteTodoAttachment,
    getTodos,
    toggleTodoComplete,
    updateTodo,
    uploadTodoAttachment,

} from "../../services/todoService";
import type { Attachment, Todo, PaginatedTodos } from "../../types/todo";
import { toast } from "../../components/ui/toast";
import { getErrorMessage } from "../../utils/errorMessage";
import { useTranslation } from "react-i18next";

const TODOS_QUERY_KEY = ["todos"];
type TodosQueryKey = [typeof TODOS_QUERY_KEY[number], number?, number?, string?, boolean?];

export default function useTodo(initialPage = 1, initialSize = 5) {
    const queryClient = useQueryClient();
    const { t } = useTranslation();
    const [page, setPage] = useState<number>(initialPage);
    const [size, setSize] = useState<number>(initialSize);
    const [completedFilter, setCompletedFilterState] = useState<boolean | undefined>(undefined);
    const [searchKeyword, setSearchKeywordState] = useState<string>("");

    const { data, isLoading, error } = useQuery<PaginatedTodos>({
        queryKey: [...TODOS_QUERY_KEY, page, size, searchKeyword, completedFilter],
        queryFn: () => getTodos(page, size, searchKeyword, completedFilter),
        placeholderData: keepPreviousData,
        staleTime: 0,
        refetchOnMount: true,
    });

    const setSearchKeyword = (keyword: string) => {
        setPage(1);
        setSearchKeywordState(keyword);
    };

    const setCompletedFilter = (value: boolean | undefined) => {
        setPage(1);
        setCompletedFilterState(value);
    };

    const todos = data?.items ?? [];
    const total = data?.total ?? 0;
    const totalPages = data?.totalPages ?? 1;

    const updateTodoQueries = (updater: (data: PaginatedTodos, queryKey: TodosQueryKey) => PaginatedTodos) => {
        queryClient.getQueryCache().findAll({ queryKey: TODOS_QUERY_KEY }).forEach((query) => {
            const queryKey = query.queryKey as TodosQueryKey;

            queryClient.setQueryData<PaginatedTodos>(
                queryKey,
                (oldData) => oldData ? updater(oldData, queryKey) : oldData
            );
        });
    };

    const todoMatchesQuery = (todo: Todo, queryKey: TodosQueryKey) => {
        const keyword = queryKey[3]?.trim().toLowerCase();
        const completed = queryKey[4];

        return (
            (completed === undefined || todo.completed === completed) &&
            (!keyword || todo.title.toLowerCase().includes(keyword))
        );
    };

    const mergeTodoData = (currentTodo: Todo, nextTodo: Todo) => {
        const { attachments: _attachments, ...todoData } = nextTodo;

        return {
            ...currentTodo,
            ...todoData,
            attachments: currentTodo.attachments,
        };
    };

    const updateCachedTodo = (updatedTodo: Todo) => {
        updateTodoQueries((oldData, queryKey) => {
            const hadTodo = oldData.items.some((todo) => todo.id === updatedTodo.id);
            const items = oldData.items
                .map((todo) => todo.id === updatedTodo.id ? mergeTodoData(todo, updatedTodo) : todo)
                .filter((todo) => todoMatchesQuery(todo, queryKey));
            const removedByFilter = hadTodo && !items.some((todo) => todo.id === updatedTodo.id);
            const total = removedByFilter ? Math.max(0, oldData.total - 1) : oldData.total;

            return {
                ...oldData,
                items,
                total,
                totalPages: removedByFilter ? Math.max(1, Math.ceil(total / oldData.size)) : oldData.totalPages,
            };
        });
    };

    const updateCachedTodoAttachments = (
        todoId: string,
        getAttachments: (attachments: Attachment[]) => Attachment[]
    ) => {
        updateTodoQueries((oldData) => ({
            ...oldData,
            items: oldData.items.map((todo) => {
                if (todo.id !== todoId) {
                    return todo;
                }

                return {
                    ...todo,
                    attachments: getAttachments(todo.attachments ?? []),
                };
            }),
        }));
    };

    const addTodoMutation = useMutation({
        mutationFn: createTodo,
        onSuccess: (newTodo) => {
            updateTodoQueries((oldData, queryKey) => {
                if (!todoMatchesQuery(newTodo, queryKey)) {
                    return oldData;
                }

                const total = oldData.total + 1;

                return {
                    ...oldData,
                    items: oldData.page === 1
                        ? [newTodo, ...oldData.items].slice(0, oldData.size)
                        : oldData.items,
                    total,
                    totalPages: Math.max(1, Math.ceil(total / oldData.size)),
                };
            });
        },
        onError: (err) => {
            toast.error(getErrorMessage(err, t));
        },
    });

    const editTodoMutation = useMutation({
        mutationFn: ({ id, title }: { id: string; title: string }) => updateTodo(id, title),
        onSuccess: (updatedTodo) => {
            updateCachedTodo(updatedTodo);
        },
        onError: (err) => {
            toast.error(getErrorMessage(err, t));
        },
    });

    const toggleCompleteMutation = useMutation({
        mutationFn: (id: string) => toggleTodoComplete(id),
        onSuccess: (updatedTodo) => {
            updateTodoQueries((oldData, queryKey) => {
                const hadTodo = oldData.items.some((todo) => todo.id === updatedTodo.id);
                const items = oldData.items
                    .map((todo) => todo.id === updatedTodo.id ? mergeTodoData(todo, updatedTodo) : todo)
                    .filter((todo) => todoMatchesQuery(todo, queryKey));
                const removedByFilter = hadTodo && !items.some((todo) => todo.id === updatedTodo.id);
                const total = removedByFilter ? Math.max(0, oldData.total - 1) : oldData.total;

                return {
                    ...oldData,
                    items,
                    total,
                    totalPages: removedByFilter ? Math.max(1, Math.ceil(total / oldData.size)) : oldData.totalPages,
                };
            });
        },
        onError: (err) => {
            toast.error(getErrorMessage(err, t));
        },
    });

    const deleteTodoMutation = useMutation({
        mutationFn: (id: string) => deleteTodoApi(id),
        onMutate: async (deletedId) => {
            await queryClient.cancelQueries({
                queryKey: TODOS_QUERY_KEY,
            });

            const previousQueries =
                queryClient.getQueriesData({
                    queryKey: TODOS_QUERY_KEY,
                });

            updateTodoQueries((oldData) => ({
                ...oldData,
                items: oldData.items.filter(
                    (todo) => todo.id !== deletedId
                ),
                total: Math.max(0, oldData.total - 1),
                totalPages: Math.max(
                    1,
                    Math.ceil((oldData.total - 1) / oldData.size)
                ),
            }));

            return { previousQueries };
        },

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: TODOS_QUERY_KEY,
                refetchType: "active",
            });
        },

        onError: (_err, _deletedId, context) => {
            context?.previousQueries.forEach(
                ([queryKey, data]) => {
                    queryClient.setQueryData(queryKey, data);
                }
            );
        },
    });

    const uploadAttachmentMutation = useMutation({
        mutationFn: ({ todoId, file }: { todoId: string; file: File }) =>
            uploadTodoAttachment(todoId, file),
        onSuccess: (attachment, { todoId }) => {
            updateCachedTodoAttachments(todoId, (attachments) => [attachment, ...attachments]);
        },
        onError: (err) => {
            toast.error(getErrorMessage(err, t));
        },
    });

    const deleteAttachmentMutation = useMutation({
        mutationFn: ({ todoId, attachmentId }: { todoId: string; attachmentId: number }) =>
            deleteTodoAttachment(todoId, attachmentId),
        onSuccess: (_data, { todoId, attachmentId }) => {
            updateCachedTodoAttachments(todoId, (attachments) =>
                attachments.filter((attachment) => attachment.id !== attachmentId)
            );
        },
        onError: (err) => {
            toast.error(getErrorMessage(err, t));
        },
    });

    const nextPage = () => setPage((p) => Math.min(totalPages, p + 1));
    const prevPage = () => setPage((p) => Math.max(1, p - 1));

    return {
        todos,
        isLoading,
        error,
        addTodoMutation,
        editTodoMutation,
        toggleCompleteMutation,
        deleteTodoMutation,
        uploadAttachmentMutation,
        deleteAttachmentMutation,
        page,
        size,
        total,
        totalPages,
        completedFilter,
        searchKeyword,
        setPage,
        setSize,
        nextPage,
        prevPage,
        setCompletedFilter,
        setSearchKeyword,
    };
}
