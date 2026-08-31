import { InstitutionalHeader } from "./institutional-header";
import { InstitutionalFooter } from "./institutional-footer";

type InstitutionalPageProps = {
  eyebrow: string;
  title: string;
  intro: string;
  layout?: "sections" | "document" | "company" | "cause" | "brands" | "marcopolo" | "products";
  sections: readonly {
    title: string;
    copy: string;
    items?: readonly string[];
  }[];
  children?: React.ReactNode;
};

export function InstitutionalPage({ eyebrow, title, intro, layout = "sections", sections, children }: InstitutionalPageProps) {
  const renderList = (items?: readonly string[]) =>
    items ? (
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    ) : null;

  const renderSections = () => (
    <section className={`institutional-content institutional-content-${layout}`}>
      {sections.map((section) => (
        <article className="institutional-section" key={section.title}>
          <h2>{section.title}</h2>
          <div className="institutional-section-body">
            <p>{section.copy}</p>
            {renderList(section.items)}
          </div>
        </article>
      ))}
    </section>
  );

  const renderCompany = () => (
    <section className="company-layout">
      <div className="company-lead">
        <p>{sections[0]?.copy}</p>
        <div className="company-stats" aria-label="Destaques da Center Ônibus">
          <span>
            <strong>30+</strong>
            anos de mercado
          </span>
          <span>
            <strong>ISO</strong>
            9001:2015
          </span>
          <span>
            <strong>BR</strong>
            envio nacional
          </span>
        </div>
      </div>
      <div className="company-flow">
        {sections.slice(1, 5).map((section) => (
          <article key={section.title}>
            <span aria-hidden="true" />
            <div>
              <h2>{section.title}</h2>
              <p>{section.copy}</p>
              {renderList(section.items)}
            </div>
          </article>
        ))}
      </div>
      <div className="company-principles">
        {sections.slice(5).map((section) => (
          <article key={section.title}>
            <h2>{section.title}</h2>
            <p>{section.copy}</p>
            {renderList(section.items)}
          </article>
        ))}
      </div>
    </section>
  );

  const renderCause = () => (
    <section className="cause-layout">
      <div className="cause-mark">
        <strong>NCCV</strong>
        <span>Integração Social</span>
      </div>
      <div className="cause-copy">
        {sections.map((section) => (
          <article key={section.title}>
            <h2>{section.title}</h2>
            <p>{section.copy}</p>
          </article>
        ))}
      </div>
    </section>
  );

  const renderBrands = () => (
    <section className="brands-layout">
      <p className="brands-lead">{intro}</p>
      <div className="brand-grid">
        {sections.slice(0, 4).map((section) => (
          <article key={section.title}>
            <strong>{section.title}</strong>
            <p>{section.copy}</p>
          </article>
        ))}
      </div>
      <div className="reseller-strip">
        <span>{sections[4]?.title}</span>
        <p>{sections[4]?.copy}</p>
      </div>
      <article className="marcopolo-callout">
        <h2>{sections[5]?.title}</h2>
        <p>{sections[5]?.copy}</p>
      </article>
    </section>
  );

  const renderMarcopolo = () => (
    <section className="marcopolo-layout">
      <aside className="marcopolo-brand">
        <strong>Marcopolo</strong>
        <span>Aproximando pessoas</span>
      </aside>
      <div className="marcopolo-article">
        {sections.map((section) => (
          <article key={section.title}>
            <h2>{section.title}</h2>
            <p>{section.copy}</p>
          </article>
        ))}
      </div>
      <div className="marcopolo-facts">
        <span>1949</span>
        <span>400 mil unidades</span>
        <span>100+ países</span>
      </div>
    </section>
  );

  const renderProducts = () => (
    <section className="products-layout">
      <p className="products-lead">{intro}</p>
      <div className="product-catalog">
        {sections.map((section, index) => (
          <article key={section.title}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h2>{section.title}</h2>
            <p>{section.copy}</p>
            {renderList(section.items)}
          </article>
        ))}
      </div>
    </section>
  );

  return (
    <div className="institutional-shell">
      <InstitutionalHeader />
      <main className="institutional-main">
        <section className={`institutional-hero institutional-hero-${layout}`}>
          <div>
            <p className="kicker">{eyebrow}</p>
            <h1>{title}</h1>
            <p>{intro}</p>
          </div>
        </section>
        {layout === "company" ? renderCompany() : null}
        {layout === "cause" ? renderCause() : null}
        {layout === "brands" ? renderBrands() : null}
        {layout === "marcopolo" ? renderMarcopolo() : null}
        {layout === "products" ? renderProducts() : null}
        {["sections", "document"].includes(layout) ? renderSections() : null}
        {children}
      </main>
      <InstitutionalFooter />
    </div>
  );
}
