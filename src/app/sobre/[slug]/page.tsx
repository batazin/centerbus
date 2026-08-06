import { notFound } from "next/navigation";
import { InstitutionalPage } from "../../_components/institutional-page";
import { aboutPages } from "../../_content/institutional-pages";

type AboutSlug = keyof typeof aboutPages;

export function generateStaticParams() {
  return Object.keys(aboutPages).map((slug) => ({ slug }));
}

export default async function AboutPage({ params }: PageProps<"/sobre/[slug]">) {
  const { slug } = await params;
  const page = aboutPages[slug as AboutSlug];

  if (!page) {
    notFound();
  }

  return <InstitutionalPage {...page} />;
}
