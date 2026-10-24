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
}

export const api = new ApiService();
