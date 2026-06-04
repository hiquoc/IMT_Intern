import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getSessionsApi, logoutOtherSessionsApi } from "../../services/authService";
import type { Session } from "../../types/session";
import { toast } from "../../components/ui/toast";
import { getErrorMessage } from "../../utils/errorMessage";
import { useTranslation } from "react-i18next";

const SESSION_QUERY_KEY = ["sessions"];

export default function useSession() {
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    const { data: sessions = [], isLoading, error } = useQuery<Session[]>({
        queryKey: SESSION_QUERY_KEY,
        queryFn: getSessionsApi,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
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
            toast.error(getErrorMessage(err, t));
        }
    });

    return { sessions, isLoading, error, logoutOtherSessions };
}