import axios from "axios";
import type { TFunction } from "i18next";

export function getErrorMessage(
  error: unknown,
  t: TFunction,
  fallbackKey = "errors.DEFAULT"
): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    if (data?.message) {
      const translationKey = `errors.${data.message}`;
      const translated = t(translationKey);
      if (translated !== translationKey) {
        return translated;
      }
      return data.message;
    }
    return t(fallbackKey);
  }

  if (error instanceof Error) {
    return error.message;
  }

  return t(fallbackKey);
}
