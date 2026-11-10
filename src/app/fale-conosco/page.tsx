import { InstitutionalPage } from "../_components/institutional-page";
import { contactPage } from "../_content/institutional-pages";
import { ContactForm } from "./contact-form";
import { pageMetadata } from "../_content/site";

export const metadata = pageMetadata("Fale conosco | Center Ônibus", "Consulte peças e serviços com a Center Ônibus. Contatos de São Paulo, Bahia e Rio de Janeiro por WhatsApp e telefone.", "/fale-conosco");

export default function ContactPage() {
  return (
    <InstitutionalPage {...contactPage}>
      <ContactForm />
    </InstitutionalPage>
  );
}
