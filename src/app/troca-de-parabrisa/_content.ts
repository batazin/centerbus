/**
 * Conteúdo da LP de troca de para-brisa.
 *
 * FOTOS PROVISÓRIAS: os arquivos em /public/images/parabrisa/ vieram do acervo do site
 * só para montar a página. Para trocar, substitua o arquivo mantendo o mesmo nome
 * (ou altere o caminho aqui).
 *
 * A CONFIRMAR COM A CENTER (textos neutros por enquanto, sem prometer números):
 * - Cidades / raio do atendimento móvel e se há taxa de deslocamento.
 * - Prazo médio da troca e tempo com o ônibus parado.
 * - Garantia do vidro e da instalação.
 * - Se haverá preço "a partir de" ou só orçamento.
 * - Destino dos leads além do WhatsApp (e-mail, CRM) e IDs do Google Ads / GTM.
 */

import { branches } from "../_content/branches";

export const PHOTOS = {
  hero: { src: "/images/parabrisa/hero.webp", alt: "Técnico trabalhando na dianteira de um ônibus na oficina" },
  mobile: { src: "/images/parabrisa/atendimento-movel.webp", alt: "Equipe Center com os veículos de atendimento" },
  branch: { src: "/images/parabrisa/atendimento-filial.webp", alt: "Vidros de ônibus embalados no estoque da Center" },
  glass: { src: "/images/parabrisa/parabrisa-peca.webp", alt: "Para-brisa de ônibus em cavalete no estoque" },
  fleet: { src: "/images/parabrisa/frota.webp", alt: "Pátio com ônibus de uma frota" },
} as const;

export const LP_PATH = "/troca-de-parabrisa";
export const THANKS_PATH = "/troca-de-parabrisa/obrigado";

export type Branch = (typeof branches)[number];
export { branches };

export const DEFAULT_MESSAGE = "Olá! Vim pela página de troca de para-brisa e quero um orçamento.";

export function whatsappLink(branch: Branch, text: string = DEFAULT_MESSAGE) {
  return `https://wa.me/${branch.whatsapp}?text=${encodeURIComponent(text)}`;
}

export const HERO_POINTS = ["Equipe própria de instalação", "Vidro conferido pela aplicação", "Unidades em SP, BA e RJ"];

export const MODES = [
  {
    id: "garagem",
    kicker: "Atendimento móvel",
    title: "Na sua garagem",
    text: "Nossa equipe leva o para-brisa e faz a troca no pátio da sua empresa. O ônibus não precisa rodar com o vidro danificado até a oficina.",
    points: ["Agendamento no horário da sua operação", "Equipe e ferramentas da Center", "Ideal para frotas e trocas em mais de um ônibus"],
    photo: PHOTOS.mobile,
  },
  {
    id: "unidade",
    kicker: "Na unidade Center",
    title: "Na nossa unidade",
    text: "Leve o ônibus até uma das unidades em São Paulo, Lauro de Freitas ou Rio de Janeiro. O vidro já fica separado para o dia combinado.",
    points: ["Vidro separado antes da sua chegada", "Unidades em SP, BA e RJ", "Troca feita por quem conhece a carroceria"],
    photo: PHOTOS.branch,
  },
] as const;

export const STEPS = [
  { title: "Envie modelo e foto", text: "Pelo formulário ou WhatsApp: modelo e ano da carroceria e uma foto do para-brisa." },
  { title: "Conferimos o vidro", text: "A equipe confere a aplicação, a disponibilidade e passa o orçamento com prazo." },
  { title: "Agendamos a troca", text: "Você escolhe: nossa equipe vai até a garagem ou o ônibus vem até a unidade." },
  { title: "O ônibus volta pra rua", text: "Instalação, acabamento e conferência final. Ônibus liberado para a operação." },
];

export const CHECKS = [
  "Modelo e ano da carroceria",
  "Código ou medidas do vidro",
  "Guarnição e acabamento",
  "Foto do dano para avaliar a troca",
];

export const MANUFACTURERS = ["Busscar", "Comil", "Caio", "Mascarello"];

export const FAQ = [
  {
    q: "Vocês vão até a minha garagem?",
    a: "Sim. Informe a cidade no formulário e a equipe confirma o atendimento móvel e o agendamento para a sua região.",
  },
  {
    q: "Quanto tempo o ônibus fica parado?",
    a: "Depende do modelo da carroceria e do tipo de para-brisa. O prazo é informado junto com o orçamento, antes de agendar.",
  },
  {
    q: "Como sei se vocês têm o vidro do meu ônibus?",
    a: "Envie o modelo e o ano da carroceria e uma foto. Conferimos a aplicação e a disponibilidade antes de passar o orçamento.",
  },
  {
    q: "Atendem frotas com vários ônibus?",
    a: "Sim. Informe a quantidade de ônibus no formulário para organizarmos a troca no horário que menos afeta a sua operação.",
  },
  {
    q: "A troca tem garantia e nota fiscal?",
    a: "As condições de garantia e a emissão de nota fiscal são informadas junto com o orçamento.",
  },
];
