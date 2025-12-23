"use client";

import Image from "next/image";
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
  if (d.startsWith("8")) return "62" + d;
  return d;
}

function formatRupiahFromDigits(digits: string) {
  if (!digits) return "";
  const n = Number(digits);
  if (!Number.isFinite(n)) return "";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);
}

export default function RakitPcPage() {
  const [nama, setNama] = useState("");
  const [wa, setWa] = useState("");

  // Domisili: Provinsi -> Kabupaten/Kota (WAJIB pilih)
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [regencies, setRegencies] = useState<Regency[]>([]);
  const [provinceId, setProvinceId] = useState("");
  const [regencyId, setRegencyId] = useState("");

  const [kegunaan, setKegunaan] = useState("Gaming");

  // Budget hanya angka
  const [budgetDigits, setBudgetDigits] = useState(""); // contoh: "12000000"
  const budgetRupiah = useMemo(
    () => formatRupiahFromDigits(budgetDigits),
    [budgetDigits]
  );

  const [catatan, setCatatan] = useState("");

  const waFix = useMemo(() => normalizeWA(wa), [wa]);

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
      "FORM RAKIT PC\n" +
      `Nama: ${safe(nama)}\n` +
      `WA: ${safe(waFix)}\n` +
      `Domisili: ${safe(domisiliText)}\n` +
      `Kegunaan: ${safe(kegunaan)}\n` +
      `Budget: ${safe(budgetRupiah)}\n` +
      `Catatan: ${safe(catatan)}`
    );
  }, [nama, waFix, domisiliText, kegunaan, budgetRupiah, catatan]);

  function kirimWA() {
    if (!nama.trim() || !waFix || !provinceId || !regencyId || !budgetDigits) {
      alert(
        "Lengkapi: Nama, WhatsApp, Provinsi, Kabupaten/Kota, dan Budget (angka)."
      );
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

  return (
    <main className={styles.page}>
      <div className={styles.bgGlow} />

      <section className={styles.wrap}>
        <header className={styles.header}>
          <div className={styles.logoWrap}>
            {/* Taruh logonya di: /public/ir-logo.png */}
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
          <p className={styles.sub}>IR Computer — Konsultasi Cepat via WhatsApp</p>
        </header>

        <div className={styles.card}>
          {/* watermark transparan */}
          <div className={styles.watermark}>
            made by students from Telkom Makassar Vocational School
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Nama</label>
            <input
              className={styles.input}
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Nama lengkap"
              autoComplete="name"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>WhatsApp</label>
            <input
              className={styles.input}
              value={wa}
              onChange={(e) => setWa(e.target.value)}
              placeholder="08xxxxxxxxxx"
              inputMode="tel"
              autoComplete="tel"
            />
            <div className={styles.help}>Format otomatis: {waFix || "-"}</div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Domisili (Provinsi)</label>
            <select
              className={styles.select}
              value={provinceId}
              onChange={(e) => {
                const next = e.target.value;
                setProvinceId(next);
                setRegencyId(""); // reset di handler (hindari warning effect)
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

          <div className={styles.field}>
            <label className={styles.label}>Domisili (Kabupaten / Kota)</label>
            <select
              className={styles.select}
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

          <div className={styles.field}>
            <label className={styles.label}>Kegunaan</label>
            <select
              className={styles.select}
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

          <div className={styles.field}>
            <label className={styles.label}>Budget (angka)</label>
            <input
              className={styles.input}
              value={budgetRupiah}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, "");
                setBudgetDigits(digits);
              }}
              placeholder="contoh: 12000000"
              inputMode="numeric"
            />
            <div className={styles.help}>
              {budgetDigits ? `Tersimpan: ${budgetDigits} (digits)` : "Wajib diisi"}
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Catatan</label>
            <textarea
              className={styles.textarea}
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              rows={4}
              placeholder="Contoh: mau casing putih, wifi wajib, request monitor, dll."
            />
          </div>

          <div className={styles.btnRow}>
            <button type="button" className={styles.btnWA} onClick={kirimWA}>
              Kirim WhatsApp
            </button>
            <button type="button" className={styles.btnCopy} onClick={salinPesan}>
              Salin Pesan
            </button>
          </div>

          <div className={styles.previewTitle}>Preview Pesan</div>
          <pre className={styles.preview}>{pesan}</pre>
        </div>
      </section>
    </main>
  );
}
