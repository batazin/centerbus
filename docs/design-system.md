# Design system Center Onibus

Fonte de verdade: [Manual de Marca Center Onibus](./CENTER_2-brand-manual.pdf), versao 1.0, agosto de 2026.

## Direcao

O sistema deve transmitir operacao, conhecimento tecnico, disponibilidade e confianca. A marca usa composicoes diretas, estrutura de catalogo, fotografia real de transporte e uma unica diagonal por peca. Evitar brilhos, glassmorphism, volumes decorativos, multiplas diagonais e linguagem corporativa generica.

## Paleta

| Token | Valor | Uso |
| --- | --- | --- |
| `--color-center-blue` | `#122B4A` | Base institucional, cabecalho, rodape e fundos de marca |
| `--color-road-blue` | `#2E6DA4` | Apoio, estados secundarios e informacao |
| `--color-signal-red` | `#C8102E` | Um unico ponto de atencao, CTA, status e foco |
| `--color-chassis-gray` | `#E4E7EB` | Fundos tecnicos, linhas e separacao |
| `--color-center-white` | `#F4F4F4` | Respiro e superficies claras |
| `--color-technical-black` | `#101418` | Texto e contraste tecnico |

Proporcao orientativa do manual: `60 / 25 / 10 / 5`. O azul e dominante; branco e cinza organizam; vermelho nao deve virar decoracao recorrente.

## Tipografia

- Display, titulos, numeros e rotulos tecnicos: `Archivo Condensed`. No projeto, `Archivo Narrow` e carregada como equivalente web condensada e exposta em `--font-archivo-condensed`.
- Corpo, navegacao e textos longos: `Inter` via `--font-inter`.
- Titulos nao usam tracking negativo.
- Rotulos curtos podem usar caixa alta com tracking moderado.
- Escala de referencia do manual: display `72/64`, titulo `44/40`, corpo `18/26`, legenda `14/20`.

## Forma e composicao

- Raios pequenos (`3px` a `4px`) em controles e blocos tecnicos.
- Cartoes com borda, hierarquia e informacao; evitar aparencia de objeto flutuante.
- Uma diagonal por composicao: tarja, mascara de foto, divisor ou acento.
- Listas, provas e passos preferencialmente em ritmo de tres quando o conteudo permitir.
- Em produto, codigo e o maior elemento; descricao, medida, aplicacao e disponibilidade permanecem visiveis.

## Tokens implementados

Os tokens oficiais e semanticos ficam em `src/app/globals.css`. Cenas WebGL compartilham os mesmos valores por `src/app/_lib/brand-tokens.ts`. A home consome esses tokens em `src/app/home-rebrand.css`; assim, futuras correcoes de marca partem de fontes declaradas e auditaveis.

## Proximas aplicacoes

1. Substituir qualquer logo filtrado por arquivos oficiais positivo/negativo quando as variantes forem disponibilizadas separadamente.
2. Priorizar fotos reais de estoque, equipe, oficina, carroceria e operacao nas paginas internas.
3. Reorganizar cards de produto para destacar codigo, aplicacao, medidas e disponibilidade.
4. Manter movimento intenso apenas na home; paginas internas usam scroll nativo e transicoes leves.
