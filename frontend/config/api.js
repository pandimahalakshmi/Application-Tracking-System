const rawApiUrl = import.meta.env.VITE_API_URL;

if (!rawApiUrl) {
  throw new Error("Missing VITE_API_URL. Set it in your frontend environment variables.");
}

const normalizedApiBase = rawApiUrl.replace(/\/+$/, "");

export const API_BASE_URL = normalizedApiBase;
export const API_ORIGIN = normalizedApiBase.replace(/\/api$/, "");
