import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "../../stores/authStore";
import { registerApi } from "../../services/authService";
import { toast } from "../../components/ui/customToast";
import { getErrorMessage } from "../../utils/errorMessage";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

export default function useRegister() {
    const navigate = useNavigate();
    const { setLogin } = useAuthStore();
    const { t } = useTranslation();

    return useMutation({
        mutationFn: registerApi,

        onSuccess: (response) => {
            setLogin(response.user, response.accessToken);
            navigate("/");
        },

        onError: (error) => {
            toast.error(getErrorMessage(error, t));
        }
    })
}
