import { useMutation, useQuery, useQueryClient,keepPreviousData } from "@tanstack/react-query";
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

const TODOS_QUERY_KEY = ["todos"];

export default function useTodo(initialPage = 1, initialSize = 5) {
    const queryClient = useQueryClient();
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
            queryClient.invalidateQueries({
                queryKey: TODOS_QUERY_KEY,
            });
        },
        onError: (err) => {
            toast.error(
                getErrorMessage(err, "Thêm công việc thất bại")
            );
        },
    });

    const editTodoMutation = useMutation({
        mutationFn: ({ id, title }: { id: string; title: string }) => updateTodo(id, title),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: TODOS_QUERY_KEY,
            });
        },

        onError: (err) => {
            toast.error(
                getErrorMessage(err, "Cập nhật công việc thất bại")
            );
        },
    });

    const toggleCompleteMutation = useMutation({
        mutationFn: (id: string) => toggleTodoComplete(id),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: TODOS_QUERY_KEY,
            });
        },

        onError: (err) => {
            toast.error(
                getErrorMessage(err, "Cập nhật trạng thái thất bại")
            );
        },
    });

    const deleteTodoMutation = useMutation({
        mutationFn: (id: string) => deleteTodoApi(id),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: TODOS_QUERY_KEY,
            });
        },

        onError: (err) => {
            toast.error(
                getErrorMessage(err, "Xóa công việc thất bại")
            );
        },
    });

    const uploadAttachmentMutation = useMutation({
        mutationFn: ({ todoId, file }: { todoId: string; file: File }) => uploadTodoAttachment(todoId, file),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: TODOS_QUERY_KEY,
            });
        },

        onError: (err) => {
            toast.error(
                getErrorMessage(err, "Táº£i tá»‡p Ä‘Ã­nh kÃ¨m tháº¥t báº¡i")
            );
        },
    });

    const deleteAttachmentMutation = useMutation({
        mutationFn: ({ todoId, attachmentId }: { todoId: string; attachmentId: number }) =>
            deleteTodoAttachment(todoId, attachmentId),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: TODOS_QUERY_KEY,
            });
        },

        onError: (err) => {
            toast.error(
                getErrorMessage(err, "XÃ³a tá»‡p Ä‘Ã­nh kÃ¨m tháº¥t báº¡i")
            );
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
