export const productCategories = [
  { id: "climatizacao", label: "Climatização" },
  { id: "iluminacao", label: "Iluminação e sinalização" },
  { id: "visibilidade", label: "Visibilidade" },
  { id: "vedacao", label: "Vedação e acabamento" },
  { id: "carroceria", label: "Carroceria" },
  { id: "componentes", label: "Componentes técnicos" },
] as const;

export type ProductCategory = (typeof productCategories)[number]["id"];

export type Product = {
  slug: string;
  name: string;
  shortName: string;
  code: string;
  category: ProductCategory;
  categoryLabel: string;
  description: string;
  application: string;
  dimensions: string;
  reference: string;
  availability: string;
  visualMark: string;
  image?: string;
  imageAlt?: string;
  features: readonly string[];
  identification: readonly string[];
};

export const products: readonly Product[] = [
  {
    slug: "filtro-antipolen-co-11084",
    name: "Filtro anti-pólen para Spheros CC305",
    shortName: "Filtro anti-pólen",
    code: "CO 11084",
    category: "climatizacao",
    categoryLabel: "Climatização",
    description:
      "Elemento filtrante para retenção de pólen e poeira antes da entrada de ar no sistema de climatização do ônibus.",
    application: "Spheros CC305 / 335 / 355T",
    dimensions: "1395 × 175 × 30 mm",
    reference: "024-00017-002",
    availability: "Consulte disponibilidade",
    visualMark: "AR",
    image: "/products/co-11084-packaging.webp",
    imageAlt: "Embalagem identificada do filtro anti-pólen CO 11084 da Center Ônibus",
    features: [
      "Aplicação identificada por sistema e referência.",
      "Medidas visíveis para conferência antes do pedido.",
      "Atendimento técnico para validação da carroceria.",
    ],
    identification: [
      "Confirme o modelo do equipamento de climatização.",
      "Compare as medidas do filtro instalado.",
      "Envie uma foto da etiqueta ou da peça para a equipe Center Ônibus.",
    ],
  },
  {
    slug: "lanterna-traseira-modular",
    name: "Lanterna traseira modular",
    shortName: "Lanterna traseira",
    code: "Sob consulta",
    category: "iluminacao",
    categoryLabel: "Iluminação e sinalização",
    description:
      "Conjunto de sinalização traseira para reposição, com identificação conforme carroceria, posição e ano do veículo.",
    application: "Ônibus urbanos e rodoviários",
    dimensions: "Conforme aplicação",
    reference: "Identificação por foto ou amostra",
    availability: "Consulte disponibilidade",
    visualMark: "LUZ",
    features: [
      "Consulta por lado direito ou esquerdo.",
      "Validação do desenho da carroceria.",
      "Conferência de conectores e pontos de fixação.",
    ],
    identification: [
      "Informe a encarroçadora, o modelo e o ano.",
      "Fotografe a lanterna e o conector traseiro.",
      "Indique o lado de montagem no veículo.",
    ],
  },
  {
    slug: "farol-dianteiro-carroceria",
    name: "Farol dianteiro para carroceria",
    shortName: "Farol dianteiro",
    code: "Sob consulta",
    category: "iluminacao",
    categoryLabel: "Iluminação e sinalização",
    description:
      "Farol de reposição para carrocerias de ônibus, selecionado por modelo, lado e configuração elétrica.",
    application: "Comil, Neobus, Caio, Mascarello e outras",
    dimensions: "Conforme aplicação",
    reference: "Identificação por carroceria",
    availability: "Consulte disponibilidade",
    visualMark: "FAR",
    features: [
      "Seleção por carroceria e posição.",
      "Conferência da lente e do alojamento.",
      "Suporte para equivalência de referência.",
    ],
    identification: [
      "Informe marca, modelo e ano da carroceria.",
      "Envie foto frontal e traseira do conjunto.",
      "Confirme o lado de instalação.",
    ],
  },
  {
    slug: "espelho-retrovisor-externo",
    name: "Espelho retrovisor externo",
    shortName: "Espelho retrovisor",
    code: "Sob consulta",
    category: "visibilidade",
    categoryLabel: "Visibilidade",
    description:
      "Conjunto de retrovisor para reposição, com consulta por braço, carcaça, lente, fixação e lado do veículo.",
    application: "Carrocerias urbanas, rodoviárias e micro-ônibus",
    dimensions: "Conforme aplicação",
    reference: "Identificação por conjunto",
    availability: "Consulte disponibilidade",
    visualMark: "VIS",
    features: [
      "Conferência do braço e da base.",
      "Consulta de lente, carcaça ou conjunto completo.",
      "Identificação do lado de montagem.",
    ],
    identification: [
      "Fotografe o retrovisor completo e sua base.",
      "Informe o lado e o modelo da carroceria.",
      "Indique se precisa da lente, carcaça ou conjunto.",
    ],
  },
  {
    slug: "mecanismo-limpador-parabrisa",
    name: "Mecanismo do limpador de para-brisa",
    shortName: "Mecanismo do limpador",
    code: "Sob consulta",
    category: "visibilidade",
    categoryLabel: "Visibilidade",
    description:
      "Mecanismo de acionamento para reposição do sistema de limpeza do para-brisa da carroceria.",
    application: "Seleção por carroceria e geometria do conjunto",
    dimensions: "Conforme aplicação",
    reference: "Identificação por etiqueta e fixação",
    availability: "Consulte disponibilidade",
    visualMark: "LIM",
    features: [
      "Consulta de mecanismo, palheta e haste.",
      "Validação da geometria de acionamento.",
      "Conferência do motor e dos pontos de fixação.",
    ],
    identification: [
      "Envie foto do mecanismo montado e desmontado.",
      "Informe a carroceria e o ano.",
      "Fotografe etiquetas ou referências existentes.",
    ],
  },
  {
    slug: "perfil-vedacao-porta",
    name: "Perfil de vedação para portas",
    shortName: "Perfil de vedação",
    code: "Sob consulta",
    category: "vedacao",
    categoryLabel: "Vedação e acabamento",
    description:
      "Perfil para vedação e acabamento de portas, tampas e encontros da carroceria, fornecido conforme seção e aplicação.",
    application: "Portas, tampas e acabamentos de carroceria",
    dimensions: "Conforme amostra ou desenho da seção",
    reference: "Identificação pela seção do perfil",
    availability: "Consulte disponibilidade",
    visualMark: "PER",
    features: [
      "Consulta por seção e material.",
      "Conferência de encaixe e área de vedação.",
      "Atendimento com amostra ou desenho cotado.",
    ],
    identification: [
      "Fotografe a seção transversal do perfil.",
      "Meça largura, altura e canal de encaixe.",
      "Informe o local de aplicação na carroceria.",
    ],
  },
  {
    slug: "fechadura-bagageiro",
    name: "Fechadura para bagageiro",
    shortName: "Fechadura de bagageiro",
    code: "Sob consulta",
    category: "carroceria",
    categoryLabel: "Carroceria",
    description:
      "Fechadura e componentes de acionamento para tampas externas e compartimentos de bagagem.",
    application: "Ônibus rodoviários e carrocerias com bagageiro",
    dimensions: "Conforme aplicação",
    reference: "Identificação por mecanismo",
    availability: "Consulte disponibilidade",
    visualMark: "FEC",
    features: [
      "Consulta de fechadura, trinco e maçaneta.",
      "Validação do sentido de acionamento.",
      "Conferência dos pontos de fixação.",
    ],
    identification: [
      "Envie fotos da frente e do verso da peça.",
      "Meça a distância entre os pontos de fixação.",
      "Informe a tampa e a posição na carroceria.",
    ],
  },
  {
    slug: "amortecedor-tampa-bagageiro",
    name: "Amortecedor para tampa de bagageiro",
    shortName: "Amortecedor de bagageiro",
    code: "Sob consulta",
    category: "componentes",
    categoryLabel: "Componentes técnicos",
    description:
      "Amortecedor a gás para sustentação e movimento controlado de tampas de bagageiro e compartimentos técnicos.",
    application: "Tampas externas e compartimentos da carroceria",
    dimensions: "Conforme curso, comprimento e força",
    reference: "Identificação pela gravação do componente",
    availability: "Consulte disponibilidade",
    visualMark: "GÁS",
    features: [
      "Consulta por comprimento aberto e fechado.",
      "Conferência da força nominal.",
      "Validação dos terminais de fixação.",
    ],
    identification: [
      "Fotografe a gravação do amortecedor.",
      "Meça o comprimento entre centros.",
      "Informe o tipo de terminal em cada ponta.",
    ],
  },
] as const;

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getRelatedProducts(product: Product) {
  const sameCategory = products.filter(
    (candidate) => candidate.slug !== product.slug && candidate.category === product.category,
  );
  const otherCategories = products.filter(
    (candidate) => candidate.slug !== product.slug && candidate.category !== product.category,
  );

  return [...sameCategory, ...otherCategories].slice(0, 3);
}
