"use client";

import Image from "next/image";
import styles from "./HomeSlider.module.css";
import { useEffect, useMemo, useState } from "react";

type Slide = {
  src: string;
  alt: string;
  href?: string;
};

export default function HomeSlider({ slides }: { slides: Slide[] }) {
  const [i, setI] = useState(0);

  const safeSlides = useMemo(() => (slides?.length ? slides : []), [slides]);

  function next() {
    setI((v) => (v + 1) % safeSlides.length);
  }

  function prev() {
    setI((v) => (v - 1 + safeSlides.length) % safeSlides.length);
  }

  useEffect(() => {
    if (safeSlides.length <= 1) return;
    const t = setInterval(
      () => setI((v) => (v + 1) % safeSlides.length),
      4500
    );
    return () => clearInterval(t);
  }, [safeSlides.length]);

  if (!safeSlides.length) return null;

  const current = safeSlides[i];

  const content = (
    <div className={styles.frame}>
      <Image
        src={current.src}
        alt={current.alt}
        fill
        priority={i === 0}
        sizes="(max-width: 980px) 100vw, 980px"
        className={styles.img}
      />
    </div>
  );

  return (
    <div className={styles.slider}>
      {current.href ? (
        <a
          className={styles.link}
          href={current.href}
          target="_blank"
          rel="noreferrer"
          aria-label={current.alt}
        >
          {content}
        </a>
      ) : (
        content
      )}

      {safeSlides.length > 1 && (
        <>
          <button className={styles.navLeft} onClick={prev} aria-label="Prev">
            ‹
          </button>
          <button className={styles.navRight} onClick={next} aria-label="Next">
            ›
          </button>

          <div className={styles.dots}>
            {safeSlides.map((_, idx) => (
              <button
                key={idx}
                className={`${styles.dot} ${
                  idx === i ? styles.dotActive : ""
                }`}
                onClick={() => setI(idx)}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
