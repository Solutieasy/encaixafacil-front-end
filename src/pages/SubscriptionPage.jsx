import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../services/api";

const plans = [
  {
    id: "RECURRING",
    title: "Assinatura mensal",
    subtitle: "Renovação automática",
    price: "R$ 49,90/mês",
    features: ["Cartão de crédito", "Renovação automática", "Acesso contínuo"],
    highlighted: true,
  },
  {
    id: "ONE_TIME",
    title: "Mensal avulsa",
    subtitle: "Renovação manual",
    price: "R$ 59,90/mês",
    features: ["Cartão ou Pix", "Acesso por 30 dias", "Renovação manual"],
    highlighted: false,
  },
];

export function SubscriptionPage() {
  const { user, logout } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState("RECURRING");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleCheckout() {
    setIsLoading(true);
    setError(null);

    try {
      const { url } = await api.createCheckoutSession(selectedPlan);
      window.location.href = url;
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-brand-100 px-4 py-12">
      <div className="w-full max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-brand-900">
            Escolha seu plano
          </h1>
          <p className="mt-2 text-slate-600">
            Olá, {user?.name?.split(" ")[0] || "usuário"}! Libere o painel
            completo do EncaixaFácil.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {plans.map((plan) => (
            <button
              key={plan.id}
              type="button"
              onClick={() => setSelectedPlan(plan.id)}
              className={`rounded-3xl border p-6 text-left transition ${
                selectedPlan === plan.id
                  ? "border-brand-700 bg-brand-50 ring-4 ring-brand-300/50"
                  : "border-brand-300 bg-white hover:border-brand-500"
              }`}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-brand-900">
                  {plan.title}
                </h2>

                <span
                  className={`h-5 w-5 rounded-full border-2 ${
                    selectedPlan === plan.id
                      ? "border-brand-700 bg-brand-700"
                      : "border-brand-300"
                  }`}
                />
              </div>

              <p className="mt-1 text-sm text-slate-500">{plan.subtitle}</p>
              <p className="mt-4 text-3xl font-bold text-brand-700">
                {plan.price}
              </p>

              <ul className="mt-5 space-y-2 text-sm text-slate-600">
                {plan.features.map((feature) => (
                  <li key={feature}>✓ {feature}</li>
                ))}
              </ul>
            </button>
          ))}
        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-3 text-center text-sm text-red-700">
            {error}
          </div>
        )}

        <button
          type="button"
          onClick={handleCheckout}
          disabled={isLoading}
          className="mt-8 w-full rounded-xl bg-brand-700 px-4 py-3 font-semibold text-white shadow-lg shadow-brand-700/20 transition hover:bg-brand-800 disabled:opacity-60"
        >
          {isLoading
            ? "Redirecionando..."
            : selectedPlan === "RECURRING"
              ? "Assinar mensalmente com cartão"
              : "Pagar mensal avulsa com cartão ou Pix"}
        </button>

        <button
          type="button"
          onClick={logout}
          className="mt-4 w-full rounded-xl border border-brand-300 bg-white px-4 py-3 text-sm font-semibold text-brand-700 transition hover:bg-brand-300/40"
        >
          Sair da conta
        </button>
      </div>
    </main>
  );
}
