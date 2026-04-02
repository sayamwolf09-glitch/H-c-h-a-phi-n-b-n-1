const required = ["DATABASE_URL", "AUTH_SECRET", "NEXTAUTH_URL"];
const missing = required.filter((key) => !process.env[key]);

if (missing.length > 0) {
  for (const key of missing) {
    console.error(`❌ Missing env: ${key}`);
  }
  console.error("\nPreflight failed. Vui lòng kiểm tra file .env trước khi chạy app.");
  process.exit(1);
}

console.log("✅ Preflight passed.");
