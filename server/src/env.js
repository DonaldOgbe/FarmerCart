import "dotenv/config";

function required(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}. See .env.example.`);
  }
  return value;
}


function numberOr(name, fallback) {
  const raw = process.env[name];
  if (!raw) return fallback;

  const parsed = Number(raw);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`Environment variable ${name} must be a positive integer, got "${raw}".`);
  }
  return parsed;
}


function arrayOr(name, fallback = []) {
  const raw = process.env[name];
  if (!raw) return fallback;

  return raw
    .split(",")
    .map((url) => url.trim())
    .filter(Boolean);
}

function urlOr(name, fallback) {
  const raw = process.env[name];
  if (!raw) return fallback;

  try {
    return new URL(raw).origin;
  } catch {
    throw new Error(`Environment variable ${name} must be a valid URL, got "${raw}".`);
  }
}

export const DATABASE_URL = required("DATABASE_URL");
export const JWT_SECRET = required("JWT_SECRET");
export const JWT_EXPIRES_IN = process.env["JWT_EXPIRES_IN"] ?? "7d";
export const PORT = numberOr("PORT", 3000);
export const BCRYPT_SALT_ROUNDS = numberOr("BCRYPT_SALT_ROUNDS", 10);
export const NODE_ENV = process.env["NODE_ENV"] ?? "development";
export const CLOUDINARY_CLOUD_NAME = required("CLOUDINARY_CLOUD_NAME");
export const CLOUDINARY_API_KEY = required("CLOUDINARY_API_KEY");
export const CLOUDINARY_API_SECRET = required("CLOUDINARY_API_SECRET");
export const PAYSTACK_SECRET_KEY = required("PAYSTACK_SECRET_KEY");
export const FRONTEND_URL = urlOr("FRONTEND_URL", "http://localhost:5173");
export const ALLOWED_ORIGINS = arrayOr("ALLOWED_ORIGINS", [FRONTEND_URL]);