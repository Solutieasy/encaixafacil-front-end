import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export function LoginPage() {
  const { login, goToRegister } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await login({ email, password });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen bg-brand-100">
      <section className="hidden w-1/2 flex-col justify-between bg-brand-700 p-12 text-brand-50 lg:flex">
        <div>
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-300">
            EncaixaFácil
          </span>
          <h2 className="mt-8 max-w-md text-4xl font-bold leading-tight">
            Organize atendimentos sem complicação.
          </h2>
          <p className="mt-4 max-w-md text-lg text-brand-300">
            Gerencie horários, profissionais e agendamentos em um só lugar.
          </p>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl bg-white/10 p-5 backdrop-blur">
            <p className="text-sm text-brand-300">Agendamentos</p>
            <p className="text-2xl font-semibold">Simples e organizados</p>
          </div>

          <div className="rounded-2xl bg-white/10 p-5 backdrop-blur">
            <p className="text-sm text-brand-300">Atendimento</p>
            <p className="text-2xl font-semibold">
              Menos faltas, mais controle
            </p>
          </div>
        </div>
      </section>

      <section className="flex w-full items-center justify-center px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-md">
          <div className="rounded-3xl border border-brand-300 bg-brand-50 p-8 shadow-xl shadow-brand-700/10">
            <div className="mb-8">
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-700 text-lg font-bold text-white">
                EF
              </div>

              <h1 className="text-3xl font-bold text-brand-900">
                Bem-vindo de volta
              </h1>
              <p className="mt-2 text-slate-600">
                Entre na sua conta para acessar o painel de agendamentos.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-sm font-medium text-brand-900"
                >
                  E-mail
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="voce@email.com"
                  className="w-full rounded-xl border border-brand-300 bg-white px-4 py-3 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-brand-700 focus:ring-4 focus:ring-brand-300/50"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-1.5 block text-sm font-medium text-brand-900"
                >
                  Senha
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  minLength={6}
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••"
                  className="w-full rounded-xl border border-brand-300 bg-white px-4 py-3 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-brand-700 focus:ring-4 focus:ring-brand-300/50"
                />
              </div>

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-xl bg-brand-700 px-4 py-3 font-semibold text-white shadow-lg shadow-brand-700/20 transition hover:bg-brand-800 focus:outline-none focus:ring-4 focus:ring-brand-300/60 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? "Entrando..." : "Entrar"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              Ainda não tem conta?{" "}
              <button
                type="button"
                onClick={goToRegister}
                className="font-semibold text-brand-700 underline-offset-4 hover:underline"
              >
                Criar conta
              </button>
            </p>
          </div>

          <p className="mt-6 text-center text-xs text-brand-800/70">
            EncaixaFácil © {new Date().getFullYear()}
          </p>
        </div>
      </section>
    </main>
  );
}
