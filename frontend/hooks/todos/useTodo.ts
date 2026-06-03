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
    type PaginatedTodos,
} from "../../services/todoService";
import { toast } from "../../components/ui/customToast";
import { getErrorMessage } from "../../utils/errorMessage";
import { useTranslation } from "react-i18next";

const TODOS_QUERY_KEY = ["todos"];

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
    const totalPages = data?.totalPages ?? 1;

    const addTodoMutation = useMutation({
        mutationFn: createTodo,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: TODOS_QUERY_KEY });
        },
        onError: (err) => {
            toast.error(getErrorMessage(err, t));
        },
    });

    const editTodoMutation = useMutation({
        mutationFn: ({ id, title }: { id: string; title: string }) => updateTodo(id, title),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: TODOS_QUERY_KEY });
        },
        onError: (err) => {
            toast.error(getErrorMessage(err, t));
        },
    });

    const toggleCompleteMutation = useMutation({
        mutationFn: (id: string) => toggleTodoComplete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: TODOS_QUERY_KEY });
        },
        onError: (err) => {
            toast.error(getErrorMessage(err, t));
        },
    });

    const deleteTodoMutation = useMutation({
        mutationFn: (id: string) => deleteTodoApi(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: TODOS_QUERY_KEY });
        },
        onError: (err) => {
            toast.error(getErrorMessage(err, t));
        },
    });

    const uploadAttachmentMutation = useMutation({
        mutationFn: ({ todoId, file }: { todoId: string; file: File }) =>
            uploadTodoAttachment(todoId, file),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: TODOS_QUERY_KEY });
        },
        onError: (err) => {
            toast.error(getErrorMessage(err, t));
        },
    });

    const deleteAttachmentMutation = useMutation({
        mutationFn: ({ todoId, attachmentId }: { todoId: string; attachmentId: number }) =>
            deleteTodoAttachment(todoId, attachmentId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: TODOS_QUERY_KEY });
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
