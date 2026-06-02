import { useEffect, useState } from "react";
import Button from "../../components/ui/button";
import List from "../../components/ui/list";
import useTodo from "../../hooks/todos/useTodo";
import { useForm, type FieldErrors } from "react-hook-form";
import { newTodoSchema, type newTodoForm } from "../../schemas/todoSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "../../components/ui/customToast";
import { Pagination } from 'antd';


export default function Home() {
  const { todos, addTodoMutation, editTodoMutation, toggleCompleteMutation, deleteTodoMutation,
    page, size, totalPages, completedFilter, setPage, setCompletedFilter, setSearchKeyword } = useTodo();
  const [searchKeywordInput, setSearchKeywordInput] = useState("");

  useEffect(() => {
    const currentPage = window.location.search.split("page=")[1];
    if (currentPage) {
      setPage(Number(currentPage));
    }
  }, [setPage])


  const { register, handleSubmit, watch, reset } = useForm<newTodoForm>({
    resolver: zodResolver(newTodoSchema),
    mode: "onSubmit",
    defaultValues: {
      title: ""
    }
  })

  const title = watch("title");

  const onSubmit = (data: newTodoForm) => {
    addTodoMutation.mutate(data.title);
    reset();
  }

  const onInvalid = (errors: FieldErrors<newTodoForm>) => {
    const firstErrorMessage = Object.values(errors)[0]?.message || "Có lỗi xảy ra"
    toast.error(firstErrorMessage)
  }

  return (

    <div className="flex-1 p-6 flex flex-col items-center">
      <h2 className="text-3xl font-semibold pt-4 text-center">Danh sách công việc</h2>
      <div>
        <input type="text" value={searchKeywordInput} onChange={(e) => setSearchKeywordInput(e.target.value)} placeholder="Tìm kiếm công việc..."
          className="w-50 px-4 py-2 text-center border rounded-md mt-4" />
        <Button color="blue" onClick={() => setSearchKeyword(searchKeywordInput)} className="ml-2">
          Tìm kiếm
        </Button>
      </div>

      <label className="mt-4 text-gray-600 flex items-center justify-center gap-2 cursor-pointer">
        <input type="checkbox" onChange={(e) => setCompletedFilter(e.target.checked ? true : undefined)} checked={completedFilter === true} className="ml-4" />
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
            disabled={!title?.trim() || addTodoMutation.isPending}
            type="submit"
          >
            Thêm
          </Button>
        </form>
        <List items={todos} onToggleComplete={(id) => toggleCompleteMutation.mutate(id)} onDelete={(id) => deleteTodoMutation.mutate(id)} onEdit={(id, title) => editTodoMutation.mutate({ id, title })} />
        <div className="mt-4">
          <Pagination className="" align="center"
            current={page}
            total={totalPages}
            pageSize={size}
            onChange={(page) => setPage(page)} />
        </div>
      </div>
    </div>
  );
}
