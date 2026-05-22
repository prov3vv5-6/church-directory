import api from "./api";

export async function getAllMembers() {
  const { data } = await api.get("/api/users");
  return data;
}

export async function getMember(id) {
  const { data } = await api.get(`/api/users/${id}`);
  return data;
}

export async function updateMember(id, formData) {
  const { data } = await api.put(`/api/users/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function deleteMember(id) {
  await api.delete(`/api/users/${id}`);
}

export async function changePassword(currentPassword, newPassword) {
  const { data } = await api.put('/api/users/change-password', { currentPassword, newPassword });
  return data;
}
