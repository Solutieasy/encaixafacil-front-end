const BASE_URL = import.meta.env.VITE_API_URL;

class ApiService {
  async get(path) {
    const response = await fetch(`${BASE_URL}${path}`);

    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }

    return response.json();
  }
}

export const api = new ApiService();
