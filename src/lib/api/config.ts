/**
 * The only switch needed to choose the data source. Set API_MODE=real to use
 * Laravel; all other values keep the app on isolated mock data.
 */
export const API_MODE = process.env.NEXT_PUBLIC_API_MODE === "real" ? "real" : "mock";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";
