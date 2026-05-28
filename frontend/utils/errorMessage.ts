import axios from "axios";

export function getErrorMessage(error: unknown, fallback = "Có lỗi xảy ra") {
    if (axios.isAxiosError(error)) {
        const data = error.response?.data;
        if (data?.message) {
            return data.message;
        }
        return error.message;
    }

    if (error instanceof Error) {
        return error.message;
    }

    return fallback;
}
