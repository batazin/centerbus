"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { aboutLinks, mainLinks } from "./institutional-nav";

export function InstitutionalHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className={`institutional-header${isMenuOpen ? " is-menu-open" : ""}`}>
      <Link className="institutional-logo" href="/" aria-label="Center Ônibus início" onClick={closeMenu}>
        <Image src="/logo.png" alt="Center Ônibus" width={1123} height={293} loading="eager" />
      </Link>
      <button
        className="mobile-menu-toggle"
        type="button"
        aria-expanded={isMenuOpen}
        aria-controls="institutional-mobile-nav"
        aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
        onClick={() => setIsMenuOpen((open) => !open)}
      >
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </button>
      <nav id="institutional-mobile-nav" className="institutional-nav" aria-label="Navegação institucional">
        <Link href={mainLinks[0].href} onClick={closeMenu}>
          {mainLinks[0].label}
        </Link>
        <div className="institutional-dropdown">
          <Link className="institutional-dropdown-trigger" href="/sobre/a-center-onibus" onClick={closeMenu}>
            Sobre Nós
            <span aria-hidden="true" />
          </Link>
          <div className="institutional-dropdown-menu">
            {aboutLinks.map((link) => (
              <Link href={link.href} key={link.href} onClick={closeMenu}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        {mainLinks.slice(1).map((link) => (
          <Link href={link.href} key={link.href} onClick={closeMenu}>
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
