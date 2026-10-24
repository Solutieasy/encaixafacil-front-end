import { useEffect, useState } from "react";
import { api } from "../services/api";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  durationMinutes: "",
  active: true,
};

export function ServicesScreen() {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);

  async function loadServices() {
    const data = await api.get("/dashboard/services");
    setServices(data);
  }

  useEffect(() => {
    loadServices();
  }, []);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);

    try {
      const payload = {
        ...form,
        price: Number(form.price),
        durationMinutes: Number(form.durationMinutes),
      };

      if (editingId) {
        await api.put(`/dashboard/services/${editingId}`, payload);
      } else {
        await api.post("/dashboard/services", payload);
      }

      setForm(emptyForm);
      setEditingId(null);
      await loadServices();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    await api.delete(`/dashboard/services/${id}`);
    await loadServices();
  }

  function handleEdit(service) {
    setEditingId(service.id);
    setForm({
      name: service.name,
      description: service.description || "",
      price: (service.priceCents / 100).toFixed(2),
      durationMinutes: service.durationMinutes,
      active: service.active,
    });
  }

  return (
    <div className="space-y-8">
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-brand-300 bg-brand-50 p-6 shadow-sm"
      >
        <h2 className="text-xl font-semibold text-brand-900">
          {editingId ? "Editar serviço" : "Novo serviço"}
        </h2>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Nome do serviço"
            required
            className="rounded-xl border border-brand-300 bg-white px-4 py-3"
          />

          <input
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="Preço em reais"
            type="number"
            step="0.01"
            min="0.01"
            required
            className="rounded-xl border border-brand-300 bg-white px-4 py-3"
          />

          <input
            name="durationMinutes"
            value={form.durationMinutes}
            onChange={handleChange}
            placeholder="Duração em minutos"
            type="number"
            min="1"
            required
            className="rounded-xl border border-brand-300 bg-white px-4 py-3"
          />

          <input
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Descrição"
            className="rounded-xl border border-brand-300 bg-white px-4 py-3"
          />
        </div>

        <label className="mt-4 flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            name="active"
            checked={form.active}
            onChange={handleChange}
          />
          Serviço ativo
        </label>

        {error && (
          <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="mt-5 rounded-xl bg-brand-700 px-6 py-3 font-semibold text-white transition hover:bg-brand-800"
        >
          {editingId ? "Atualizar serviço" : "Cadastrar serviço"}
        </button>
      </form>

      <div className="space-y-4">
        {services.map((service) => (
          <article
            key={service.id}
            className="rounded-2xl border border-brand-300 bg-brand-50 p-5 shadow-sm"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-brand-900">
                  {service.name}
                </h3>
                <p className="text-sm text-slate-600">
                  {service.description || "Sem descrição"}
                </p>
                <p className="mt-2 text-sm font-semibold text-brand-700">
                  R$ {(service.priceCents / 100).toFixed(2)} •{" "}
                  {service.durationMinutes} min
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleEdit(service)}
                  className="rounded-xl border border-brand-300 bg-white px-4 py-2 text-sm font-semibold text-brand-700"
                >
                  Editar
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(service.id)}
                  className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white"
                >
                  Remover
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
