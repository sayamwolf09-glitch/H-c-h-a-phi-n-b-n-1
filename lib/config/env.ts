const REQUIRED = ["DATABASE_URL", "AUTH_SECRET", "NEXTAUTH_URL"] as const;

function readEnv(name: string): string | undefined {
  const value = process.env[name];
  return value && value.length > 0 ? value : undefined;
}

export function getRequiredEnv(name: (typeof REQUIRED)[number]): string {
  const value = readEnv(name);
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function validateRequiredEnv() {
  const missing = REQUIRED.filter((key) => !readEnv(key));
  return {
    ok: missing.length === 0,
    missing
  };
}

export function getUploadLimits() {
  return {
    image: Number(process.env.MAX_IMAGE_SIZE ?? 5 * 1024 * 1024),
    video: Number(process.env.MAX_VIDEO_SIZE ?? 50 * 1024 * 1024),
    audio: Number(process.env.MAX_AUDIO_SIZE ?? 20 * 1024 * 1024)
  };
}
