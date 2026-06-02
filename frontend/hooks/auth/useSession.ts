import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getSessionsApi, logoutOtherSessionsApi } from "../../services/authService";
import type { Session } from "../../types/session";
import { toast } from "../../components/ui/customToast";
import { getErrorMessage } from "../../utils/errorMessage";

const SESSION_QUERY_KEY = ["sessions"];

export default function useSession() {
    const queryClient = useQueryClient();

    const { data: sessions = [], isLoading, error } = useQuery<Session[]>({
        queryKey: SESSION_QUERY_KEY,
        queryFn: getSessionsApi,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
    });


    const logoutOtherSessions = useMutation({
        mutationFn: logoutOtherSessionsApi,
        onSuccess: () => {
            queryClient.setQueryData(
                SESSION_QUERY_KEY,
                (oldSessions: Session[] = []) => oldSessions.filter((session) => session.current)
            );
        },
        onError: (err) => {
            toast.error(getErrorMessage(err, "Đăng xuất các phiên khác thất bại"));
        }
    })

    return { sessions, isLoading, error, logoutOtherSessions };
}