import Image from "next/image";
import Link from "next/link";

const offices = [
  {
    title: "Matriz",
    city: "São Paulo - SP",
    address: "Rua Dias da Silva, 348",
    cep: "CEP: 02114-000",
    phone: "11 2967-3002",
  },
  {
    title: "Filial: Bahia",
    city: "Lauro de Freitas - BA",
    address: "Rua Pelicano, 495",
    cep: "CEP: 42701-340",
    phone: "71 3377-0770 | 71 3252-5933",
  },
  {
    title: "Filial: Rio de Janeiro",
    city: "Vargem Grande - RJ",
    address: "Est. Bandeirantes, 28.501",
    cep: "CEP: 22785-276",
    phone: "21 2391-1182 | 21 97201-2525",
  },
];

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
            src="/brand/center-onibus-logo-negative.png"
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
          <a className="footer-action" href="tel:+551129673002">
            Ligar para SP
          </a>
          <div className="footer-privacy">
            <span>Data Protection Officer</span>
            <a href="mailto:dpo@centeronibus.com.br">dpo@centeronibus.com.br</a>
          </div>
        </section>

        <section className="footer-locations" aria-label="Unidades">
          {offices.map((office) => (
            <address key={office.title} className="footer-office">
              <strong>{office.title}</strong>
              <span>{office.city}</span>
              <span>{office.address}</span>
              <span>{office.cep}</span>
              <a href={`tel:+55${office.phone.split(" ")[0]}${office.phone.split(" ")[1]?.replace("-", "") ?? ""}`}>
                {office.phone}
              </a>
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
