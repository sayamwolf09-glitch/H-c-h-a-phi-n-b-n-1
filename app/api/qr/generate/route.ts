import QRCode from "qrcode";
import { fail, ok } from "@/lib/utils/api-response";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const target = url.searchParams.get("target");

  if (!target) return fail("Thiếu target", 422);

  const qrDataUrl = await QRCode.toDataURL(target, {
    width: 512,
    margin: 2,
    color: {
      dark: "#0F172A",
      light: "#FFFFFF"
    }
  });

  return ok({ target, qrDataUrl });
}
