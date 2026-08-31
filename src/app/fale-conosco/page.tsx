import { InstitutionalPage } from "../_components/institutional-page";
import { contactPage } from "../_content/institutional-pages";
import { ContactForm } from "./contact-form";

export default function ContactPage() {
  return (
    <InstitutionalPage {...contactPage}>
      <ContactForm />
    </InstitutionalPage>
  );
}
