/**
 * Conteúdo da LP de troca de para-brisa.
 *
 * Fotos reais do acervo Center: origem registrada em docs/landing-vidros-assets.json.
 * Registros de serviço enviados por Rafa incorporados em 10/11/2026.
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
  hero: { src: "/images/parabrisa/parabrisa-instalado.webp", alt: "Ônibus rodoviário vermelho com o para-brisa instalado" },
  mobile: { src: "/images/parabrisa/preparacao-em-campo.webp", alt: "Profissional preparando um vidro ao lado de um ônibus em atendimento externo" },
  branch: { src: "/images/parabrisa/atendimento-filial.webp", alt: "Vidros de ônibus embalados no estoque da Center" },
  glass: { src: "/images/parabrisa/preparacao-vidro-sp.webp", alt: "Profissional da Center preparando a embalagem de um vidro no estoque de São Paulo" },
  fleet: { src: "/images/parabrisa/equipe-bahia.webp", alt: "Equipe da Center Ônibus no estoque da unidade Bahia" },
} as const;

export const SERVICE_CASES = [
  {
    title: "Para-brisa de ônibus rodoviário",
    text: "Do vão aberto ao para-brisa instalado: registros do mesmo veículo durante o serviço e após a troca.",
    before: { src: "/images/parabrisa/parabrisa-removido.webp", alt: "Ônibus vermelho com o para-brisa superior removido e plataforma de acesso à frente", label: "Durante a troca" },
    after: { src: "/images/parabrisa/parabrisa-instalado.webp", alt: "Mesmo ônibus vermelho com o para-brisa superior instalado", label: "Vidro instalado" },
  },
  {
    title: "Troca de vidro lateral",
    text: "A Center também atende vidros laterais. Envie uma foto e o modelo da carroceria para consultar o serviço.",
    before: { src: "/images/parabrisa/lateral-removido.webp", alt: "Ônibus azul com o vidro lateral removido e plataforma ao lado", label: "Vidro removido" },
    after: { src: "/images/parabrisa/lateral-instalado.webp", alt: "Mesmo ônibus azul com o vidro lateral instalado", label: "Vidro instalado" },
  },
  {
    title: "Reposição de vidro danificado",
    text: "Outro registro de troca lateral, com o dano original e o vidro instalado no mesmo ônibus.",
    before: { src: "/images/parabrisa/lateral-garagem-danificado.webp", alt: "Ônibus branco e vermelho na garagem com vidro lateral quebrado", label: "Antes da troca" },
    after: { src: "/images/parabrisa/lateral-garagem-instalado.webp", alt: "Mesmo ônibus branco e vermelho com o vidro lateral reposto", label: "Após a troca" },
  },
] as const;

export const LP_PATH = "/troca-de-parabrisa";
export const THANKS_PATH = "/troca-de-parabrisa/obrigado";

export type Branch = (typeof branches)[number];
export { branches };

export const DEFAULT_MESSAGE = "Olá! Quero consultar a troca de para-brisa de um ônibus. Vou enviar a cidade, o modelo da carroceria e uma foto do vidro.";

export function whatsappLink(branch: Branch, text: string = DEFAULT_MESSAGE) {
  return `https://wa.me/${branch.whatsapp}?text=${encodeURIComponent(text)}`;
}

export const HERO_POINTS = ["Vidro e instalação no mesmo atendimento", "Conferência por modelo e foto", "Contato com SP, BA e RJ"];

export const MODES = [
  {
    id: "garagem",
    kicker: "Atendimento móvel",
    title: "Na sua garagem",
    text: "Consulte o atendimento móvel para a sua cidade. A equipe avalia o serviço e combina o deslocamento e o agendamento com você.",
    points: ["Informe a cidade e o local do ônibus", "Consulte a disponibilidade da equipe", "Combine o atendimento para um veículo ou frota"],
    photo: PHOTOS.mobile,
  },
  {
    id: "unidade",
    kicker: "Na unidade Center",
    title: "Na nossa unidade",
    text: "Fale com a unidade antes de levar o ônibus. A equipe confere o vidro, a disponibilidade do serviço e a data de atendimento.",
    points: ["Aplicação e disponibilidade conferidas antes", "Contato com as unidades em SP, BA e RJ", "Orçamento e agendamento com a equipe"],
    photo: PHOTOS.branch,
  },
] as const;

export const STEPS = [
  { title: "Mostre o que precisa", text: "Envie cidade, modelo e ano da carroceria. No WhatsApp, anexe fotos do vidro e da dianteira do ônibus." },
  { title: "Receba a avaliação", text: "Conferimos a aplicação, a disponibilidade do vidro e as condições para realizar o serviço." },
  { title: "Combine o atendimento", text: "Com o orçamento aprovado, definimos local e data da troca conforme a disponibilidade da unidade." },
  { title: "Conclua com orientação", text: "Após a instalação e a conferência, a equipe informa os cuidados e as condições de liberação do veículo." },
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
    a: "Consulte a cobertura para a sua cidade. A equipe confirma a disponibilidade do atendimento móvel, as condições de deslocamento e o agendamento antes de fechar o serviço.",
  },
  {
    q: "Quanto tempo o ônibus fica parado?",
    a: "O prazo depende da aplicação e das condições do serviço. A equipe informa a previsão de atendimento e as orientações de liberação do veículo antes do agendamento.",
  },
  {
    q: "Como sei se vocês têm o vidro do meu ônibus?",
    a: "Envie o modelo e o ano da carroceria e uma foto. Conferimos a aplicação e a disponibilidade antes de passar o orçamento.",
  },
  {
    q: "Atendem frotas com vários ônibus?",
    a: "Informe a quantidade de veículos, a cidade e os modelos das carrocerias. A equipe avalia a disponibilidade dos vidros e organiza o atendimento com você.",
  },
  {
    q: "Quais fotos devo enviar para o orçamento?",
    a: "Envie uma foto da dianteira do ônibus e outra do vidro, mostrando a área danificada. Se tiver código ou medidas, encaminhe também. A equipe pode pedir mais detalhes para conferir a aplicação.",
  },
  {
    q: "A troca tem garantia e nota fiscal?",
    a: "As condições de garantia e a emissão de nota fiscal são informadas junto com o orçamento.",
  },
];
