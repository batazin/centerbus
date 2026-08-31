export type BlogSection = {
  id: string;
  title: string;
  paragraphs: readonly string[];
  checklist?: readonly string[];
};

export type BlogPost = {
  slug: string;
  category: "Identificação" | "Manutenção" | "Operação";
  title: string;
  excerpt: string;
  publishedAt: string;
  publishedLabel: string;
  readingTime: string;
  image: string;
  imageAlt: string;
  intro: string;
  sections: readonly BlogSection[];
  callout: string;
};

export const blogPosts: readonly BlogPost[] = [
  {
    slug: "como-identificar-peca-de-carroceria",
    category: "Identificação",
    title: "Como identificar uma peça de carroceria antes de fazer o pedido",
    excerpt:
      "Código, foto, medida e posição de montagem: os dados que reduzem dúvida, retrabalho e tempo de ônibus parado.",
    publishedAt: "2026-08-28",
    publishedLabel: "28 ago 2026",
    readingTime: "6 min de leitura",
    image: "/blog/conferencia-estoque.webp",
    imageAlt: "Profissional conferindo componentes de carroceria em um estoque técnico",
    intro:
      "Peças parecidas podem mudar conforme encarroçadora, modelo, ano e posição no veículo. Uma solicitação bem documentada permite comparar a aplicação antes do faturamento e evita que o item errado chegue à oficina.",
    sections: [
      {
        id: "comece-pelo-veiculo",
        title: "Comece pela identificação do veículo",
        paragraphs: [
          "Informe a encarroçadora, o modelo da carroceria, o ano e, quando possível, o chassi. Esses dados criam o primeiro filtro para a consulta e eliminam referências que não pertencem àquela configuração.",
          "Não use apenas o nome popular da peça. Termos como lanterna, trinco ou perfil podem representar conjuntos diferentes dentro da mesma linha de carroceria.",
        ],
        checklist: ["Encarroçadora e modelo", "Ano da carroceria", "Chassi, quando disponível", "Lado e posição de montagem"],
      },
      {
        id: "registre-a-peca",
        title: "Registre a peça sem esconder os detalhes",
        paragraphs: [
          "Faça uma foto geral para mostrar onde o componente está instalado e outras fotos próximas da frente, do verso e das fixações. Etiquetas, gravações e conectores precisam aparecer com nitidez.",
          "Coloque uma régua ou trena no mesmo plano da peça. A medida ajuda na triagem, mas não substitui a conferência do código e da aplicação.",
        ],
        checklist: ["Foto da peça instalada", "Frente e verso", "Etiqueta ou código gravado", "Conector e pontos de fixação"],
      },
      {
        id: "confirme-a-aplicacao",
        title: "Confirme antes do faturamento",
        paragraphs: [
          "Depois de encontrar uma referência provável, compare desenho, medidas, conectores e sentido de montagem. Uma diferença pequena pode impedir a instalação ou exigir adaptação indevida.",
          "Em caso de dúvida, envie também a foto da peça antiga ao lado do componente recebido na consulta. O objetivo é fechar a aplicação antes de liberar o pedido.",
        ],
      },
    ],
    callout: "Quanto melhor a identificação, mais rápida e segura fica a resposta comercial.",
  },
  {
    slug: "lanterna-de-onibus-checklist-de-conferencia",
    category: "Manutenção",
    title: "Lanterna de ônibus: checklist de conferência antes da reposição",
    excerpt:
      "Lado, desenho da lente, conector e fixação precisam bater. Veja o que conferir antes de substituir o conjunto.",
    publishedAt: "2026-08-20",
    publishedLabel: "20 ago 2026",
    readingTime: "5 min de leitura",
    image: "/blog/identificacao-lanterna.webp",
    imageAlt: "Técnico comparando uma lanterna removida com a carroceria de um ônibus",
    intro:
      "Uma lanterna pode ter o mesmo formato externo e usar conector, circuito ou fixação diferente. A conferência visual precisa considerar o conjunto completo, não apenas a lente.",
    sections: [
      {
        id: "lado-e-posicao",
        title: "Defina lado e posição no veículo",
        paragraphs: [
          "Registre se a peça fica na dianteira, traseira ou lateral e indique direita ou esquerda olhando no sentido de marcha. Essa referência evita interpretações diferentes entre oficina e atendimento.",
          "Quando a lanterna fizer parte de uma coluna com vários módulos, informe também se é a posição superior, central ou inferior.",
        ],
      },
      {
        id: "desenho-e-fixacao",
        title: "Compare desenho, encaixe e fixação",
        paragraphs: [
          "Fotografe o contorno da lente, o alojamento e os pontos de fixação. Observe quantidade de parafusos, guias, presilhas e a profundidade disponível atrás do acabamento.",
          "Trincas na peça antiga podem deformar a leitura. Se possível, registre também o alojamento vazio na carroceria.",
        ],
        checklist: ["Contorno da lente", "Quantidade de fixações", "Guias e presilhas", "Profundidade do alojamento"],
      },
      {
        id: "conector-e-funcao",
        title: "Confira conector e funções elétricas",
        paragraphs: [
          "Mostre o conector de frente e de lado, incluindo a quantidade de vias e a posição das travas. Informe quais funções o conjunto executa, como posição, freio, direção ou ré.",
          "A instalação elétrica deve seguir o procedimento da encarroçadora e ser executada por profissional qualificado. Não altere chicotes para compensar uma aplicação incorreta.",
        ],
      },
    ],
    callout: "A peça certa encaixa na carroceria e também conversa corretamente com o sistema elétrico.",
  },
  {
    slug: "dados-que-aceleram-uma-cotacao",
    category: "Operação",
    title: "Cinco dados que aceleram uma cotação de peças para ônibus",
    excerpt:
      "Uma solicitação objetiva ajuda a equipe a localizar a aplicação e devolver uma condição comercial com menos idas e voltas.",
    publishedAt: "2026-08-12",
    publishedLabel: "12 ago 2026",
    readingTime: "4 min de leitura",
    image: "/blog/conferencia-estoque.webp",
    imageAlt: "Separação e conferência de componentes em estoque de peças para ônibus",
    intro:
      "O tempo da cotação começa antes do primeiro contato. Quando as informações essenciais chegam juntas, a busca sai do campo da adivinhação e entra em uma conferência técnica objetiva.",
    sections: [
      {
        id: "dados-essenciais",
        title: "Envie os cinco dados essenciais",
        paragraphs: [
          "Organize a solicitação em uma mensagem única. Isso facilita o encaminhamento interno e reduz o risco de uma informação importante ficar perdida entre conversas.",
        ],
        checklist: [
          "Encarroçadora, modelo e ano",
          "Nome e posição da peça",
          "Código ou referência gravada",
          "Fotos gerais e de detalhe",
          "Quantidade necessária e cidade de entrega",
        ],
      },
      {
        id: "medidas-uteis",
        title: "Meça o que realmente diferencia a peça",
        paragraphs: [
          "Em perfis, amortecedores e mecanismos, uma única medida raramente é suficiente. Registre comprimento, largura, distância entre centros, curso e seção sempre que fizer sentido para o componente.",
          "Não arredonde medidas para fazer uma referência parecer compatível. A equipe precisa dos valores encontrados na peça ou no ponto de montagem.",
        ],
      },
      {
        id: "pedido-rastreavel",
        title: "Mantenha o pedido rastreável",
        paragraphs: [
          "Use uma identificação interna do veículo, placa ou número de frota no assunto da solicitação. Assim, oficina, compras e fornecedor tratam o mesmo caso sem misturar aplicações.",
          "Ao receber a cotação, mantenha a descrição técnica e a referência no pedido de compra. Essa continuidade ajuda na conferência do material recebido.",
        ],
      },
    ],
    callout: "A resposta no tempo da operação depende de uma pergunta tecnicamente completa.",
  },
  {
    slug: "inspecao-visual-antes-do-onibus-voltar-a-rua",
    category: "Manutenção",
    title: "Inspeção visual: o que conferir antes do ônibus voltar à rua",
    excerpt:
      "Depois da intervenção, acabamento, fixação, vedação e funcionamento precisam entrar na conferência final da carroceria.",
    publishedAt: "2026-08-04",
    publishedLabel: "4 ago 2026",
    readingTime: "7 min de leitura",
    image: "/blog/inspecao-oficina.webp",
    imageAlt: "Técnico inspecionando a carroceria de um ônibus em uma oficina de frota",
    intro:
      "A troca da peça não encerra o serviço. Uma conferência final organizada ajuda a identificar folgas, interferências, problemas de vedação e funções que ainda não foram validadas.",
    sections: [
      {
        id: "fixacao-e-acabamento",
        title: "Fixação e acabamento",
        paragraphs: [
          "Confira se o componente assentou sem tensão, se os pontos de fixação foram utilizados corretamente e se não existem folgas ou contato com partes móveis. Acabamentos devem permanecer alinhados à carroceria.",
          "Nunca improvise uma fixação para compensar incompatibilidade. Se a geometria não coincide, interrompa a montagem e confirme a aplicação.",
        ],
      },
      {
        id: "vedacao-e-movimento",
        title: "Vedação e movimento",
        paragraphs: [
          "Em portas, tampas e perfis, observe compressão uniforme, curso livre e fechamento completo. Verifique interferências ao longo de todo o movimento, não apenas na posição final.",
          "Quando o procedimento da encarroçadora exigir teste de estanqueidade, execute-o antes de liberar o veículo.",
        ],
        checklist: ["Alinhamento", "Curso livre", "Fechamento completo", "Vedação uniforme"],
      },
      {
        id: "teste-funcional",
        title: "Teste funcional e registro",
        paragraphs: [
          "Teste iluminação, acionamentos e mecanismos relacionados conforme o manual técnico do veículo. Registre a peça aplicada e o serviço executado no histórico da frota.",
          "Este checklist é uma orientação de triagem. Os procedimentos, torques e critérios de liberação definidos pela fabricante e pela manutenção responsável sempre prevalecem.",
        ],
      },
    ],
    callout: "O ônibus volta pra rua quando a aplicação, a montagem e o funcionamento foram conferidos.",
  },
] as const;

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}

export function getRelatedBlogPosts(post: BlogPost) {
  const sameCategory = blogPosts.filter(
    (candidate) => candidate.slug !== post.slug && candidate.category === post.category,
  );
  const otherCategories = blogPosts.filter(
    (candidate) => candidate.slug !== post.slug && candidate.category !== post.category,
  );

  return [...sameCategory, ...otherCategories].slice(0, 3);
}
