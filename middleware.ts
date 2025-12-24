import { NextRequest, NextResponse } from "next/server";

// NOTE:
// Ini bukan "anti DDoS total" (yang proper itu via Cloudflare/Vercel WAF).
// Tapi ini sudah bantu: rate limit basic + block user-agent aneh + security headers.

type Bucket = { count: number; resetAt: number };

// Edge runtime: memory bisa reset kapan saja, tapi tetap berguna untuk spam sederhana.
const g = globalThis as unknown as { __rl?: Map<string, Bucket> };
const store = (g.__rl ??= new Map<string, Bucket>());

function getClientIp(req: NextRequest) {
  // FIX: NextRequest.ip kadang ga ada di types => pakai header
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  const xrip = req.headers.get("x-real-ip");
  if (xrip) return xrip.trim();
  return "0.0.0.0";
}

function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const hit = store.get(key);

  if (!hit || hit.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1, resetAt: now + windowMs };
  }

  hit.count += 1;
  store.set(key, hit);

  if (hit.count > limit) {
    return { ok: false, remaining: 0, resetAt: hit.resetAt };
  }

  return { ok: true, remaining: limit - hit.count, resetAt: hit.resetAt };
}

export function middleware(req: NextRequest) {
  const ip = getClientIp(req);
  const ua = (req.headers.get("user-agent") || "").toLowerCase();
  const path = req.nextUrl.pathname;

  // Block user-agent super suspicious (basic)
  const badUA = ["python-requests", "curl/", "wget", "httpclient", "scrapy"];
  if (badUA.some((b) => ua.includes(b))) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  // Rate limit: 90 req / 10 detik per IP per path group
  // (tweak sesuai kebutuhan)
  const key = `${ip}:${path.startsWith("/api") ? "api" : "page"}`;
  const rl = rateLimit(key, 90, 10_000);

  if (!rl.ok) {
    const res = new NextResponse("Too Many Requests", { status: 429 });
    res.headers.set("Retry-After", String(Math.ceil((rl.resetAt - Date.now()) / 1000)));
    res.headers.set("X-RateLimit-Limit", "90");
    res.headers.set("X-RateLimit-Remaining", "0");
    return res;
  }

  const res = NextResponse.next();

  // Security headers
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  res.headers.set("Cross-Origin-Opener-Policy", "same-origin");
  res.headers.set("Cross-Origin-Resource-Policy", "same-origin");
  res.headers.set("Cross-Origin-Embedder-Policy", "require-corp");

  // HSTS (aktifkan kalau sudah https)
  res.headers.set("Strict-Transport-Security", "max-age=15552000; includeSubDomains");

  // Observability
  res.headers.set("X-RateLimit-Limit", "90");
  res.headers.set("X-RateLimit-Remaining", String(rl.remaining));

  return res;
}

// Jangan ganggu file static Next
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|webp|svg|gif|ico|css|js)$).*)"],
};
