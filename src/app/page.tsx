import Home2 from "./home-2/page";
import { pageMetadata } from "./_content/site";

export const metadata = pageMetadata("Center Ônibus | Peças para carrocerias de ônibus", "Peças para carrocerias de ônibus, atendimento técnico e troca e instalação de vidros. Matriz em São Paulo e filiais na Bahia e no Rio de Janeiro.", "/");

export default function Home() {
  return <Home2 />;
}
