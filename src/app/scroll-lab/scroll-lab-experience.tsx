"use client";

import { SmoothScrollProvider } from "../_components/smooth-scroll-provider";
import { SceneOne } from "../_components/scroll-lab/scene-one";

export function ScrollLabExperience() {
  return (
    <SmoothScrollProvider>
      <main>
        <SceneOne />
      </main>
    </SmoothScrollProvider>
  );
}
