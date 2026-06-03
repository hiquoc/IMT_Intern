import { useNavigate } from "react-router";
import { useAuthStore } from "../../stores/authStore";
import { useMutation } from "@tanstack/react-query";
import { loginApi } from "../../services/authService";
import { toast } from "../../components/ui/customToast";
import { getErrorMessage } from "../../utils/errorMessage";
import { useTranslation } from "react-i18next";

export default function useLogin() {
    const navigate = useNavigate();
    const { setLogin } = useAuthStore();
    const { t } = useTranslation();

    return useMutation({
        mutationFn: loginApi,

        onSuccess: (response) => {
            setLogin(response.user, response.accessToken);
            navigate("/");
        },

        onError: (error) => {
            toast.error(getErrorMessage(error, t, "errors.DEFAULT"));
        }
    })
}