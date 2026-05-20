import api from "./api";

export async function registerUser(formData) {
  const { data } = await api.post("/api/auth/register", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function loginUser({ email, password }) {
  const { data } = await api.post("/api/auth/login", { email, password });
  return data;
}

export async function getMe() {
  const { data } = await api.get("/api/auth/me");
  return data;
}
