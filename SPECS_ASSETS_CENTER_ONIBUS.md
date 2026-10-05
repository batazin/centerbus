# Especificação Técnica de Assets (0 a 100%) — Center Ônibus

> **Guia para Designer 3D, Renderizador e Fotógrafo**  
> **Referência e Padrão Visual:** Forge Automotive / Estética Atelier Industrial Dark  
> **Tema:** Componentes Técnicos de Carroceria de Ônibus & Frotas Rodoviárias/Urbanas  
> **Paleta Dominante:** Preto Técnico (`#060606` a `#101418`), Azul Center (`#122B4A`), Azul Rodagem (`#2E6DA4`), destaques em Vermelho Sinal (`#C8102E`).

---

## Sumário das Especificações

| Pacote | Seção do Site | Tipo / Formato | Quantidade | Dimensões (Px) | Proporção |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **01. Sequência Hero** | Hero Principal (Scroll Canvas) | `.webp` (Sequência numerada) | 31 ou 60 frames | 1920 × 1080 | 16:9 |
| **02. Transição Aperture** | Seção "Conhecimento Antes do Catálogo" | `.jpg` / `.webp` | 1 imagem | 1920 × 1080 | 16:9 |
| **03. Steps Narrativos** | Seção "Identificação, Estoque, Rodagem" | `.jpg` / `.webp` | 3 imagens | 1200 × 1200 | 1:1 Quadrado |
| **04. Retrato Técnico** | Seção "Statement / Consultor" | `.jpg` / `.webp` | 1 imagem | 1000 × 1500 | 2:3 Vertical |
| **05. Painel de Serviços** | Seção "Componentes de Carroceria" | `.jpg` / `.webp` | 6 imagens | 1600 × 1200 | 4:3 Horizontal |
| **06. Frota Vista Aérea** | Seção "O Ônibus Volta pra Rua" | `.png` (Fundo Transparente) | 3 imagens | 800 × 1600 | ~1:2 Vertical |
| **07. Banners Monumentais** | Seções "Catálogo" e "Estoque" | `.jpg` / `.webp` | 2 imagens | 1920 × 1080 | 16:9 |
| **08. Footer** | Rodapé e Fechamento | `.jpg` / `.webp` | 1 imagem | 1920 × 1080 | 16:9 |
| **09. Identidade / Logo** | Header & Footer | `.svg` ou `.png` (Alpha) | 2 variantes | Vetorial / 800×200 | Horizontal |

---

## 1. Sequência Hero (Veículo em Movimento no Scroll)

Controlada via JavaScript/GSAP no `<canvas>`. O ônibus avança continuamente na direção da câmera à medida que o visitante rola a página.

* **Onde entra:** Topo do site (`#hero` / `ForgeHeroCar`).
* **Quantidade de Arquivos:** **31 frames** (numeração sequencial contínua, ex: `frame_0001.webp` até `frame_0031.webp`).  
  *(Opcional de alta fluidez: 60 ou 120 frames).*
* **Extensão:** `.webp` (qualidade de compressão ~80–85%).
* **Dimensões:** `1920 × 1080 px` (Full HD).
* **Taxa de Proporção:** `16:9`.
* **Peso por frame:** Máximo **100 KB a 180 KB** por frame (para carregamento instantâneo via cache).
* **Cenário / Direção de Arte:**
  - Ônibus rodoviário moderno de alta categoria (padrão Marcopolo G8 / Comil Invictus / Irizar) em asfalto escuro molhado.
  - O ônibus vem de longe na pista e avança frontalmente/leve 3/4 em direção à câmera.
  - Faróis acesos em LED projetando facho de luz volumétrico e reflexos no solo molhado.
  - Fundo escuro/noturno ou hangar técnico estilizado, sem poluição visual.

---

## 2. Imagem de Transição Aperture ("Conhecimento Antes do Catálogo")

A imagem é revelada a partir do centro da tela em formato de diafragma/abertura (*aperture reveal*).

* **Nome do Arquivo:** `approach-precision-v2.jpg` (ou `.webp`).
* **Onde entra:** Seção de Abordagem Técnica (`#approach`).
* **Extensão:** `.jpg` ou `.webp`.
* **Dimensões:** `1920 × 1080 px`.
* **Taxa de Proporção:** `16:9`.
* **Peso Máximo:** **350 KB**.
* **Cenário / Direção de Arte:**
  - Close mecânico/estrutural de alto nível: mão com luva técnica realizando encaixe de precisão em carroceria, lanterna ou chicote elétrico de ônibus em bancada de oficina limpa e moderna.
  - Tons escuros com iluminação pontual de estúdio.

---

## 3. Tríptico de Narrativa Técnica (3 Passos)

Cards que se sobrepõem no scroll com máscara de corte central expansiva.

* **Extensão:** `.jpg` ou `.webp`.
* **Dimensões:** `1200 × 1200 px` (ou no mínimo `1024 × 1024 px`).
* **Taxa de Proporção:** `1:1` (Quadrado exato).
* **Peso Máximo:** **250 KB** por arquivo.

### Arquivos e Conceito:
1. **`step-01-identidade-dark.jpg` (Passo 01 — Identificação Precisa):**
   - *Cenário:* Detalhe frontal fechado de grade, logotipo/emblema automotivo e farol LED de ônibus. Enquadramento diagonal técnico.
2. **`step-02-precisao-dark.jpg` (Passo 02 — Estoque em Pronta-Entrega):**
   - *Cenário:* Estoque de peças de reposição de carroceria organizadas e iluminadas em prateleiras industriais ou conferência técnica com instrumento de medição/código de barras.
3. **`step-03-rodagem-dark.jpg` (Passo 03 — O Ônibus Volta pra Rua):**
   - *Cenário:* Traseira aerodinâmica e difusores de ônibus rodoviário na estrada com iluminação vermelha em LED e sensação de movimento/velocidade.

---

## 4. Retrato Editorial do Consultor Técnico (Statement)

Foto vertical com presença humana e autoridade de quem vive a operação de transporte.

* **Nome do Arquivo:** `statement-craftsman.jpg` (ou `.webp`).
* **Onde entra:** Seção de Manifesto / Citação técnica (`#statement`).
* **Extensão:** `.jpg` ou `.webp`.
* **Dimensões:** `1000 × 1500 px` (ou `848 × 1264 px`).
* **Taxa de Proporção:** `2:3` (Vertical).
* **Peso Máximo:** **300 KB**.
* **Cenário / Direção de Arte:**
  - Especialista técnico / consultor da Center Ônibus (uniforme técnico sóbrio escuro, postura confiante e direta, olhar sereno e focado).
  - Iluminação lateral dramática (chiaroscuro) com fundo industrial desfocado.

---

## 5. Painel de Serviços (6 Componentes de Carroceria)

Painel fixo à direita da tela (*sticky full-bleed panel*) que desliza de baixo para cima conforme o usuário navega pelos 6 serviços.

* **Extensão:** `.jpg` ou `.webp`.
* **Dimensões:** `1600 × 1200 px` (ou `1400 × 1050 px`).
* **Taxa de Proporção:** `4:3` (Horizontal).
* **Peso Máximo:** **280 KB** por imagem.
* **Estilo Visual:** Fundo escuro estúdio / iluminação de borda (rim light) destacando os contornos da peça.

### Arquivos e Itens:
1. **`service-carroceria.jpg` (Carrocerias & Lataria):**
   - Painel lateral estrutural, saia, tampa traseira de fibra ou aerofólio em acabamento impecável.
2. **`service-iluminacao.jpg` (Iluminação & Elétrica):**
   - Conjunto óptico dianteiro/traseiro Full LED moderno de ônibus rodoviário, farol aceso com facho luminoso definido.
3. **`service-retrovisores.jpg` (Retrovisores Técnicos):**
   - Braço de retrovisor técnico bipartido (rodoviário/urbano) com acabamento texturizado e espelho antirreflexo.
4. **`service-vidros.jpg` (Vidros & Para-brisas):**
   - Para-brisa panorâmico laminado com reflexos de estúdio e borrachas de vedação de alta densidade.
5. **`service-climatizacao.jpg` (Climatização & Filtros):**
   - Condensador/compressor ou filtros antipólen automotivos (Spheros/Valeo) em detalhe de aletas de refrigeração.
6. **`service-parachoques.jpg` (Para-choques & Proteção):**
   - Para-choque modular reforçado com acabamento texturizado e alma de absorção de impacto.

---

## 6. Frota Vista Aérea Superior (Eagle-Eye Top-Down)

Três modelos de ônibus vistos estritamente de cima (90° perpendicular), que rodam e ultrapassam na tela sobre as faixas da rodovia.

* **Onde entra:** Seção "O Ônibus Volta pra Rua" (`#ordinary`).
* **Extensão:** `.png` ou `.webp` com **FUNDO TRANSPARENTE (Alpha Channel 100% limpo, sem sombras cortadas)**.
* **Dimensões:** `800 × 1600 px` por veículo.
* **Taxa de Proporção:** `1:2` (Vertical).
* **Peso Máximo:** **250 KB** por arquivo.

### Arquivos e Modelos:
1. **`bus-aerial-main.png` (Centro):**
   - Ônibus Rodoviário Double Decker (DD) ou Low Driver longo de luxo, vista superior do teto, climatizador e faróis dianteiros acesos projetados para baixo.
2. **`bus-aerial-transit.png` (Esquerda):**
   - Ônibus Urbano / Metropolitano (padrão Caio Millennium / Marcopolo Torino) com alçapões de teto e ar-condicionado central.
3. **`bus-aerial-minibus.png` (Direita):**
   - Micro-ônibus Executivo / Turismo (padrão Volare / Senior) compacto.

---

## 7. Banners Monumentais de Largura Total (Full-Bleed)

Impacto cinematográfico widescreen.

* **Extensão:** `.jpg` ou `.webp`.
* **Dimensões:** `1920 × 1080 px` (Full HD).
* **Taxa de Proporção:** `16:9`.
* **Peso Máximo:** **350 KB** cada.

### Arquivos:
1. **`banner-previous-builds.jpg` (Catálogo Técnico Especializado):**
   - Detalhe macro e sofisticado de tecnologia veicular, farol de ônibus ou montagem de carroceria com iluminação azulada/vermelha.
2. **`banner-available-stock.jpg` (Estoque em Pronta-Entrega):**
   - Galpão logístico moderno com fileiras de ônibus ou peças catalogadas em prateleiras industriais iluminadas.

---

## 8. Footer Monumental de Encerramento

* **Nome do Arquivo:** `footer-buses-rear.jpg` (ou `.webp`).
* **Onde entra:** Rodapé (`#contact`).
* **Extensão:** `.jpg` ou `.webp`.
* **Dimensões:** `1920 × 1080 px`.
* **Taxa de Proporção:** `16:9`.
* **Peso Máximo:** **350 KB**.
* **Cenário / Direção de Arte:**
  - Três ou mais ônibus rodoviários modernos alinhados vistos pela traseira na penumbra, com as lanternas vermelhas e luzes de posição acesas criando reflexos no chão.

---

## 9. Identidade Visual (Logotipo)

* **Arquivos:**
  - `center-onibus-logo-negative.png` (Versão negativa branca/azul para fundos escuros).
  - `center-onibus-logo.svg` (Vetor oficial).
* **Dimensões recomendadas:** Mínimo `800 × 200 px` em PNG 32-bit (ou arquivo `.svg` limpo).
* **Fundo:** 100% transparente.

---

## Checklist de Entrega

- [ ] Todos os arquivos nomeados exatamente conforme esta especificação (em minúsculas, separados por hífen).
- [ ] Imagens otimizadas (sem arquivos brutos de 20MB; manter compressão web de alta fidelidade).
- [ ] Sequência de frames do Hero (`frame_0001` a `frame_0031`) com mesma dimensão, enquadramento e sem oscilação de luz brusca.
- [ ] As 3 vistas aéreas (`bus-aerial-*.png`) estritamente recortadas com transparência (canal alfa) sem halos brancos ao redor.
