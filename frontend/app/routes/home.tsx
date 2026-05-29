import { useMemo, useState } from "react";
import Button from "../../components/ui/button";
import List from "../../components/ui/list";
import useTodo from "../../hooks/todos/useTodo";
import { useForm, type FieldErrors } from "react-hook-form";
import { newTodoSchema, type newTodoForm } from "../../schemas/todoSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "../../components/ui/customToast";

export default function Home() {
  const { todos, addTodo, editTodo, toggleComplete, deleteTodo } = useTodo();
  const [search, setSearch] = useState("");
  const [onlyCompleted, setOnlyCompleted] = useState(false);

  const { register, handleSubmit, watch, reset, formState: { isSubmitting } } = useForm<newTodoForm>({
    resolver: zodResolver(newTodoSchema),
    mode: "onSubmit",
    defaultValues: {
      title: ""
    }
  })

  const title = watch("title");

  const onSubmit = (data: newTodoForm) => {
    addTodo(data.title);
    reset();
  }

  const onInvalid = (errors: FieldErrors<newTodoForm>) => {
    const firstErrorMessage = Object.values(errors)[0]?.message || "Có lỗi xảy ra"
    toast.error(firstErrorMessage)
  }

  const filteredTodos = useMemo(() => {
    return todos.filter(todo =>
      todo.title.toLowerCase().includes(search.toLowerCase()) &&
      (onlyCompleted ? todo.completed : true)
    );
  }, [todos, search, onlyCompleted]);

  return (

    <div className="flex-1 p-6 flex flex-col items-center">
      <h2 className="text-3xl font-semibold pt-4 text-center">Danh sách công việc</h2>
      <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Tìm kiếm công việc..."
        className="w-50 px-4 py-2 text-center border rounded-md mt-4" />
      <label className="mt-4 text-gray-600 flex items-center justify-center gap-2 cursor-pointer">
        <input type="checkbox" onChange={(e) => setOnlyCompleted(e.target.checked)} checked={onlyCompleted} className="ml-4" />
        <span className="ml-2 text-gray-600">Chỉ hiển thị công việc đã hoàn thành</span>
      </label>
      <div className="mt-6 border-t border-gray-200 w-200 mx-auto">
        <form className="mt-4 text-gray-600 flex items-center justify-center gap-2"
          onSubmit={handleSubmit(onSubmit, onInvalid)}>
          <input type="text"
            {...register("title")}
            placeholder="Nhập công việc mới..." className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <Button
            color="blue"
            disabled={!title?.trim() || isSubmitting}
            type="submit"
          >
            Thêm
          </Button>
        </form>
        <List items={filteredTodos} onToggleComplete={toggleComplete} onDelete={deleteTodo} onEdit={editTodo} />
      </div>
    </div>
  );
}
