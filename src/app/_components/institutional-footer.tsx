import Image from "next/image";
import Link from "next/link";
import { BranchMap } from "./branch-map";

import { branches, branchWhatsapp } from "../_content/branches";

const footerLinks = [
  { href: "/sobre/a-center-onibus", label: "A Center Ônibus" },
  { href: "/produtos", label: "Produtos" },
  { href: "/blog", label: "Blog" },
  { href: "/vendedores", label: "Vendedores" },
  { href: "/fale-conosco", label: "Fale Conosco" },
  { href: "/sobre/politica-de-privacidade", label: "Privacidade" },
];

export function InstitutionalFooter() {
  return (
    <footer className="institutional-footer">
      <div className="institutional-footer-inner">
        <section className="footer-brand" aria-label="Center Ônibus">
          <Image
            src="/brand/center-onibus-logo-partial-negative.png"
            alt="Center Ônibus"
            width={1143}
            height={299}
          />
          <p>Peças e acessórios para carrocerias de ônibus urbanos, rodoviários e micro-ônibus.</p>
          <div className="footer-badges" aria-label="Diferenciais">
            <span>ISO 9001:2015</span>
            <span>Atendimento nacional</span>
          </div>
        </section>

        <nav className="footer-nav" aria-label="Links do rodapé">
          <h2>Navegação</h2>
          {footerLinks.map((link) => (
            <Link href={link.href} key={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>

        <section className="footer-service" aria-labelledby="footer-service-title">
          <h2 id="footer-service-title">Atendimento</h2>
          <p>Fale com nossa equipe para orçamento, identificação de peças e suporte comercial.</p>
          <a className="footer-action" href={branchWhatsapp(branches[0])} target="_blank" rel="noopener noreferrer">
            WhatsApp · São Paulo
          </a>
          <div className="footer-privacy">
            <span>Data Protection Officer</span>
            <a href="mailto:dpo@centeronibus.com.br">dpo@centeronibus.com.br</a>
          </div>
        </section>

        <section className="footer-locations" aria-label="Unidades">
          {branches.map((office) => (
            <address key={office.title} className="footer-office">
              <strong>{office.title}</strong>
              <span>{office.city}</span>
              <span>{office.address}</span>
              <span>CEP: {office.cep}</span>
              <a className="office-whatsapp" href={branchWhatsapp(office)} target="_blank" rel="noopener noreferrer">WhatsApp · {office.phone} ↗</a>
              <BranchMap branch={office} />
              <a className="office-directions" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${office.address}, ${office.city}, ${office.cep}`)}`} target="_blank" rel="noopener noreferrer">Ver rota até a unidade ↗</a>
            </address>
          ))}
        </section>

        <div className="footer-copy">
          <span>© 2026 Center Ônibus. Todos os direitos reservados.</span>
          <Link href="/sobre/politica-de-privacidade">Política de Privacidade</Link>
        </div>
      </div>
    </footer>
  );
}
