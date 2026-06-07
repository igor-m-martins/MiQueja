export const API_BASE = import.meta.env.VITE_API_BASE_URL ||
  "https://eliteworldwidecompany.pythonanywhere.com/miqueja/api";

export function buildUrl(path = "") {
  if (!path) return API_BASE;
  return API_BASE + (path.startsWith("/") ? path : `/${path}`);
}

export default API_BASE;
