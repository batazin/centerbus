import { notFound } from "next/navigation";
import { InstitutionalPage } from "../../_components/institutional-page";
import { aboutPages } from "../../_content/institutional-pages";
import { pageMetadata } from "../../_content/site";

type AboutSlug = keyof typeof aboutPages;

export async function generateMetadata({ params }: PageProps<"/sobre/[slug]">) {
  const { slug } = await params;
  const page = aboutPages[slug as AboutSlug];
  return page ? pageMetadata(`${page.title} | Center Ônibus`, page.intro, `/sobre/${slug}`) : {};
}

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
