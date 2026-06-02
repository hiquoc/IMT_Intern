import { Link } from "react-router";
import { useAuthStore } from "../../stores/authStore";
import { useLogout } from "../../hooks/auth/useLogout";
export default function Header() {
  const { user } = useAuthStore();
  const  logout  = useLogout();
  const handleLogout = () => {
    logout.mutate();
  }

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-300 shadow-sm">
      <div>
        <Link className="text-xl font-bold text-gray-800 flex items-center gap-2" to="/">
          Todo List
        </Link>
      </div>
      <div className="flex items-center gap-4">
        {user && (
          <span className="text-sm text-gray-600">{user.email}</span>
        )}
        <Link
          to="/profile"
          className="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-md"
        >
          Hồ sơ
        </Link>
        <button
          onClick={handleLogout}
          className="px-3 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded-md"
        >
          Đăng xuất
        </button>
      </div>
    </header>
  );
}
