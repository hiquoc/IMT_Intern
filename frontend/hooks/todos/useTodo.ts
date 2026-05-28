import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Todo } from '../../types/todo'
import {
    createTodo,
    deleteTodo as deleteTodoApi,
    getTodos,
    toggleTodoComplete,
    updateTodo,
} from "../../services/todoService";
import { toast } from "../../components/ui/customToast";
import { getErrorMessage } from "../../utils/errorMessage";

const TODOS_QUERY_KEY = ["todos"];

export default function useTodo() {
    const queryClient = useQueryClient();

    const { data: todos = [], isLoading, error } = useQuery<Todo[]>({
        queryKey: TODOS_QUERY_KEY,
        queryFn: () => getTodos(),
    });

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

    async function addTodo(newTitle: string) {
        const title = newTitle.trim();
        if (!title) return;
        addTodoMutation.mutate(title);
    }

    async function editTodo(id: string, newTitle: string) {
        editTodoMutation.mutate({ id, title: newTitle });
    }

    async function toggleComplete(id: string) {
        toggleCompleteMutation.mutate(id);
    }

    async function deleteTodo(id: string) {
        deleteTodoMutation.mutate(id);
    }

    return { todos, isLoading, error, addTodo, editTodo, toggleComplete, deleteTodo };
}