import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../services/api";
import { ServicesScreen } from "./ServicesScreen";
import { TodayScreen } from "./TodayScreen";
import { AppointmentsScreen } from "./AppointmentsScreen";
import { ScheduleScreen } from "./ScheduleScreen";

export function DashboardPage() {
  const { user, logout, goToSubscription } = useAuth();
  const [access, setAccess] = useState(null);
  const [copied, setCopied] = useState(false);
  const [screen, setScreen] = useState("overview");
  const [stats, setStats] = useState(null);

  useEffect(() => {
    async function loadStats() {
      const data = await api.get("/dashboard/stats");
      setStats(data);
    }

    loadStats();
  }, []);

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

  async function copyBookingLink() {
    try {
      await navigator.clipboard.writeText(bookingLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Não foi possível copiar o link:", error);
    }
  }

  if (!access) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-brand-100">
        <p className="text-brand-900">Carregando seu painel...</p>
      </main>
    );
  }

  const bookingLink = `${window.location.origin}/agendar/${user.id}`;

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

  if (screen === "services") {
    return (
      <div className="min-h-screen bg-brand-100">
        <header className="border-b border-brand-300 bg-brand-50">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <button
              type="button"
              onClick={() => setScreen("overview")}
              className="rounded-xl border border-brand-300 bg-white px-4 py-2 text-sm font-semibold text-brand-700"
            >
              ← Voltar
            </button>

            <button
              type="button"
              onClick={logout}
              className="rounded-xl border border-brand-300 bg-white px-4 py-2 text-sm font-semibold text-brand-700"
            >
              Sair
            </button>
          </div>
        </header>

        <main className="mx-auto max-w-5xl px-6 py-10">
          <h1 className="mb-8 text-3xl font-bold text-brand-900">
            Serviços disponíveis
          </h1>

          <ServicesScreen />
        </main>
      </div>
    );
  }

  if (screen === "today") {
    return (
      <div className="min-h-screen bg-brand-100">
        <main className="mx-auto max-w-5xl px-6 py-10">
          <TodayScreen onBack={() => setScreen("overview")} />
        </main>
      </div>
    );
  }

  if (screen === "appointments") {
    return (
      <div className="min-h-screen bg-brand-100">
        <main className="mx-auto max-w-5xl px-6 py-10">
          <AppointmentsScreen onBack={() => setScreen("overview")} />
        </main>
      </div>
    );
  }

  if (screen === "schedule") {
    return (
      <div className="min-h-screen bg-brand-100">
        <main className="mx-auto max-w-5xl px-6 py-10">
          <ScheduleScreen onBack={() => setScreen("overview")} />
        </main>
      </div>
    );
  }

  const menu = [
    {
      id: "appointments",
      title: "Atendimentos agendados",
      description: "Ver todos os agendamentos",
    },
    {
      id: "services",
      title: "Serviços disponíveis",
      description: "Cadastrar, editar e remover serviços",
    },
    {
      id: "today",
      title: "Agendamentos do dia",
      description: "Enviar lembrete por WhatsApp",
    },
    {
      id: "schedule",
      title: "Carga horária",
      description: "Horários disponíveis de segunda a domingo",
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

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-white p-5">
              <p className="text-sm text-slate-500">Serviços ativos</p>
              <p className="mt-1 text-3xl font-bold text-brand-700">
                {stats?.activeServices ?? 0}
              </p>
            </div>

            <div className="rounded-xl bg-white p-5">
              <p className="text-sm text-slate-500">Agendamentos futuros</p>
              <p className="mt-1 text-3xl font-bold text-brand-700">
                {stats?.totalAppointments ?? 0}
              </p>
            </div>

            <div className="rounded-xl bg-white p-5">
              <p className="text-sm text-slate-500">Agendamentos do dia</p>
              <p className="mt-1 text-3xl font-bold text-brand-700">
                {stats?.todayAppointments ?? 0}
              </p>
            </div>
          </div>
        </div>

        <section className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {menu.map((item) => (
            <button
              key={item.title}
              type="button"
              onClick={() => setScreen(item.id)}
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
            Compartilhe este link para que seus clientes façam agendamentos.
          </p>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <input
              readOnly
              value={bookingLink}
              onFocus={(event) => event.target.select()}
              className="w-full rounded-xl border border-brand-300 bg-white px-4 py-3 text-sm"
            />

            <div className="flex gap-2">
              <button
                type="button"
                onClick={copyBookingLink}
                className="rounded-xl bg-brand-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-800"
              >
                {copied ? "Copiado!" : "Copiar link"}
              </button>

              <a
                href={bookingLink}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-brand-300 bg-white px-5 py-3 text-sm font-semibold text-brand-700 transition hover:bg-brand-300/40"
              >
                Abrir
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
