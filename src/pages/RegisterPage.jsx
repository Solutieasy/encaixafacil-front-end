import { useState } from "react";
import { api } from "../services/api";

import { useAuth } from "../contexts/AuthContext";

const initialForm = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export function RegisterPage() {
  const { goToLogin } = useAuth();

  const [form, setForm] = useState(initialForm);
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function validate() {
    const errors = {};

    if (form.name.trim().length < 2) {
      errors.name = "Informe seu nome completo.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = "Informe um e-mail válido.";
    }

    if (form.password.length < 6) {
      errors.password = "A senha deve ter pelo menos 6 caracteres.";
    }

    if (form.confirmPassword !== form.password) {
      errors.confirmPassword = "As senhas não coincidem.";
    }

    return errors;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setServerError(null);

    const errors = validate();
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    setIsLoading(true);

    try {
      await api.register({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });

      goToLogin();
    } catch (error) {
      setServerError(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-brand-100 px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="rounded-3xl border border-brand-300 bg-brand-50 p-8 shadow-xl shadow-brand-700/10">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-700 font-bold text-white">
              EF
            </div>

            <h1 className="text-3xl font-bold text-brand-900">Criar conta</h1>
            <p className="mt-2 text-slate-600">
              Comece a organizar seus atendimentos no EncaixaFácil.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div>
              <label
                htmlFor="name"
                className="mb-1.5 block text-sm font-medium text-brand-900"
              >
                Nome completo
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                value={form.name}
                onChange={handleChange}
                aria-invalid={Boolean(fieldErrors.name)}
                aria-describedby={fieldErrors.name ? "name-error" : undefined}
                className={`w-full rounded-xl border bg-white px-4 py-3 outline-none transition focus:ring-4 ${
                  fieldErrors.name
                    ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                    : "border-brand-300 focus:border-brand-700 focus:ring-brand-300/50"
                }`}
                placeholder="Maria Silva"
              />
              {fieldErrors.name && (
                <p id="name-error" className="mt-1.5 text-sm text-red-600">
                  {fieldErrors.name}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-brand-900"
              >
                E-mail
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                aria-invalid={Boolean(fieldErrors.email)}
                aria-describedby={fieldErrors.email ? "email-error" : undefined}
                className={`w-full rounded-xl border bg-white px-4 py-3 outline-none transition focus:ring-4 ${
                  fieldErrors.email
                    ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                    : "border-brand-300 focus:border-brand-700 focus:ring-brand-300/50"
                }`}
                placeholder="voce@email.com"
              />
              {fieldErrors.email && (
                <p id="email-error" className="mt-1.5 text-sm text-red-600">
                  {fieldErrors.email}
                </p>
              )}
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="password"
                  className="mb-1.5 block text-sm font-medium text-brand-900"
                >
                  Senha
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  value={form.password}
                  onChange={handleChange}
                  aria-invalid={Boolean(fieldErrors.password)}
                  aria-describedby={
                    fieldErrors.password ? "password-error" : undefined
                  }
                  className={`w-full rounded-xl border bg-white px-4 py-3 outline-none transition focus:ring-4 ${
                    fieldErrors.password
                      ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                      : "border-brand-300 focus:border-brand-700 focus:ring-brand-300/50"
                  }`}
                  placeholder="••••••"
                />
                {fieldErrors.password && (
                  <p
                    id="password-error"
                    className="mt-1.5 text-sm text-red-600"
                  >
                    {fieldErrors.password}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-1.5 block text-sm font-medium text-brand-900"
                >
                  Confirmar senha
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  aria-invalid={Boolean(fieldErrors.confirmPassword)}
                  aria-describedby={
                    fieldErrors.confirmPassword
                      ? "confirm-password-error"
                      : undefined
                  }
                  className={`w-full rounded-xl border bg-white px-4 py-3 outline-none transition focus:ring-4 ${
                    fieldErrors.confirmPassword
                      ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                      : "border-brand-300 focus:border-brand-700 focus:ring-brand-300/50"
                  }`}
                  placeholder="••••••"
                />
                {fieldErrors.confirmPassword && (
                  <p
                    id="confirm-password-error"
                    className="mt-1.5 text-sm text-red-600"
                  >
                    {fieldErrors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            {serverError && (
              <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
              >
                {serverError}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-brand-700 px-4 py-3 font-semibold text-white shadow-lg shadow-brand-700/20 transition hover:bg-brand-800 focus:outline-none focus:ring-4 focus:ring-brand-300/60 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Criando conta..." : "Criar conta"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Já tem uma conta?{" "}
            <button
              type="button"
              onClick={goToLogin}
              className="font-semibold text-brand-700 underline-offset-4 hover:underline"
            >
              Entrar
            </button>
          </p>
        </div>
      </div>
    </main>
  );
}
