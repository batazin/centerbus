import "./center-rj-team.css";

export function CenterRJTeam() {
  return <article className="center-rj-team" aria-labelledby="rj-team-heading">
    <img src="/images/center-v3/equipe-rj.webp" alt="Equipe real da Center Ônibus reunida na filial Rio de Janeiro" loading="lazy" width="1200" height="800" />
    <div className="center-rj-team-copy">
      <span>Rio de Janeiro · Filial</span>
      <h3 id="rj-team-heading">A equipe do Rio<br />também está aqui.</h3>
      <p>Atendimento da filial para conferir aplicação, consultar peças e combinar as opções de envio.</p>
      <address>Estrada dos Bandeirantes, 28.501<br />Vargem Grande · Rio de Janeiro<br />CEP 22785-276</address>
      <a href="https://wa.me/5521972012525" target="_blank" rel="noopener noreferrer">Falar com a equipe RJ ↗</a>
      <a className="center-rj-team-phone" href="tel:+552123911182">(21) 2391-1182</a>
    </div>
  </article>;
}
