# Revisão da experiência Center — 13/10/2026

## Fontes

- Referência de comportamento: commet-pro/centerws, branch page-original, commit 5f03b0e1609524fb30ca015cdf25ae98f7e6f86e. Foram inspecionados os módulos compilados no chunk 43lg5uv8_am8v.js, incluindo wipes de serviços, máscaras das etapas, parallax e timings.
- Identidade operacional v2 local: Archivo Condensed + Inter, paleta Center e fotografias reais.
- Assinaturas reduzidas e quatro montadoras: commet-pro/ecosyscenter, commit e18eeda8e44204a63b4377f7bdafd357121f555e, assets/marca e build/montadoras.json. Os PNGs das montadoras removem somente o fundo azul da aplicação, preservando o desenho e os vazados.
- Contato RJ: https://centeronibus.com.br/vendedores-novo/ e https://centeronibus.com.br/representante/, consultados em 13/10/2026. A página oficial lista SP/BA individualmente; não publica nomes individuais do RJ. A seção RJ usa a foto real RJ-40.jpg e o contato da filial, sem atribuir nomes ou cargos às pessoas.

## Alterações implementadas

- Carbono genérico substituído por dois patterns vetoriais próprios, com rotas diagonais, grade técnica e acento vermelho da Center.
- Assinatura reduzida oficial PNG com transparência. Alternância colorida/clara segundo o fundo e menu aberto; sem placa branca na logo.
- Abertura da foto começa antes de alcançar o topo, evitando a antiga tela inteira vazia. A máscara continua fechada no início e abre até tela cheia.
- Marquee das quatro autorizadas: Busscar, Comil, Caio e Mascarello. PNGs com alpha, grupos contínuos, pausa explícita, por hover e por foco.
- Seis novas imagens conceituais de componentes, recriadas com luz natural e ambiente industrial claro. Não representam SKU ou compatibilidade específicos.
- Etapas de identificação e expedição com fotografias reais. Seções claras intercaladas com azul institucional. Fontes locais oficiais preservadas.
- Serviços usam wipe de baixo para cima entre top bottom e top top, conforme o código original, com escala interna e saída sincronizada de texto.
- Etapas com máscaras centrais, deslocamento controlado do quadro e saída progressiva dos textos. Declaração editorial revela palavras durante o scroll. Banners com parallax.
- Ônibus aéreos sem zoom que alterava a percepção de distância, sem cones de luz artificiais, com deslocamento paralelo por faixas e gatilho estável na seção. Três veículos permanecem visíveis no celular.
- Equipe comercial com fotos e contatos reais, seleção SP/BA/RJ, carrossel por toque/teclado e cartões de contato. RJ com composição fotográfica da equipe e atendimento da filial.

## Entrada substituída em 14/10/2026

A antiga fonte de 854 × 480 foi preservada e substituída na entrada por uma tomada exclusiva gerada no Google Flow, Omni 1.1 Flash. O original é 720p e a exportação aprimorada pelo Flow é 1080p, 24 fps, 8 segundos. Há duas sequências novas com 241 arquivos, controle por rolagem e carregamento por proximidade. Nenhum movimento intermediário foi inventado por interpolação óptica. Proveniência, dimensões e limitações em `docs/center-flow-v5.md`.

## Prévia

Sites é usado para uma prévia privada compilada. O repositório batazin/centerbus continua sendo a fonte editável. O modo de exportação estática é opcional via CENTER_STATIC_EXPORT=1; a configuração normal do projeto existente é preservada.

## Validação final da revisão

Export de produção aprovado: 29 páginas. A versão compilada foi testada em Edge desktop (1440 × 900), celular (390 × 844) e redução de movimento. Sem erros de execução, imagens quebradas ou overflow horizontal; seis rotas internas, menu por teclado e preparação do formulário aprovados. Nenhuma mensagem foi enviada.

Verificação específica: abertura chega a inset(0%), quatro PNGs de montadoras carregam, pausa funciona, assinatura clara/colorida alterna, SP possui 12 contatos, BA possui 2 e RJ exibe a foto coletiva e o WhatsApp oficial. Aprovação em desktop e celular. Integridade dos 16 arquivos fotográficos ativos, alpha dos logotipos e dos três ônibus e 241 frames aprovada.

## Logo clara final fornecida pelo usuário

A versão clara ativa é o SVG Design sem nome (1).svg enviado por Rafa durante a revisão, preservado em public/brand/center-onibus-logo-partial-negative.svg. O PNG foi renderizado desse SVG sem redesenho ou recoloração; seu fundo é transparente. A primeira faixa e o lettering são brancos, com as outras faixas em vermelho e azul. Substitui a antiga variante totalmente branca. A navegação também usa a assinatura colorida sobre as fotos claras de serviços e banners.
