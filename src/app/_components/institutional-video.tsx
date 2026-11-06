import styles from "./institutional-video.module.css";

export function InstitutionalVideo() {
  return (
    <section className={styles.section} aria-labelledby="filme-institucional">
      <div className={styles.inner}>
        <div className={styles.copy}>
          <p>Filme institucional</p>
          <h2 id="filme-institucional">Conheça a Center Ônibus</h2>
          <p>Veja de perto nossa operação de peças e acessórios para carrocerias de ônibus.</p>
        </div>
        <video controls playsInline preload="none" aria-label="Filme institucional da Center Ônibus">
          <source src="/video/center-onibus-institucional.mp4" type="video/mp4" />
          <a href="/video/center-onibus-institucional.mp4">Abrir o filme institucional</a>
        </video>
      </div>
    </section>
  );
}
