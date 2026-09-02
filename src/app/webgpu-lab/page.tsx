import type { Metadata } from "next";
import { WebGpuLabView } from "./webgpu-lab-view";

export const metadata: Metadata = {
  title: "Laboratório WebGPU (vgpu) — Center Ônibus",
  description: "Demonstração interativa de shaders WebGPU acelerados por hardware com vgpu para telemetria de peças e dinâmica de carroceria.",
  robots: { index: false, follow: false },
};

export default function WebGpuLabPage() {
  return <WebGpuLabView />;
}
