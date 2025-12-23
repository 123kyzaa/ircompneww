import styles from "./Home.module.css";
import HomeSlider from "./HomeSlider";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className={styles.page}>
      <div className={styles.bgGlow} />

      <div className={styles.topRight}>
        <a
          className={styles.iconBtn}
          href="https://www.instagram.com/ircomputer_mks"
          target="_blank"
          rel="noreferrer"
          aria-label="Instagram"
          title="Instagram"
        >
          <InstagramIcon />
        </a>

        <a
          className={styles.iconBtn}
          href="https://www.tiktok.com/@ircomputer_mks"
          target="_blank"
          rel="noreferrer"
          aria-label="TikTok"
          title="TikTok"
        >
          <TikTokIcon />
        </a>

        <a
          className={styles.iconBtn}
          href="https://id.shp.ee/5zzGvN7"
          target="_blank"
          rel="noreferrer"
          aria-label="Shopee"
          title="Shopee"
        >
          <ShopeeIcon />
        </a>

        <Link className={styles.menuBtn} href="/rakit-pc">
          Menu <span className={styles.arrow}>→</span>
        </Link>
      </div>

      <section className={styles.wrap}>
        <header className={styles.header}>
          <h1 className={styles.title}>IR Computer</h1>
          <p className={styles.sub}>Promo & info produk terbaru</p>
        </header>

        <div className={styles.sliderWrap}>
          <HomeSlider
            slides={[
              {
                src: "/Slider/Slide-1.jpg",
                alt: "Promo 1",
                href: "https://share.google/MZz8H1SXqW0BP1x3Z",
              },
              {
                src: "/Slider/Slide-2.jpg",
                alt: "Promo 2",
              },
              {
                src: "/Slider/Slide-3.jpg",
                alt: "Promo 3",
              },
            ]}
          />
        </div>

        <div className={styles.locationCard}>
          <div className={styles.locLeft}>
            <div className={styles.locTitle}>Lokasi Toko</div>
            <div className={styles.locDesc}>
              Klik untuk lihat lokasi di Google Maps
            </div>
          </div>
          <a
            className={styles.locBtn}
            href="https://share.google/glqD20KNmltPc01NO"
            target="_blank"
            rel="noreferrer"
          >
            Buka Maps
          </a>
        </div>
      </section>
    </main>
  );
}

function InstagramIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9A5.5 5.5 0 0 1 16.5 22h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M12 16.3a4.3 4.3 0 1 0 0-8.6 4.3 4.3 0 0 0 0 8.6Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M17.6 6.8h.01"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M14 3v10.2a3.6 3.6 0 1 1-3-3.54"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 6.2c1.1 1.8 3 3 5.2 3.2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ShopeeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M7 7h10l1 3v9a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-9l1-3Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M9 7a3 3 0 0 1 6 0"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M10 14h4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
