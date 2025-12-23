import Link from "next/link";

export default function HomePage() {
  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
      <div style={{ maxWidth: 520, width: "100%", textAlign: "center" }}>
        <h1 style={{ margin: 0, fontSize: 32, letterSpacing: 0.3 }}>IR Computer</h1>
        <p style={{ marginTop: 10, opacity: 0.8 }}>
          Buka form rakit PC versi Next.js.
        </p>
        <Link
          href="/rakit-pc"
          style={{
            display: "inline-block",
            marginTop: 16,
            padding: "12px 18px",
            borderRadius: 12,
            textDecoration: "none",
            color: "white",
            border: "1px solid rgba(255,255,255,0.14)",
            background:
              "linear-gradient(135deg, rgba(214,177,90,0.95), rgba(210,42,42,0.85))",
            boxShadow: "0 14px 30px rgba(0,0,0,0.45)",
            fontWeight: 700,
          }}
        >
          Buka Form Rakit PC →
        </Link>
      </div>
    </main>
  );
}
