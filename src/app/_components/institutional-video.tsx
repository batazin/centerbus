"use client";

import { useState } from "react";
import styles from "./institutional-video.module.css";

const VIDEO_SRC = "/video/center-onibus-institucional.mp4";
const POSTER_SRC = "/images/video/institucional-poster.webp";
const DURATION = "2:55";

export function InstitutionalVideo() {
  const [playing, setPlaying] = useState(false);

  return (
    <section className={styles.section} aria-labelledby="filme-institucional">
      <div className={styles.inner}>
        <div className={styles.copy}>
          <p>Filme institucional</p>
          <h2 id="filme-institucional">Conheça a Center Ônibus</h2>
          <p>Veja de perto nossa operação de peças e acessórios para carrocerias de ônibus.</p>
        </div>

        <figure className={styles.player}>
          <figcaption className={styles.bar}>
            <span className={styles.signal} aria-hidden="true" />
            <span>Center Ônibus · Filme institucional</span>
            <span className={styles.duration}>{DURATION}</span>
          </figcaption>

          <div className={styles.screen}>
            {playing ? (
              <video
                className={styles.video}
                src={VIDEO_SRC}
                poster={POSTER_SRC}
                controls
                autoPlay
                playsInline
                aria-label="Filme institucional da Center Ônibus"
              >
                <a href={VIDEO_SRC}>Abrir o filme institucional</a>
              </video>
            ) : (
              <button type="button" className={styles.cover} onClick={() => setPlaying(true)} aria-label={`Assistir ao filme institucional da Center Ônibus (${DURATION})`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={POSTER_SRC} alt="" width={1280} height={720} loading="lazy" decoding="async" />
                <span className={styles.shade} aria-hidden="true" />
                <span className={styles.play} aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="28" height="28"><path d="M8 5.5v13l10.5-6.5z" fill="currentColor" /></svg>
                </span>
                <span className={styles.label} aria-hidden="true">
                  Assistir ao filme <span>{DURATION}</span>
                </span>
                <span className={`${styles.corner} ${styles.cornerTl}`} aria-hidden="true" />
                <span className={`${styles.corner} ${styles.cornerBr}`} aria-hidden="true" />
              </button>
            )}
          </div>
        </figure>
      </div>
    </section>
  );
}
