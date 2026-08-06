import Image from "next/image";
import Link from "next/link";
import { aboutLinks, mainLinks } from "./institutional-nav";

export function InstitutionalHeader() {
  return (
    <header className="institutional-header">
      <Link className="institutional-logo" href="/" aria-label="Center Ônibus início">
        <Image src="/logo.png" alt="Center Ônibus" width={350} height={82} priority />
      </Link>
      <nav className="institutional-nav" aria-label="Navegação institucional">
        <Link href={mainLinks[0].href}>{mainLinks[0].label}</Link>
        <div className="institutional-dropdown">
          <Link className="institutional-dropdown-trigger" href="/sobre/a-center-onibus">
            Sobre Nós
            <span aria-hidden="true" />
          </Link>
          <div className="institutional-dropdown-menu">
            {aboutLinks.map((link) => (
              <Link href={link.href} key={link.href}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        {mainLinks.slice(1).map((link) => (
          <Link href={link.href} key={link.href}>
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
