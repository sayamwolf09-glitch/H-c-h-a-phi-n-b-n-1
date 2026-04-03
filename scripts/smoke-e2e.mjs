const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

const routes = ["/", "/chon-che-do", "/dang-nhap", "/bang-xep-hang", "/qr-code"];

async function checkRoute(path) {
  const res = await fetch(`${BASE_URL}${path}`);
  if (res.status >= 500) {
    throw new Error(`Route ${path} returned ${res.status}`);
  }
  return { path, status: res.status };
}

async function main() {
  const results = [];
  for (const route of routes) {
    // eslint-disable-next-line no-await-in-loop
    results.push(await checkRoute(route));
  }

  console.log("✅ E2E smoke passed");
  for (const item of results) {
    console.log(`- ${item.path}: ${item.status}`);
  }
}

main().catch((error) => {
  console.error("❌ E2E smoke failed", error.message);
  process.exit(1);
});
