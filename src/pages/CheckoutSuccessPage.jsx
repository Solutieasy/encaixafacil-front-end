import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../services/api";

export function CheckoutSuccessPage() {
  const { goToDashboard } = useAuth();
  const [access, setAccess] = useState(null);

  useEffect(() => {
    let attempts = 0;
    let interval;

    async function checkAccess() {
      try {
        const data = await api.getAccess();
        setAccess(data);

        if (data.hasAccess) {
          clearInterval(interval);
        }
      } catch {
        setAccess({ hasAccess: false });
      }

      attempts += 1;

      if (attempts >= 10) {
        clearInterval(interval);
      }
    }

    checkAccess();
    interval = setInterval(checkAccess, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-brand-100 px-4">
      <div className="w-full max-w-md rounded-3xl border border-brand-300 bg-brand-50 p-8 text-center shadow-xl">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-brand-700 text-2xl text-white">
          ✓
        </div>

        <h1 className="text-2xl font-bold text-brand-900">
          Pagamento recebido!
        </h1>

        <p className="mt-3 text-slate-600">
          {access?.hasAccess
            ? "Seu acesso foi liberado com sucesso."
            : "Estamos confirmando seu pagamento. Isso normalmente leva alguns segundos."}
        </p>

        <button
          type="button"
          onClick={goToDashboard}
          disabled={!access?.hasAccess}
          className="mt-8 w-full rounded-xl bg-brand-700 px-4 py-3 font-semibold text-white transition hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Ir para o dashboard
        </button>
      </div>
    </main>
  );
}
