"use client";

import Image from "next/image";
import styles from "./HomeSlider.module.css";
import { useEffect, useMemo, useRef, useState } from "react";

type Slide = {
  src: string;
  alt: string;
  href?: string;
};

export default function HomeSlider({ slides }: { slides: Slide[] }) {
  const safeSlides = useMemo(() => (slides?.length ? slides : []), [slides]);
  const [i, setI] = useState(0);
  const [animKey, setAnimKey] = useState(0);

  const touchStartX = useRef<number | null>(null);
  const touchDeltaX = useRef<number>(0);

  function next() {
    if (!safeSlides.length) return;
    setI((v) => (v + 1) % safeSlides.length);
  }

  function prev() {
    if (!safeSlides.length) return;
    setI((v) => (v - 1 + safeSlides.length) % safeSlides.length);
  }

  useEffect(() => {
    if (safeSlides.length <= 1) return;
    const t = setInterval(() => {
      setI((v) => (v + 1) % safeSlides.length);
    }, 4500);
    return () => clearInterval(t);
  }, [safeSlides.length]);

  useEffect(() => {
    setAnimKey((k) => k + 1);
  }, [i]);

  if (!safeSlides.length) return null;

  const current = safeSlides[i];

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0]?.clientX ?? null;
    touchDeltaX.current = 0;
  }

  function onTouchMove(e: React.TouchEvent) {
    if (touchStartX.current == null) return;
    const x = e.touches[0]?.clientX ?? touchStartX.current;
    touchDeltaX.current = x - touchStartX.current;
  }

  function onTouchEnd() {
    const dx = touchDeltaX.current;
    touchStartX.current = null;
    touchDeltaX.current = 0;

    if (Math.abs(dx) < 40) return;
    if (dx < 0) next();
    else prev();
  }

  const media = (
    <div
      className={styles.frame}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      role="group"
      aria-label="Slider"
    >
      <div key={animKey} className={styles.media}>
        <Image
          src={current.src}
          alt={current.alt}
          fill
          priority={i === 0}
          sizes="(max-width: 980px) 100vw, 980px"
          className={styles.img}
        />
        <div className={styles.overlay} aria-hidden="true" />
      </div>
    </div>
  );

  return (
    <div className={styles.slider} aria-roledescription="carousel">
      {current.href ? (
        <a
          className={styles.link}
          href={current.href}
          target="_blank"
          rel="noreferrer"
          aria-label={current.alt}
        >
          {media}
        </a>
      ) : (
        media
      )}

      {safeSlides.length > 1 && (
        <>
          <button className={styles.navLeft} onClick={prev} aria-label="Prev">
            ‹
          </button>
          <button className={styles.navRight} onClick={next} aria-label="Next">
            ›
          </button>

          <div className={styles.dots} role="tablist" aria-label="Slide dots">
            {safeSlides.map((_, idx) => (
              <button
                key={idx}
                className={`${styles.dot} ${idx === i ? styles.dotActive : ""}`}
                onClick={() => setI(idx)}
                aria-label={`Slide ${idx + 1}`}
                aria-selected={idx === i}
                role="tab"
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
