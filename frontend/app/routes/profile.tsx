import { useMemo } from "react";
import { useAuthStore } from "../../stores/authStore";
import useSession from "../../hooks/auth/useSession";
import Button from "../../components/ui/button";

export default function Profile() {
    const user = useAuthStore((state) => state.user);
    const { sessions, isLoading, logoutOtherSessions } = useSession();

    const sortedSessions = useMemo(() => {
        return [...sessions].sort((a, b) => {
            return a.current ? -1 : 1;
        });
    }, [sessions]);
    


    return (
        <div className="flex-1 p-6">
            <div className="max-w-4xl mx-auto space-y-6">
                <section className="p-6 bg-white rounded-2xl shadow-sm border border-gray-200">
                    <h2 className="text-2xl font-semibold text-gray-900">Thông tin người dùng</h2>
                    <div className="mt-4 space-y-2 text-gray-700">
                        <p>
                            <span className="font-medium">Email:</span> {user?.email ?? "Không có thông tin"}
                        </p>
                    </div>
                </section>

                <section className="p-6 bg-white rounded-2xl shadow-sm border border-gray-200">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900">Phiên đăng nhập</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Xem tất cả phiên hiện tại và đăng xuất các phiên khác.
                            </p>
                        </div>
                        <Button
                            color="red"
                            onClick={() => logoutOtherSessions.mutate()}
                            disabled={logoutOtherSessions.isPending}
                        >
                            Đăng xuất các phiên khác
                        </Button>
                    </div>

                    <div className="mt-6 space-y-3">
                        {isLoading ? (
                            <p className="text-gray-600">Đang tải phiên...</p>
                        ) : sortedSessions.length === 0 ? (
                            <p className="text-gray-600">Không có phiên đăng nhập nào.</p>
                        ) : (
                            sortedSessions.map((session) => {
                                const createdAt = session.createdAt
                                    ? new Date(Number(session.createdAt) || session.createdAt)
                                    : null;

                                return (
                                    <div
                                        key={session.jti}
                                        className={`rounded-2xl border p-4 ${session.current
                                                ? "border-green-400 bg-green-50"
                                                : "border-gray-200 bg-white"
                                            }`}
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <h3 className="font-semibold text-gray-900">
                                                    {session.current ? "Phiên hiện tại" : "Thiết bị đã đăng nhập"}
                                                </h3>

                                                <p className="mt-1 text-sm text-gray-600">
                                                    {session.userAgent ||
                                                        "Không xác định"}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-4 space-y-1 text-sm text-gray-700">
                                            <p>
                                                <span className="font-medium">IP:</span>{" "}
                                                {session.ip || "Không rõ"}
                                            </p>

                                            <p>
                                                <span className="font-medium">Hoạt động cuối:</span>{" "}
                                                {createdAt
                                                    ? createdAt.toLocaleString("vi-VN")
                                                    : "Không xác định"}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}
