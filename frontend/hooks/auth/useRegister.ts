import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "../../stores/authStore";
import { registerApi } from "../../services/authService";
import { toast } from "../../components/ui/customToast";
import { getErrorMessage } from "../../utils/errorMessage";
import { useNavigate } from "react-router";

export default function useRegister() {
    const navigate = useNavigate();
    const { setLogin } = useAuthStore();

    return useMutation({
        mutationFn: registerApi,

        onSuccess: (response) => {
            setLogin(response.user, response.accessToken);
            navigate("/");
        },

        onError: (error) => {
            toast.error(getErrorMessage(error))
        }
    })
}
