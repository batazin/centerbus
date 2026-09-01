import { CenterbusOnePage } from "./_components/centerbus-one-page";
import { SmoothScrollProvider } from "./_components/smooth-scroll-provider";

export default function Home() {
  return (
    <SmoothScrollProvider anchorOffset={-90}>
      <CenterbusOnePage />
    </SmoothScrollProvider>
  );
}
