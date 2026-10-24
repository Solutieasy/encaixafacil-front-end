import { useEffect, useState } from "react";
import { api } from "../services/api";
import { useAuth } from "../contexts/AuthContext";

export function TodayScreen({ onBack }) {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  async function loadAppointments() {
    try {
      const data = await api.get("/dashboard/appointments/today");
      setAppointments(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function completeAppointment(appointmentId) {
    try {
      await api.patch(`/appointments/${appointmentId}/complete`);

      setAppointments((current) =>
        current.filter((item) => item.id !== appointmentId),
      );
    } catch (error) {
      console.error("Erro ao concluir agendamento:", error);
      alert("Não foi possível concluir o agendamento.");
    }
  }

  useEffect(() => {
    loadAppointments();
  }, []);

  function sendWhatsAppReminder(appointment) {
    const phone = appointment.customerPhone.replace(/\D/g, "");

    const startsAt = new Date(appointment.startsAt);

    const formattedDate = startsAt.toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "2-digit",
      month: "long",
    });

    const formattedTime = startsAt.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const professionalName = user?.name || "seu profissional";
    const serviceName = appointment.service?.name || "seu atendimento";

    const message = [
      `Olá, ${appointment.customerName}!`,
      "",
      `Este é um lembrete do seu atendimento na ${professionalName}.`,
      "",
      `📅 Serviço: ${serviceName}`,
      `🗓️ Data: ${formattedDate}`,
      `⏰ Horário: ${formattedTime}`,
      "",
      "Por favor, responda esta mensagem para confirmar sua presença.",
      "",
      "Se precisar remarcar ou cancelar, entre em contato conosco.",
    ].join("\n");

    window.open(`https://wa.me/55${phone}?text=${message}`, "_blank");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-brand-900">
          Agendamentos do dia
        </h2>

        <button
          type="button"
          onClick={onBack}
          className="rounded-xl border border-brand-300 bg-white px-4 py-2 text-sm font-semibold text-brand-700"
        >
          ← Voltar
        </button>
      </div>

      {isLoading ? (
        <p className="text-slate-600">Carregando agendamentos...</p>
      ) : appointments.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-brand-300 bg-brand-50 p-10 text-center">
          <p className="text-lg font-semibold text-brand-900">
            Nenhum agendamento para hoje
          </p>
        </div>
      ) : (
        <ul className="space-y-4">
          {appointments.map((appointment) => (
            <li
              key={appointment.id}
              className="rounded-2xl border border-brand-300 bg-brand-50 p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-brand-900">
                    {appointment.customerName}
                  </h3>
                  <p className="text-sm text-slate-600">
                    {appointment.service.name}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {new Date(appointment.startsAt).toLocaleTimeString(
                      "pt-BR",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      },
                    )}
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => sendWhatsAppReminder(appointment)}
                    className="rounded-xl bg-brand-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-800"
                  >
                    Enviar lembrete no WhatsApp
                  </button>

                  <button
                    type="button"
                    onClick={() => completeAppointment(appointment.id)}
                    className="rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700"
                  >
                    Concluir
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
