import { useNavigate } from "react-router";
import { useAuthStore } from "../../stores/authStore";
import { useMutation } from "@tanstack/react-query";
import { loginApi } from "../../services/authService";
import { toast } from "../../components/ui/customToast";
import { getErrorMessage } from "../../utils/errorMessage";

export default function useLogin() {
    const navigate = useNavigate();
    const { setLogin } = useAuthStore();

    return useMutation({
        mutationFn: loginApi,

        onSuccess: (response) => {
            setLogin(response.user, response.accessToken);
            navigate("/");
        },

        onError: (error) => {
            toast.error(getErrorMessage(error,"Đăng nhập thất bại"));
        }
    })
}