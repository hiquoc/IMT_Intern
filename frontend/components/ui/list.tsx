import Button from "./button";

interface TodoItem {
  id: number;
  title: string;
  completed: boolean;
}

export default function List({ items, onEdit, onToggleComplete, onDelete }: { items: TodoItem[]; onEdit: (id: number, newTitle: string) => void; onToggleComplete: (id: number) => void; onDelete: (id: number) => void }) {
  return (
    <ul className="mt-4 space-y-2">
      {items.map((item) => (
        <li
          key={item.id}
          className={`p-4 rounded-md shadow-sm flex items-center justify-between ${
            item.completed ? "bg-green-100" : "bg-gray-100"
          }`}
        >
          <input type="text" value={item.title} onChange={(e) => onEdit(item.id, e.target.value)}
           className="text-lg p-2 text-gray-800" />
    

          <div className="flex items-center gap-2">
            {/* <span
              className={`text-sm font-medium ${
                item.completed ? "text-green-600" : "text-gray-600"
              }`}
            >
              {item.completed ? "Xong" : "Chưa xong"}
            </span> */}
            <Button color="green" onClick={() => onToggleComplete(item.id)}>
              {item.completed ? "Đã xong" : "Hoàn thành"}
            </Button>
            <Button color="red" onClick={() => onDelete(item.id)}>
              Xóa
            </Button>
          </div>
        </li>
      ))}
    </ul>
  );
}
