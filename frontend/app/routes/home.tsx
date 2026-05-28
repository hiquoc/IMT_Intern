import { useMemo, useState } from "react";
import Button from "../../components/ui/button";
import List from "../../components/ui/list";
import useTodo from "../../hooks/todos/useTodo";

export default function Home() {
  const { todos, addTodo, editTodo, toggleComplete, deleteTodo } = useTodo();
  const [newTodo, setNewTodo] = useState("");
  const [search, setSearch] = useState("");
  const [onlyCompleted, setOnlyCompleted] = useState(false);

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
        <input type="checkbox" onChange={(e)=>setOnlyCompleted(e.target.checked)} checked={onlyCompleted} className="ml-4" />
        <span className="ml-2 text-gray-600">Chỉ hiển thị công việc đã hoàn thành</span>
      </label>
      <div className="mt-6 border-t border-gray-200 w-200 mx-auto">
        <div className="mt-4 text-gray-600 flex items-center justify-center gap-2">
          <input type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Nhập công việc mới..." className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <Button color="blue" onClick={() => {
            addTodo(newTodo);
            setNewTodo("");
          }} disabled={!newTodo.trim()}>
            Thêm
          </Button>
        </div>
        <List items={filteredTodos} onToggleComplete={toggleComplete} onDelete={deleteTodo} onEdit={editTodo} />
      </div>
    </div>
  );
}
