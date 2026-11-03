# Revisão — equipe, contatos e abertura

- 21 fotos reais recebidas em 23/10/2026: 14 de SP, 3 da Bahia e 4 do RJ. A lista de origem está em `scripts/seller-photo-sources.json`.
- Dados individuais existentes preservados; sete novos cadastros têm apenas nome, foto e unidade. Contatos pendentes não produzem links vazios.
- Formulário offline em `docs/formulario-vendedores.html`; lacunas em `docs/dados-faltantes-vendedores.md`. O formulário não transmite dados: permite baixar a resposta ou imprimir.
- Unidades e WhatsApp centralizados em `src/app/_content/branches.ts`, com os números informados pelo Rafa. O número BA permanece com oito dígitos locais, aguardando confirmação.
- Chamada principal: “Com a Center, o ônibus nunca para.” A vírgula é adequada após a expressão adverbial inicial. Faixa de marcas também na abertura.
- Removidas a narrativa de ônibus vistos de cima e a seção clara de conhecimento técnico com foto lateral. Catálogo continua como última seção de conteúdo.
- Logos ampliadas: cabeçalho 210 px no computador, 164/146 px no celular; rodapé até 390 px, sem distorção. Cabeçalho se recolhe ao ler o rodapé.
- WhatsApp circular, com painel de escolha de unidade, Escape e fechamento ao navegar. Painel limitado à altura da tela.

## Mapas

MapLibre GL com base vetorial OpenFreeMap/OpenStreetMap. Estilo local em `public/brand/center-map-style.json`: azul Center, vias claras, água escura, marcador vermelho e créditos cartográficos preservados. Carrega ao se aproximar do rodapé. Rolagem de página preservada e controles de zoom acessíveis. Links de rota continuam disponíveis se o mapa não carregar.

Fontes de localização consultadas em 23/10/2026:

- SP: Nominatim/OpenStreetMap, número 348 da Rua Dias da Silva, CEP 02114-000: latitude -23.5224626, longitude -46.5913571.
- RJ: Photon/OpenStreetMap, número 28501 da Estrada dos Bandeirantes, Vargem Grande: latitude -23.002614585796117, longitude -43.51031721498646.
- BA: AwesomeAPI CEP 42701340, Rua Pelicano, Pitangueiras: latitude -12.882553, longitude -38.311581. É referência do logradouro/CEP, não geocodificação confirmada do número 495; legenda informa localização aproximada. Rota usa endereço completo.
- Documentação da base: https://openfreemap.org/quick_start/

## Verificação

`npm run build` valida TypeScript e exportação. `scripts/verify-center-october.mjs` verifica rotas, tamanhos de tela, contatos por filial, 21 vendedores, filtros e busca, ausência das seções removidas, logos ampliadas, botão circular e renderização dos três mapas.
