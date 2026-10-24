import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../services/api";

export function DashboardPage() {
  const { user, logout, goToSubscription } = useAuth();
  const [access, setAccess] = useState(null);
  const [bookingLink, setBookingLink] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadAccess() {
      try {
        const data = await api.getAccess();
        setAccess(data);
      } catch {
        setAccess({ hasAccess: false, status: "UNKNOWN" });
      }
    }

    loadAccess();
  }, []);

  function copyBookingLink() {
    navigator.clipboard.writeText(bookingLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (!access) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-brand-100">
        <p className="text-brand-900">Carregando seu painel...</p>
      </main>
    );
  }

  if (!access.hasAccess) {
    const isCanceled = access.status === "CANCELED";
    const isExpired =
      access.plan === "ONE_TIME" &&
      access.expiresAt &&
      new Date(access.expiresAt) < new Date();

    return (
      <main className="flex min-h-screen items-center justify-center bg-brand-100 px-4">
        <div className="w-full max-w-md rounded-3xl border border-brand-300 bg-brand-50 p-8 text-center shadow-xl">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-700 text-2xl text-white">
            🔒
          </div>

          <h1 className="text-2xl font-bold text-brand-900">
            {isCanceled
              ? "Sua assinatura foi encerrada"
              : isExpired
                ? "Seu acesso mensal expirou"
                : "Acesso ainda não liberado"}
          </h1>

          <p className="mt-3 text-slate-600">
            {isCanceled
              ? "Sua assinatura foi cancelada. Escolha um plano para voltar a acessar o painel."
              : isExpired
                ? "Sua mensalidade avulsa venceu. Renove para continuar usando o EncaixaFácil."
                : "Escolha um plano para acessar o painel completo."}
          </p>

          <button
            type="button"
            onClick={goToSubscription}
            className="mt-8 w-full rounded-xl bg-brand-700 px-4 py-3 font-semibold text-white shadow-lg shadow-brand-700/20 transition hover:bg-brand-800"
          >
            {isCanceled || isExpired ? "Renovar acesso" : "Escolher plano"}
          </button>

          <button
            type="button"
            onClick={logout}
            className="mt-3 w-full rounded-xl border border-brand-300 bg-white px-4 py-3 text-sm font-semibold text-brand-700 transition hover:bg-brand-300/40"
          >
            Sair da conta
          </button>
        </div>
      </main>
    );
  }

  const menu = [
    {
      title: "Dashboard",
      description: "Visão geral da sua operação",
    },
    {
      title: "Atendimentos agendados",
      description: "Ver todos os agendamentos",
    },
    {
      title: "Serviços disponíveis",
      description: "Cadastrar, editar e remover serviços",
    },
    {
      title: "Agendamentos do dia",
      description: "Enviar lembrete por WhatsApp",
    },
  ];

  return (
    <div className="min-h-screen bg-brand-100">
      <header className="border-b border-brand-300 bg-brand-50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-700 font-bold text-white">
              EF
            </div>

            <div>
              <p className="text-lg font-bold text-brand-900">EncaixaFácil</p>
              <p className="text-xs text-slate-500">Painel de agendamentos</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-brand-900">
                {user?.name || "Usuário"}
              </p>
              <p className="text-xs text-slate-500">{user?.email}</p>
            </div>

            <button
              type="button"
              onClick={logout}
              className="rounded-xl border border-brand-300 bg-white px-4 py-2 text-sm font-semibold text-brand-700 transition hover:bg-brand-300/40"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-8 rounded-2xl border border-brand-300 bg-brand-50 p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-brand-900">
            Acesso liberado 🎉
          </h1>
          <p className="mt-2 text-slate-600">
            Sua assinatura está ativa. Agora você pode configurar sua agenda,
            serviços e receber agendamentos.
          </p>
        </div>

        <section className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {menu.map((item) => (
            <button
              key={item.title}
              type="button"
              className="rounded-2xl border border-brand-300 bg-brand-50 p-6 text-left shadow-sm transition hover:border-brand-700 hover:shadow-md"
            >
              <h2 className="text-xl font-semibold text-brand-900">
                {item.title}
              </h2>
              <p className="mt-2 text-sm text-slate-600">{item.description}</p>
            </button>
          ))}
        </section>

        <section className="mt-8 rounded-2xl border border-brand-300 bg-brand-50 p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-brand-900">
            Link público de agendamento
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Compartilhe este link para que clientes façam agendamentos.
          </p>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <input
              readOnly
              value={bookingLink}
              placeholder="https://encaixafacil.com/agendar/seu-usuario"
              className="w-full rounded-xl border border-brand-300 bg-white px-4 py-3 text-sm"
            />

            <button
              type="button"
              onClick={copyBookingLink}
              className="rounded-xl bg-brand-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-800"
            >
              {copied ? "Copiado!" : "Copiar link"}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
