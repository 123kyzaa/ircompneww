"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import styles from "./RakitPc.module.css";

const ADMIN_WA = "6285298747600";

type Province = { id: string; name: string };
type Regency = { id: string; province_id: string; name: string };

function normalizeWA(input: string) {
  const d = input.replace(/\D/g, "");
  if (!d) return "";
  if (d.startsWith("0")) return "62" + d.slice(1);
  if (d.startsWith("62")) return d;
  return "62" + d;
}

function formatRupiah(n: number) {
  if (!Number.isFinite(n)) return "Rp0";
  return "Rp" + Math.round(n).toLocaleString("id-ID");
}

function safe(v: string) {
  return (v ?? "").toString().trim() || "-";
}

export default function RakitPcPage() {
  const [nama, setNama] = useState("");
  const [wa, setWa] = useState("");
  const waFix = useMemo(() => normalizeWA(wa), [wa]);

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [regencies, setRegencies] = useState<Regency[]>([]);
  const [provinceId, setProvinceId] = useState("");
  const [regencyId, setRegencyId] = useState("");

  const [kegunaan, setKegunaan] = useState("Gaming");

  // ====== NEW: PROSESOR ======
  // Brand: Bebas/Intel/AMD (default Bebas biar tetap valid kalau user ga mau milih)
  const [cpuBrand, setCpuBrand] = useState<"Bebas" | "Intel" | "AMD">("Bebas");
  // Model opsional (mis: i5-12400F / Ryzen 5 5600 / dll)
  const [cpuModel, setCpuModel] = useState("");

  const [budget, setBudget] = useState(7000000);
  const [catatan, setCatatan] = useState("");

  const [loadingReg, setLoadingReg] = useState(false);

  // load provinces
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

  // load regencies when province changes
  useEffect(() => {
    let cancelled = false;
    if (!provinceId) {
      setRegencies([]);
      setRegencyId("");
      return;
    }
    setLoadingReg(true);
    (async () => {
      try {
        const res = await fetch(
          `https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${provinceId}.json`,
          { cache: "force-cache" }
        );
        const data = (await res.json()) as Regency[];
        if (!cancelled) {
          setRegencies(Array.isArray(data) ? data : []);
          setRegencyId("");
        }
      } catch {
        if (!cancelled) {
          setRegencies([]);
          setRegencyId("");
        }
      } finally {
        if (!cancelled) setLoadingReg(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [provinceId]);

  const domisiliText = useMemo(() => {
    const p = provinces.find((x) => x.id === provinceId)?.name ?? "";
    const r = regencies.find((x) => x.id === regencyId)?.name ?? "";
    if (!p && !r) return "";
    if (p && r) return `${r}, ${p}`;
    return r || p;
  }, [provinceId, regencyId, provinces, regencies]);

  const cpuText = useMemo(() => {
    const b = safe(cpuBrand);
    const m = cpuModel.trim();
    if (!m) return b; // cuma brand (Bebas/Intel/AMD)
    return `${b} - ${m}`;
  }, [cpuBrand, cpuModel]);

  const pesan = useMemo(() => {
    return (
      "FORM RAKIT PC (IR COMPUTER)\n" +
      "--------------------------\n" +
      `Nama: ${safe(nama)}\n` +
      `WhatsApp: ${safe(waFix)}\n` +
      `Domisili: ${safe(domisiliText)}\n` +
      `Kegunaan: ${safe(kegunaan)}\n` +
      `Prosesor: ${safe(cpuText)}\n` +
      `Budget: ${formatRupiah(budget)}\n` +
      `Catatan: ${safe(catatan)}\n`
    );
  }, [nama, waFix, domisiliText, kegunaan, cpuText, budget, catatan]);

  const isValid = useMemo(() => {
    return (
      nama.trim().length >= 2 &&
      waFix.length >= 10 &&
      provinceId &&
      regencyId &&
      budget >= 1000000
      // Prosesor sengaja tidak diwajibkan karena default "Bebas"
    );
  }, [nama, waFix, provinceId, regencyId, budget]);

  function kirimWA() {
    if (!isValid) {
      alert("Lengkapi dulu: Nama, WhatsApp, Provinsi, Kabupaten/Kota, dan Budget.");
      return;
    }
    const url = `https://wa.me/${ADMIN_WA}?text=${encodeURIComponent(pesan)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  async function salinPesan() {
    try {
      await navigator.clipboard.writeText(pesan);
      alert("Pesan berhasil disalin ✅");
    } catch {
      alert("Gagal menyalin pesan (izin clipboard ditolak).");
    }
  }

  return (
    <main className={styles.page}>
      <div className={styles.bgGlow} />

      <section className={styles.wrap}>
        <header className={styles.header}>
          <div className={styles.topBar}>
            <Link href="/" className={styles.back}>
              ← Home
            </Link>
            <div className={styles.brandMini}>
              <Image src="/ir-logo.png" alt="IR Computer" width={26} height={26} />
              <span>IR Computer</span>
            </div>
          </div>

          <div className={styles.logoWrap}>
            <Image
              src="/ir-logo.png"
              alt="IR Computer"
              width={120}
              height={120}
              priority
              className={styles.logoImg}
            />
          </div>

          <h1 className={styles.title}>
            <span className={styles.t1}>Form</span>{" "}
            <span className={styles.t2}>Rakit</span>{" "}
            <span className={styles.t3}>PC</span>
          </h1>
          <p className={styles.sub}>Isi form → otomatis jadi pesan WhatsApp yang rapi.</p>
        </header>

        <div className={styles.grid}>
          {/* FORM */}
          <div className={styles.card}>
            <div className={styles.cardTitle}>Data</div>

            <div className={styles.field}>
              <label className={styles.label}>Nama</label>
              <input
                className={styles.input}
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Contoh: Muhammad Hibban Zakaria"
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>WhatsApp</label>
              <input
                className={styles.input}
                value={wa}
                onChange={(e) => setWa(e.target.value)}
                placeholder="Contoh: 0852xxxxxxx"
              />
              <div className={styles.help}>
                Format otomatis: <b>{waFix || "62xxxxxxxxxx"}</b>
              </div>
            </div>

            <div className={styles.row2}>
              <div className={styles.field}>
                <label className={styles.label}>Provinsi</label>
                <select
                  className={styles.select}
                  value={provinceId}
                  onChange={(e) => setProvinceId(e.target.value)}
                >
                  <option value="">Pilih provinsi</option>
                  {provinces.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Kabupaten/Kota</label>
                <select
                  className={styles.select}
                  value={regencyId}
                  onChange={(e) => setRegencyId(e.target.value)}
                  disabled={!provinceId || loadingReg}
                >
                  <option value="">
                    {loadingReg
                      ? "Loading..."
                      : provinceId
                      ? "Pilih kab/kota"
                      : "Pilih provinsi dulu"}
                  </option>
                  {regencies.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Kegunaan</label>
              <div className={styles.segment}>
                {["Gaming", "Editing", "Office", "Streaming", "Multitasking"].map((x) => (
                  <button
                    key={x}
                    type="button"
                    className={`${styles.segBtn} ${kegunaan === x ? styles.segActive : ""}`}
                    onClick={() => setKegunaan(x)}
                  >
                    {x}
                  </button>
                ))}
              </div>
            </div>

            {/* ====== NEW: FORM PROSESOR ====== */}
            <div className={styles.row2}>
              <div className={styles.field}>
                <label className={styles.label}>Prosesor (Brand)</label>
                <select
                  className={styles.select}
                  value={cpuBrand}
                  onChange={(e) => setCpuBrand(e.target.value as "Bebas" | "Intel" | "AMD")}
                >
                  <option value="Bebas">Bebas (rekomendasi toko)</option>
                  <option value="Intel">Intel</option>
                  <option value="AMD">AMD</option>
                </select>
                <div className={styles.help}>
                  Pilih “Bebas” kalau mau yang paling worth it sesuai budget.
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Prosesor (Model/Seri)</label>
                <input
                  className={styles.input}
                  value={cpuModel}
                  onChange={(e) => setCpuModel(e.target.value)}
                  placeholder="Contoh: i5-12400F / Ryzen 5 5600 / bebas"
                />
                <div className={styles.help}>Opsional. Kalau kosong, admin pilihkan.</div>
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>
                Budget <span className={styles.badge}>{formatRupiah(budget)}</span>
              </label>

              <input
                className={styles.range}
                type="range"
                min={1000000}
                max={50000000}
                step={250000}
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
              />

              <div className={styles.rangeRow}>
                <span>{formatRupiah(1000000)}</span>
                <span>{formatRupiah(50000000)}</span>
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Catatan</label>
              <textarea
                className={styles.textarea}
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
                rows={4}
                placeholder="Contoh: casing putih, wajib Wi-Fi, request monitor, dll."
              />
            </div>

            <div className={styles.btnRow}>
              <button
                type="button"
                className={styles.btnWA}
                onClick={kirimWA}
                disabled={!isValid}
                title={!isValid ? "Lengkapi dulu data wajib" : "Kirim WhatsApp"}
              >
                Kirim WhatsApp
              </button>

              <button type="button" className={styles.btnCopy} onClick={salinPesan}>
                Salin Pesan
              </button>
            </div>

            {!isValid && (
              <div className={styles.warn}>
                * Wajib isi: Nama, WhatsApp, Provinsi, Kab/Kota, Budget.
              </div>
            )}
          </div>

          {/* PREVIEW */}
          <div className={styles.card2}>
            <div className={styles.cardTitle}>Preview Pesan</div>
            <pre className={styles.preview}>{pesan}</pre>

            <div className={styles.quickInfo}>
              <div className={styles.qRow}>
                <span>Domisili</span>
                <b>{domisiliText || "-"}</b>
              </div>
              <div className={styles.qRow}>
                <span>Kegunaan</span>
                <b>{kegunaan}</b>
              </div>
              <div className={styles.qRow}>
                <span>Prosesor</span>
                <b>{cpuText || "-"}</b>
              </div>
              <div className={styles.qRow}>
                <span>Budget</span>
                <b>{formatRupiah(budget)}</b>
              </div>
            </div>

            <div className={styles.tip}>
              Tips: tulis catatan seperti “monitor 24 inch”, “SSD minimal 1TB”, “butuh Wi-Fi”,
              “casing putih”, dll biar rekomendasi makin tepat.
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
