"use client";

import Image from "next/image";
import { useMemo, useState, useEffect } from "react";
import home from "./Home.module.css";
import form from "./rakit-pc/RakitPc.module.css";
import HomeSlider from "./HomeSlider";

const ADMIN_WA = "6285298747600";

// Link kamu
const IG_URL = "https://www.instagram.com/ircomputer_mks";
const TT_URL = "https://www.tiktok.com/@ircomputer_mks";
const SHOPEE_URL = "https://shopee.co.id/ircomputer";

type Province = { id: string; name: string };
type Regency = { id: string; province_id: string; name: string };

function normalizeWA(input: string) {
  const d = input.replace(/\D/g, "");
  if (!d) return "";
  if (d.startsWith("0")) return "62" + d.slice(1);
  if (d.startsWith("62")) return d;
  if (d.startsWith("8")) return "62" + d;
  return d;
}

function formatRupiah(n: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);
}

function Icon({ name }: { name: "ig" | "tt" | "shop" | "wa" }) {
  // Simple inline SVG (biar tanpa install library)
  if (name === "ig")
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9A5.5 5.5 0 0 1 16.5 22h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2Z"
          stroke="currentColor" strokeWidth="1.6"
        />
        <path
          d="M12 16.2a4.2 4.2 0 1 0 0-8.4 4.2 4.2 0 0 0 0 8.4Z"
          stroke="currentColor" strokeWidth="1.6"
        />
        <path
          d="M17.7 6.6h.01"
          stroke="currentColor" strokeWidth="3" strokeLinecap="round"
        />
      </svg>
    );
  if (name === "tt")
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M14 3v10.2a3.8 3.8 0 1 1-3.5-3.8"
          stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"
        />
        <path
          d="M14 3c1.3 2.4 3.4 3.7 6 3.9"
          stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"
        />
      </svg>
    );
  if (name === "shop")
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M6 7h15l-1.2 12.5a2 2 0 0 1-2 1.8H7.2a2 2 0 0 1-2-1.8L4 3h4"
          stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"
        />
        <path
          d="M9 10a3 3 0 0 0 6 0"
          stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"
        />
      </svg>
    );
  // wa
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M20 11.8a7.8 7.8 0 0 1-11.8 6.8L4 20l1.5-3.8A7.8 7.8 0 1 1 20 11.8Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M9.3 8.8c.3-.7.6-.7 1.1-.7.2 0 .5 0 .7.1.2.1.5.3.6.6l.5 1.2c.1.3.1.6-.1.8l-.4.4c-.1.1-.2.3-.1.5.2.6 1.1 1.7 2.4 2.3.2.1.4 0 .5-.1l.4-.4c.2-.2.5-.2.8-.1l1.2.5c.3.1.5.4.6.6.1.2.1.5.1.7 0 .5 0 .8-.7 1.1-.7.3-1.9.4-3.6-.3-1.7-.7-3.6-2.4-4.6-4.2-1-1.8-.7-3-.4-3.7Z"
        fill="currentColor"
        opacity="0.9"
      />
    </svg>
  );
}

export default function Page() {
  // ==== SLIDER (gambar taruh di /public/slider/*) ====
  const slides = useMemo(
    () => [
      { src: "/slider/slide1.jpg", alt: "IR Computer - Rakit PC" },
    ],
    []
  );

  // ==== FORM STATE ====
  const [nama, setNama] = useState("");
  const [wa, setWa] = useState("");

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [regencies, setRegencies] = useState<Regency[]>([]);
  const [provinceId, setProvinceId] = useState("");
  const [regencyId, setRegencyId] = useState("");

  const [kegunaan, setKegunaan] = useState("Gaming");

  // budget diketik normal (digits). preview rupiah di bawahnya.
  const [budgetDigits, setBudgetDigits] = useState("");
  const budgetNumber = useMemo(() => Number(budgetDigits || "0"), [budgetDigits]);
  const budgetPretty = useMemo(
    () => (budgetDigits ? formatRupiah(budgetNumber) : ""),
    [budgetDigits, budgetNumber]
  );

  const [catatan, setCatatan] = useState("");

  // anti-bot basic (honeypot). jangan diisi.
  const [hp, setHp] = useState("");

  const waFix = useMemo(() => normalizeWA(wa), [wa]);

  // ==== DATA WILAYAH ====
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(
          "https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json",
          { cache: "force-cache" }
        );
        const data = (await res.json()) as Province[];
        if (!cancelled) setProvinces(Array.isArray(data) ? data : []);
      } catch {
        if (!cancelled) setProvinces([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!provinceId) {
        setRegencies([]);
        return;
      }
      try {
        const res = await fetch(
          `https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${provinceId}.json`,
          { cache: "no-store" }
        );
        const data = (await res.json()) as Regency[];
        if (!cancelled) setRegencies(Array.isArray(data) ? data : []);
      } catch {
        if (!cancelled) setRegencies([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [provinceId]);

  const provinceName = useMemo(
    () => provinces.find((p) => p.id === provinceId)?.name || "",
    [provinceId, provinces]
  );
  const regencyName = useMemo(
    () => regencies.find((r) => r.id === regencyId)?.name || "",
    [regencyId, regencies]
  );

  const domisiliText = useMemo(() => {
    if (!provinceName || !regencyName) return "-";
    return `${regencyName}, ${provinceName}`;
  }, [provinceName, regencyName]);

  const pesan = useMemo(() => {
    const safe = (v: string) => (v?.trim() ? v.trim() : "-");
    return (
      "FORM RAKIT PC (IR COMPUTER)\n" +
      `Nama: ${safe(nama)}\n` +
      `WA: ${safe(waFix)}\n` +
      `Domisili: ${safe(domisiliText)}\n` +
      `Kegunaan: ${safe(kegunaan)}\n` +
      `Budget: ${safe(budgetPretty)}\n` +
      `Catatan: ${safe(catatan)}`
    );
  }, [nama, waFix, domisiliText, kegunaan, budgetPretty, catatan]);

  function scrollToForm() {
    document.getElementById("form-rakit")?.scrollIntoView({ behavior: "smooth" });
  }

  function kirimWA() {
    // honeypot keisi = bot
    if (hp.trim()) return;

    if (!nama.trim() || !waFix || !provinceId || !regencyId || !budgetDigits) {
      alert("Lengkapi: Nama, WhatsApp, Provinsi, Kabupaten/Kota, dan Budget.");
      return;
    }

    window.open(
      `https://wa.me/${ADMIN_WA}?text=${encodeURIComponent(pesan)}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  async function salinPesan() {
    try {
      await navigator.clipboard.writeText(pesan);
      alert("Pesan berhasil disalin");
    } catch {
      alert("Gagal menyalin pesan (izin clipboard ditolak).");
    }
  }

  const chips = [
    "Mau casing putih",
    "Wajib WiFi",
    "Butuh monitor",
    "Butuh UPS",
    "Request RGB",
    "Prioritas hemat listrik",
  ];

  // FAQ simple
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <main className={home.page}>
      <div className={home.bgGlow} />

      <div className={home.wrap}>
        {/* TOPBAR - logo dari /public */}
        <div className={home.topbar}>
          <div className={home.brand}>
            {/* LOGO taruh di: /public/ir-logo.png */}
            <Image
              src="/ir-logo.png"
              alt="IR Computer"
              width={48}
              height={48}
              priority
              className={home.brandLogo}
            />
            <div className={home.brandText}>
              <p className={home.brandName}>IR Computer Makassar</p>
              <p className={home.brandTag}>Rakit PC • Upgrade • Service • Konsultasi Cepat</p>
            </div>
          </div>

          <div className={home.actions}>
            <a className={home.iconBtn} href={IG_URL} target="_blank" rel="noreferrer" aria-label="Instagram">
              <Icon name="ig" />
            </a>
            <a className={home.iconBtn} href={TT_URL} target="_blank" rel="noreferrer" aria-label="TikTok">
              <Icon name="tt" />
            </a>
            <a className={home.iconBtn} href={SHOPEE_URL} target="_blank" rel="noreferrer" aria-label="Shopee">
              <Icon name="shop" />
            </a>
            <button className={home.primaryBtn} onClick={scrollToForm}>
              Rakit PC Sekarang <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>

        {/* HERO */}
        <section className={home.hero}>
          <h1 className={home.title}>
            Build PC Impianmu, <span className={home.titleGrad}>Cepat & Rapi</span>
          </h1>
          <p className={home.sub}>
            Isi form, kirim ke WhatsApp, dan kamu dapat rekomendasi part sesuai kebutuhan + budget.
            Bisa untuk Gaming, Editing, Streaming, Office.
          </p>

          <div className={home.badges}>
            <div className={home.badge}>✅ Konsultasi cepat</div>
            <div className={home.badge}>✅ Part sesuai budget</div>
            <div className={home.badge}>✅ Bisa request warna/tema</div>
            <div className={home.badge}>✅ Ready upgrade & service</div>
          </div>
        </section>

        {/* SLIDER */}
        <div className={home.sliderWrap}>
          <HomeSlider slides={slides} />
        </div>

        {/* FEATURE CARDS */}
        <div className={home.grid}>
          <div className={home.card}>
            <h3 className={home.cardTitle}>Rakit PC (Custom)</h3>
            <p className={home.cardDesc}>
              Rekomendasi komponen sesuai budget + kebutuhan. Bisa fokus FPS, multitasking, render, dll.
            </p>
            <div className={home.cardRow}>
              <button className={home.miniBtn} onClick={scrollToForm}>Mulai isi form</button>
              <a className={home.miniBtn} href={`https://wa.me/${ADMIN_WA}`} target="_blank" rel="noreferrer">
                Chat WhatsApp
              </a>
            </div>
          </div>

          <div className={home.card}>
            <h3 className={home.cardTitle}>Upgrade & Service</h3>
            <p className={home.cardDesc}>
              Upgrade RAM/SSD/VGA, bersih-bersih, thermal repaste, optimasi, dan cek kesehatan komponen.
            </p>
            <div className={home.cardRow}>
              <a className={home.miniBtn} href={IG_URL} target="_blank" rel="noreferrer">Lihat IG</a>
              <a className={home.miniBtn} href={TT_URL} target="_blank" rel="noreferrer">Lihat TikTok</a>
            </div>
          </div>

          <div className={home.card}>
            <h3 className={home.cardTitle}>Belanja di Shopee</h3>
            <p className={home.cardDesc}>
              Mau langsung checkout? Cek produk & promo di toko resmi.
            </p>
            <div className={home.cardRow}>
              <a className={home.miniBtn} href={SHOPEE_URL} target="_blank" rel="noreferrer">
                Buka Shopee
              </a>
              <a className={home.miniBtn} href={`https://wa.me/${ADMIN_WA}`} target="_blank" rel="noreferrer">
                Tanya stok
              </a>
            </div>
          </div>

          <div className={home.card}>
            <h3 className={home.cardTitle}>Estimasi Cepat</h3>
            <p className={home.cardDesc}>
              Isi budget + kebutuhan, nanti format pesan otomatis siap kirim ke admin.
            </p>
            <div className={home.cardRow}>
              <button className={home.miniBtn} onClick={scrollToForm}>Ke Form</button>
              <a className={home.miniBtn} href={`https://wa.me/${ADMIN_WA}?text=${encodeURIComponent("Halo IR Computer, saya mau konsultasi rakit PC.")}`} target="_blank" rel="noreferrer">
                Template Chat
              </a>
            </div>
          </div>
        </div>

        {/* FORM */}
        <section id="form-rakit" className={form.page}>
          <div className={form.header}>
            <h2 className={form.title}>Form Rakit PC</h2>
            <p className={form.sub}>
              Isi data → preview pesan → kirim WhatsApp.
            </p>
          </div>

          <div className={form.card}>
            <div className={form.watermark}>
              made by students from Telkom Makassar Vocational School
            </div>

            {/* honeypot (disembunyikan) */}
            <input
              value={hp}
              onChange={(e) => setHp(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              style={{
                position: "absolute",
                left: "-10000px",
                top: "auto",
                width: "1px",
                height: "1px",
                overflow: "hidden",
              }}
              aria-hidden="true"
            />

            <div className={form.grid}>
              <div className={`${form.field} ${form.half}`}>
                <label className={form.label}>Nama</label>
                <input
                  className={form.input}
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Nama lengkap"
                  autoComplete="name"
                />
              </div>

              <div className={`${form.field} ${form.half}`}>
                <label className={form.label}>WhatsApp</label>
                <input
                  className={form.input}
                  value={wa}
                  onChange={(e) => setWa(e.target.value)}
                  placeholder="08xxxxxxxxxx"
                  inputMode="tel"
                  autoComplete="tel"
                />
                <div className={form.help}>Format otomatis: <b>{waFix || "-"}</b></div>
              </div>

              <div className={`${form.field} ${form.half}`}>
                <label className={form.label}>Provinsi</label>
                <select
                  className={form.select}
                  value={provinceId}
                  onChange={(e) => {
                    const next = e.target.value;
                    setProvinceId(next);
                    setRegencyId(""); // reset di handler (bukan di effect) => no ESLint warning
                  }}
                >
                  <option value="">Pilih Provinsi</option>
                  {provinces.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className={`${form.field} ${form.half}`}>
                <label className={form.label}>Kabupaten / Kota</label>
                <select
                  className={form.select}
                  value={regencyId}
                  onChange={(e) => setRegencyId(e.target.value)}
                  disabled={!provinceId}
                >
                  <option value="">
                    {provinceId ? "Pilih Kabupaten/Kota" : "Pilih provinsi dulu"}
                  </option>
                  {regencies.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className={`${form.field} ${form.half}`}>
                <label className={form.label}>Kegunaan</label>
                <select
                  className={form.select}
                  value={kegunaan}
                  onChange={(e) => setKegunaan(e.target.value)}
                >
                  <option value="Gaming">Gaming</option>
                  <option value="Editing">Editing</option>
                  <option value="Streaming">Streaming</option>
                  <option value="Office">Office</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <div className={`${form.field} ${form.half}`}>
                <label className={form.label}>Budget (angka)</label>
                <input
                  className={form.input}
                  value={budgetDigits}
                  onChange={(e) => {
                    const digits = e.target.value.replace(/\D/g, "");
                    setBudgetDigits(digits);
                  }}
                  placeholder="contoh: 12000000"
                  inputMode="numeric"
                />
                <div className={form.help}>
                  Preview: <b>{budgetPretty || "-"}</b>
                </div>
              </div>

              <div className={form.field}>
                <label className={form.label}>Catatan (opsional)</label>
                <textarea
                  className={form.textarea}
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                  rows={4}
                  placeholder="Contoh: casing putih, wifi wajib, request monitor, dll."
                />

                <div className={form.hintRow}>
                  {chips.map((c) => (
                    <button
                      key={c}
                      type="button"
                      className={form.chip}
                      onClick={() => {
                        setCatatan((prev) => {
                          const p = prev.trim();
                          if (!p) return c;
                          if (p.includes(c)) return prev;
                          return `${prev.trim()} • ${c}`;
                        });
                      }}
                    >
                      + {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className={form.btnRow}>
              <button type="button" className={form.btnWA} onClick={kirimWA}>
                Kirim WhatsApp
              </button>
              <button type="button" className={form.btnCopy} onClick={salinPesan}>
                Salin Pesan
              </button>
            </div>

            <div className={form.previewTitle}>Preview Pesan</div>
            <pre className={form.preview}>{pesan}</pre>
          </div>
        </section>

        {/* FAQ */}
        <section className={home.section}>
          <h2 className={home.sectionTitle}>FAQ</h2>
          <div className={home.faq}>
            {[
              {
                q: "Budget kecil bisa?",
                a: "Bisa. Isi budget kamu apa adanya, nanti kita susun part yang paling worth it sesuai kebutuhan.",
              },
              {
                q: "Bisa request tema warna (putih/black/RGB)?",
                a: "Bisa. Tulis di catatan: casing + tema warna + preferensi brand kalau ada.",
              },
              {
                q: "Kalau mau langsung beli part?",
                a: "Bisa lewat Shopee. Atau chat admin dulu untuk cek stok & alternatif yang lebih bagus.",
              },
            ].map((it, idx) => (
              <div key={idx} className={home.faqItem}>
                <div
                  className={home.faqQ}
                  onClick={() => setOpenFaq((v) => (v === idx ? null : idx))}
                  role="button"
                  tabIndex={0}
                >
                  <span>{it.q}</span>
                  <span aria-hidden="true">{openFaq === idx ? "−" : "+"}</span>
                </div>
                {openFaq === idx && <div className={home.faqA}>{it.a}</div>}
              </div>
            ))}
          </div>
        </section>

        {/* FOOTER */}
        <div className={home.footer}>
          <div>© {new Date().getFullYear()} IR Computer Makassar</div>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <a href={IG_URL} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
              IG
            </a>
            <a href={TT_URL} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
              TikTok
            </a>
            <a href={SHOPEE_URL} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
              Shopee
            </a>
            <a
              href={`https://wa.me/${ADMIN_WA}`}
              target="_blank"
              rel="noreferrer"
              style={{ textDecoration: "none", display: "inline-flex", gap: 6, alignItems: "center" }}
            >
              <Icon name="wa" /> WA
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
