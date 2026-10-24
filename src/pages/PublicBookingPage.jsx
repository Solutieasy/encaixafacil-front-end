import { useEffect, useState } from "react";
import { api } from "../services/api";

export function PublicBookingPage({ userId }) {
  const [bookingData, setBookingData] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState({
    serviceId: "",
    customerName: "",
    customerPhone: "",
    date: "",
    time: "",
    notes: "",
  });

  useEffect(() => {
    async function loadData() {
      try {
        const data = await api.getPublicBookingData(userId);
        setBookingData(data);
      } catch (err) {
        setError(err.message);
      }
    }

    loadData();
  }, [userId]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const appointment = await api.createPublicAppointment(userId, {
        serviceId: form.serviceId,
        customerName: form.customerName,
        customerPhone: form.customerPhone,
        startsAt: new Date(`${form.date}T${form.time}:00`).toISOString(),
        notes: form.notes || null,
      });

      setSuccess(appointment);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  if (error && !bookingData) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-brand-100 px-4">
        <div className="rounded-3xl border border-brand-300 bg-brand-50 p-8 text-center shadow-xl">
          <h1 className="text-2xl font-bold text-brand-900">
            Página não encontrada
          </h1>
          <p className="mt-3 text-slate-600">{error}</p>
        </div>
      </main>
    );
  }

  if (!bookingData) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-brand-100">
        <p className="text-brand-900">Carregando agendamento...</p>
      </main>
    );
  }

  if (success) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-brand-100 px-4">
        <div className="w-full max-w-md rounded-3xl border border-brand-300 bg-brand-50 p-8 text-center shadow-xl">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-brand-700 text-2xl text-white">
            ✓
          </div>

          <h1 className="text-2xl font-bold text-brand-900">
            Agendamento criado!
          </h1>

          <p className="mt-3 text-slate-600">
            {success.customerName}, seu atendimento de{" "}
            <strong>{success.service}</strong> foi agendado para{" "}
            {new Date(success.startsAt).toLocaleString("pt-BR")}.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-brand-100 px-4 py-12">
      <div className="mx-auto max-w-2xl">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-brand-900">
            Agendar com {bookingData.name}
          </h1>
          <p className="mt-2 text-slate-600">
            Escolha um serviço, data e horário disponível.
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-3xl border border-brand-300 bg-brand-50 p-8 shadow-xl"
        >
          <div>
            <label className="mb-1.5 block text-sm font-medium text-brand-900">
              Serviço
            </label>
            <select
              name="serviceId"
              value={form.serviceId}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-brand-300 bg-white px-4 py-3"
            >
              <option value="">Selecione um serviço</option>

              {bookingData.services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name} — R$ {(service.priceCents / 100).toFixed(2)} •{" "}
                  {service.durationMinutes} min
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-brand-900">
                Seu nome
              </label>
              <input
                name="customerName"
                value={form.customerName}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-brand-300 bg-white px-4 py-3"
                placeholder="Maria Silva"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-brand-900">
                WhatsApp
              </label>
              <input
                name="customerPhone"
                value={form.customerPhone}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-brand-300 bg-white px-4 py-3"
                placeholder="(11) 99999-9999"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-brand-900">
                Data
              </label>
              <input
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-brand-300 bg-white px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-brand-900">
                Horário
              </label>
              <input
                name="time"
                type="time"
                value={form.time}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-brand-300 bg-white px-4 py-3"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-brand-900">
              Observações
            </label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-xl border border-brand-300 bg-white px-4 py-3"
              placeholder="Alguma informação importante?"
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
            className="w-full rounded-xl bg-brand-700 px-4 py-3 font-semibold text-white transition hover:bg-brand-800 disabled:opacity-60"
          >
            {isLoading ? "Agendando..." : "Confirmar agendamento"}
          </button>
        </form>
      </div>
    </main>
  );
}
