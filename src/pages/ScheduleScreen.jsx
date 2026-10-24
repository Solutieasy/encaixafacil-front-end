import { useEffect, useState } from "react";
import { api } from "../services/api";

const weekdays = [
  { value: 0, label: "Domingo" },
  { value: 1, label: "Segunda-feira" },
  { value: 2, label: "Terça-feira" },
  { value: 3, label: "Quarta-feira" },
  { value: 4, label: "Quinta-feira" },
  { value: 5, label: "Sexta-feira" },
  { value: 6, label: "Sábado" },
];

const initialSchedule = weekdays.map((day) => ({
  weekday: day.value,
  startTime: "09:00",
  endTime: "18:00",
  enabled: false,
}));

export function ScheduleScreen({ onBack }) {
  const [schedule, setSchedule] = useState(initialSchedule);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadAvailability() {
      try {
        const data = await api.get("/dashboard/availability");

        setSchedule(
          weekdays.map((day) => {
            const saved = data.find((item) => item.weekday === day.value);

            return {
              weekday: day.value,
              startTime: saved?.startTime || "09:00",
              endTime: saved?.endTime || "18:00",
              enabled: Boolean(saved),
            };
          }),
        );
      } catch (err) {
        console.error(err);
        setError("Não foi possível carregar sua agenda.");
      } finally {
        setIsLoading(false);
      }
    }

    loadAvailability();
  }, []);

  function handleChange(weekday, field, value) {
    setSchedule((current) =>
      current.map((item) =>
        item.weekday === weekday
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);
    setMessage(null);

    const items = schedule
      .filter((item) => item.enabled)
      .map(({ weekday, startTime, endTime }) => ({
        weekday,
        startTime,
        endTime,
      }));

    if (items.length === 0) {
      setError("Selecione pelo menos um dia de atendimento.");
      return;
    }

    setIsSaving(true);

    try {
      await api.put("/dashboard/availability", { items });

      setMessage("Carga horária salva com sucesso!");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return <p className="text-slate-600">Carregando sua agenda...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-brand-900">Carga horária</h2>

        <button
          type="button"
          onClick={onBack}
          className="rounded-xl border border-brand-300 bg-white px-4 py-2 text-sm font-semibold text-brand-700"
        >
          ← Voltar
        </button>
      </div>

      <p className="text-slate-600">
        Defina os dias e horários em que você atende.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {schedule.map((item) => {
          const day = weekdays.find(
            (weekday) => weekday.value === item.weekday,
          );

          return (
            <div
              key={item.weekday}
              className="rounded-2xl border border-brand-300 bg-brand-50 p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-center gap-4">
                <label className="flex min-w-48 items-center gap-3">
                  <input
                    type="checkbox"
                    checked={item.enabled}
                    onChange={(event) =>
                      handleChange(
                        item.weekday,
                        "enabled",
                        event.target.checked,
                      )
                    }
                  />

                  <span className="font-semibold text-brand-900">
                    {day.label}
                  </span>
                </label>

                <div className="flex flex-1 flex-wrap items-center gap-3">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-500">
                      Início
                    </label>
                    <input
                      type="time"
                      value={item.startTime}
                      disabled={!item.enabled}
                      onChange={(event) =>
                        handleChange(
                          item.weekday,
                          "startTime",
                          event.target.value,
                        )
                      }
                      className="rounded-xl border border-brand-300 bg-white px-3 py-2 disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-500">
                      Fim
                    </label>
                    <input
                      type="time"
                      value={item.endTime}
                      disabled={!item.enabled}
                      onChange={(event) =>
                        handleChange(
                          item.weekday,
                          "endTime",
                          event.target.value,
                        )
                      }
                      className="rounded-xl border border-brand-300 bg-white px-3 py-2 disabled:opacity-50"
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {message && (
          <div className="rounded-xl border border-brand-300 bg-white p-3 text-sm text-brand-700">
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={isSaving}
          className="rounded-xl bg-brand-700 px-6 py-3 font-semibold text-white transition hover:bg-brand-800 disabled:opacity-60"
        >
          {isSaving ? "Salvando..." : "Salvar carga horária"}
        </button>
      </form>
    </div>
  );
}
