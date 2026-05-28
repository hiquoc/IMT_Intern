import { useAuthStore } from "../../stores/authStore";

export default function Header() {
  const { user, logout } = useAuthStore();

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-300 shadow-sm">
      <div>
        <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
           Todo List
        </h1>
      </div>
      <div className="flex items-center gap-4">
        {user && (
          <span className="text-sm text-gray-600">{user.email}</span>
        )}
        <button
          onClick={logout}
          className="px-3 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded-md"
        >
          Đăng xuất
        </button>
      </div>
    </header>
  );
}
