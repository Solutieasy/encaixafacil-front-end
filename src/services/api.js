const BASE_URL = import.meta.env.VITE_API_URL;

class ApiService {
  getToken() {
    return sessionStorage.getItem("encaixafacil_token");
  }

  async request(path, options = {}) {
    const token = this.getToken();

    const response = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.error || "Erro na requisição.");
    }

    return data;
  }

  async login(credentials) {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  async getMe() {
    return this.request("/auth/me");
  }

  async register(payload) {
    return this.request("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  async createCheckoutSession(plan) {
    return this.request("/billing/checkout-session", {
      method: "POST",
      body: JSON.stringify({ plan }),
    });
  }

  async getAccess() {
    return this.request("/billing/access");
  }

  async get(path) {
    return this.request(path);
  }

  async post(path, body) {
    return this.request(path, {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  async put(path, body) {
    return this.request(path, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  }

  async patch(path, body) {
    return this.request(path, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
  }

  async delete(path) {
    return this.request(path, { method: "DELETE" });
  }

  async getPublicBookingData(userId) {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/public/${userId}/booking`,
    );

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.error || "Página não encontrada.");
    }

    return data;
  }

  async createPublicAppointment(userId, payload) {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/public/${userId}/appointments`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      },
    );

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.error || "Não foi possível criar o agendamento.");
    }

    return data;
  }

  async getAvailableSlots(userId, date, serviceId) {
    const query = new URLSearchParams({ date, serviceId });

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/public/${userId}/availability?${query}`,
    );

    console.log("Status dos horários:", response.status);

    const data = await response.json().catch(() => ({}));

    console.log("Resposta dos horários:", data);

    if (!response.ok) {
      throw new Error(data.error || "Não foi possível carregar os horários.");
    }

    return data;
  }
}

export const api = new ApiService();
