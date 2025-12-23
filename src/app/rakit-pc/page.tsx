"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

const ADMIN_WA = "6285298747600"; // nomor admin (tanpa +)

type Kegunaan =
  | "Gaming"
  | "Editing"
  | "Streaming"
  | "Office"
  | "Sekolah/Kuliah"
  | "Rendering/3D"
  | "Lainnya";

function normalizeWA(input: string) {
  // buat tampilan rapi + umum dipakai: 08xxx / +62xxx / 62xxx
  let v = input.trim().replace(/\s+/g, "");
  if (!v) return "";
  if (v.startsWith("+")) v = v.slice(1);
  if (v.startsWith("08")) v = "62" + v.slice(1);
  return v.replace(/[^0-9]/g, "");
}

export default function RakitPcPage() {
  const [nama, setNama] = useState("");
  const [wa, setWa] = useState("");
  const [domisili, setDomisili] = useState("");
  const [kegunaan, setKegunaan] = useState<Kegunaan>("Gaming");
  const [budget, setBudget] = useState("");
  const [catatan, setCatatan] = useState("");

  const waNormalized = useMemo(() => normalizeWA(wa), [wa]);

  const pesan = useMemo(() => {
    // format sesuai permintaan kamu
    return (
      `FORM RAKIT PC\n` +
      `Nama: ${nama || "-"}\n` +
      `WA: ${waNormalized || "-"}\n` +
      `Domisili: ${domisili || "-"}\n` +
      `Kegunaan: ${kegunaan || "-"}\n` +
      `Budget: ${budget || "-"}\n` +
      `Catatan: ${catatan || "-"}`
    );
  }, [nama, waNormalized, domisili, kegunaan, budget, catatan]);

  function kirimWhatsApp() {
    const text = encodeURIComponent(pesan);
    window.location.href = `https://wa.me/${ADMIN_WA}?text=${text}`;
  }

  async function salinPesan() {
    try {
      await navigator.clipboard.writeText(pesan);
      alert("Pesan berhasil disalin!");
    } catch {
      // fallback
      const ta = document.createElement("textarea");
      ta.value = pesan;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      alert("Pesan berhasil disalin!");
    }
  }

  const theme = {
    gold: "#d6b45c",
    red: "#ff3b3b",
    silver: "#c9c9c9",
    bg: "#0b0f14",
    panel: "rgba(16, 22, 30, 0.72)",
    border: "rgba(255,255,255,0.10)",
    input: "rgba(0,0,0,0.35)",
    text: "#eaf2ff",
    muted: "rgba(234,242,255,0.70)",
  } as const;

  // biar TS tidak ribet untuk CSS variables
  const cssVars = {
    "--c-gold": theme.gold,
    "--c-red": theme.red,
    "--c-silver": theme.silver,
  } as React.CSSProperties;

  return (
    <div style={{ ...cssVars }} className="page">
      {/* background glow */}
      <div className="bgGlow" />

      <main className="wrap">
        {/* logo (tanpa bulatan) */}
        <div className="logoRow">
          <Image
            src="/ir-logo.png"
            alt="IR Computer"
            width={140}
            height={140}
            priority
            className="logo"
          />
        </div>

        <h1 className="title">
          <span className="titleLeft">Form Rakit</span>{" "}
          <span className="titleRight">PC</span>
        </h1>
        <p className="subtitle">IR Computer — Konsultasi Cepat via WhatsApp</p>

        <section className="card">
          <div className="field">
            <label>Nama Kamu:</label>
            <input
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Masukkan nama"
              autoComplete="name"
            />
          </div>

          <div className="field">
            <label>Nomor WhatsApp Kamu:</label>
            <input
              value={wa}
              onChange={(e) => setWa(e.target.value)}
              placeholder="contoh: 08xxxxxxxxxx"
              inputMode="tel"
              autoComplete="tel"
            />
            <div className="hint">
              Format otomatis: <b>{waNormalized || "-"}</b>
            </div>
          </div>

          <div className="field">
            <label>Domisili/alamat:</label>
            <input
              value={domisili}
              onChange={(e) => setDomisili(e.target.value)}
              placeholder="contoh: Makassar / Gowa"
            />
          </div>

          <div className="field">
            <label>Kegunaan:</label>
            <select
              value={kegunaan}
              onChange={(e) => setKegunaan(e.target.value as Kegunaan)}
            >
              <option>Gaming</option>
              <option>Editing</option>
              <option>Streaming</option>
              <option>Office</option>
              <option>Sekolah/Kuliah</option>
              <option>Rendering/3D</option>
              <option>Lainnya</option>
            </select>
          </div>

          <div className="field">
            <label>Budget:</label>
            <input
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="contoh: 5 juta / 8 juta / 12 juta"
            />
          </div>

          <div className="field">
            <label>Catatan:</label>
            <textarea
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              placeholder="contoh: mau full set + monitor, fokus fps, dll"
              rows={4}
            />
          </div>

          <div className="actions">
            <button className="btnPrimary" onClick={kirimWhatsApp}>
              Kirim WhatsApp
            </button>
            <button className="btnGhost" onClick={salinPesan}>
              Salin Pesan
            </button>
          </div>

          <div className="preview">
            <div className="previewTitle">Preview Pesan</div>
            <pre className="previewBox">{pesan}</pre>
          </div>
        </section>
      </main>

      <style jsx>{`
        .page {
          min-height: 100vh;
          background: ${theme.bg};
          color: ${theme.text};
          position: relative;
          overflow: hidden;
          padding: 48px 16px;
          font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto,
            Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji";
        }

        .bgGlow {
          position: absolute;
          inset: -40%;
          background: radial-gradient(
              700px 400px at 20% 20%,
              rgba(0, 255, 180, 0.16),
              transparent 60%
            ),
            radial-gradient(
              800px 500px at 80% 30%,
              rgba(255, 59, 59, 0.12),
              transparent 60%
            ),
            radial-gradient(
              700px 500px at 60% 90%,
              rgba(214, 180, 92, 0.12),
              transparent 60%
            );
          filter: blur(18px);
          pointer-events: none;
        }

        .wrap {
          position: relative;
          max-width: 860px;
          margin: 0 auto;
          text-align: center;
        }

        .logoRow {
          display: flex;
          justify-content: center;
          margin-bottom: 14px;
        }

        .logo {
          height: auto;
          width: 120px;
          object-fit: contain;
          filter: drop-shadow(0 10px 28px rgba(0, 0, 0, 0.55));
        }

        .title {
          margin: 6px 0 8px;
          font-size: clamp(34px, 4.4vw, 56px);
          line-height: 1.05;
          letter-spacing: -0.02em;
          font-weight: 900;
        }
        .titleLeft {
          background: linear-gradient(90deg, #ffffff, var(--c-silver));
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        .titleRight {
          background: linear-gradient(90deg, var(--c-gold), var(--c-red));
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .subtitle {
          margin: 0 0 22px;
          color: ${theme.muted};
          font-size: 16px;
        }

        .card {
          margin: 0 auto;
          max-width: 680px;
          text-align: left;
          background: ${theme.panel};
          border: 1px solid ${theme.border};
          border-radius: 18px;
          padding: 20px;
          box-shadow: 0 20px 55px rgba(0, 0, 0, 0.45);
          backdrop-filter: blur(10px);
        }

        .field {
          margin-bottom: 14px;
        }
        label {
          display: block;
          font-weight: 800;
          margin-bottom: 8px;
          font-size: 18px;
        }

        input,
        select,
        textarea {
          width: 100%;
          background: ${theme.input};
          border: 1px solid ${theme.border};
          color: ${theme.text};
          border-radius: 14px;
          padding: 14px 14px;
          outline: none;
          font-size: 16px;
          transition: border 0.15s ease, box-shadow 0.15s ease;
        }

        input:focus,
        select:focus,
        textarea:focus {
          border-color: rgba(214, 180, 92, 0.55);
          box-shadow: 0 0 0 4px rgba(214, 180, 92, 0.12);
        }

        .hint {
          margin-top: 8px;
          font-size: 13px;
          color: ${theme.muted};
        }

        .actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-top: 10px;
        }

        .btnPrimary,
        .btnGhost {
          border-radius: 14px;
          padding: 14px 14px;
          font-weight: 900;
          font-size: 15px;
          cursor: pointer;
          border: 1px solid ${theme.border};
          transition: transform 0.08s ease, filter 0.15s ease,
            border-color 0.15s ease;
        }

        .btnPrimary {
          background: linear-gradient(90deg, var(--c-gold), var(--c-red));
          color: #0b0f14;
          border-color: rgba(255, 255, 255, 0.12);
        }

        .btnGhost {
          background: rgba(255, 255, 255, 0.04);
          color: ${theme.text};
        }

        .btnPrimary:active,
        .btnGhost:active {
          transform: translateY(1px);
        }

        .preview {
          margin-top: 16px;
        }
        .previewTitle {
          font-weight: 900;
          margin-bottom: 8px;
          color: ${theme.muted};
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-size: 12px;
        }
        .previewBox {
          background: rgba(0, 0, 0, 0.35);
          border: 1px solid ${theme.border};
          border-radius: 14px;
          padding: 14px;
          white-space: pre-wrap;
          word-break: break-word;
          font-size: 14px;
          line-height: 1.45;
        }

        @media (max-width: 520px) {
          .actions {
            grid-template-columns: 1fr;
          }
          .logo {
            width: 105px;
          }
          label {
            font-size: 17px;
          }
        }
      `}</style>
    </div>
  );
}
