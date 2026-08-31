import type { Metadata } from "next";
import { ScrollLabExperience } from "./scroll-lab-experience";

export const metadata: Metadata = {
  title: "Scroll Lab — teste interno",
  robots: { index: false, follow: false },
};

export default function ScrollLabPage() {
  return <ScrollLabExperience />;
}
