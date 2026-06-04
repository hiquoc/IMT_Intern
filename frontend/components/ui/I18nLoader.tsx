import { useEffect, useState } from "react";
import { i18nPromise } from "../../lib/i18n";

export default function I18nLoader({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    i18nPromise.then(() => setReady(true));
  }, []);

  if (!ready) {
    return null;
  }

  return <>{children}</>;
}