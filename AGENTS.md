<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes - APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Center Onibus Rebranding Rules

The site is being redesigned from the `CENTER_2.PDF` brand manual. All future UI, copy, asset, and layout changes must follow this direction.

## Brand Direction

- The brand should feel industrial, technical, direct, reliable, and close to the transport operation.
- Avoid a futuristic, gaming, neon, glassmorphism-heavy, or overly decorative look.
- Favor real transport context: buses, bus bodywork, stock shelves, parts, maintenance, sales/service teams, workshops, fleet operations, and technical catalog details.
- The core message is practical: keeping buses on the road.
- Preferred phrases and concepts:
  - "O ônibus volta pra rua."
  - "Manter o Brasil em movimento."
  - "A peça certa, na primeira vez."
  - "Resposta no tempo da operação."
  - "Conhecimento antes do catálogo."
  - "Palavra que se cumpre."
  - "Fale com quem entende de carroceria."

## Logo Usage

- Use the corrected official Center Onibus logo from the rebrand assets when available.
- Do not recreate, redraw, distort, rotate, recolor, shadow, bevel, or apply gradients to the logo.
- Do not apply the logo directly over busy photos without a solid/dark supporting area.
- Use the correct variant for the context:
  - Full signature for normal use.
  - Negative version on dark blue backgrounds.
  - Reduced/isolated symbol only when the full logo would be below minimum readable size.
- Keep clear space around the logo. Do not crowd it with navigation, text, or decorative graphics.

## Colors

Use the manual palette as the source of truth:

- Azul Center: `#122B4A` - institutional base.
- Azul Rodagem: `#2E6DA4` - support color.
- Vermelho Sinal: `#C8102E` - single accent/signal color.
- Cinza Chassi: `#E4E7EB` - technical backgrounds.
- Branco Center: `#F4F4F4` - breathing room.
- Preto Tecnico: `#101418` - text and high-contrast technical UI.

Color proportions should generally follow the manual: blue dominant, white/gray for breathing room, red used sparingly as signal/accent. Do not use red as decoration everywhere.

## Typography

- Use `Archivo Condensed` for display headings, big numbers, labels, and strong technical headlines.
- Use `Inter` for body copy, long text, navigation, and functional UI.
- Typography should be condensed, assertive, and readable.
- Avoid negative letter spacing. Use uppercase tracking for small technical labels.
- Suggested hierarchy:
  - Display: large condensed type.
  - Title: condensed type.
  - Body: Inter.
  - Caption/technical labels: smaller uppercase with measured tracking.

## Visual Language

- The diagonal from the logo/faixas is the primary graphic device.
- Use one diagonal per visual composition. Never stack multiple competing diagonals.
- Diagonals may be used as:
  - Section divider.
  - Photo mask.
  - Technical accent line.
  - Red point of attention.
- Avoid decorative blobs, orbs, bokeh, random gradients, and excessive glow.
- Prefer flat color, photographic overlays, fine technical lines, large numbers, and clear catalog-like structure.

## Copy And Tone

Tone of voice must be:

- Objetiva.
- Tecnica.
- Proxima.
- Sem alarde.

Write like someone who knows the operation. Avoid generic corporate claims such as:

- "Solucoes completas em mobilidade."
- "Excelencia e comprometimento."
- "A melhor do mercado."
- "Parceria de sucesso."

Prefer concrete, operational copy:

- "Temos em estoque. Sai hoje."
- "Codigo CO 11084, para Spheros CC305."
- "Entrega em 48 horas para a Grande Sao Paulo."
- "Atendemos Comil, Neobus e Caio."
- "Se roda, a gente tem."

## Website Implementation Guidance

- Home may keep scroll-driven storytelling, but the motion should feel controlled and technical, not flashy.
- Internal pages should use normal/free browser scrolling. Do not add scroll-lock, snap, or GSAP-driven scroll effects to internal pages.
- Headers and footers should be sober, practical, and brand-led.
- Cards should look like technical/catalog blocks, not decorative floating cards.
- Product sections should prioritize category, code, application, measurements, availability, and support details.
- Mobile layouts must not create horizontal scrolling. Always test that text and cards fit inside the viewport.
- Use real brand/photo assets when provided. Do not substitute generic-looking visuals when the user needs a brand-accurate result.

## Motion And Effects Guidance

The attached animation prompt is a reference for premium interaction quality, not a replacement for the Center Onibus brand manual. If there is a conflict, the rebrand rules above win.

- Aim for premium, fluid, cinematic interaction quality inspired by high-end institutional sites.
- Motion must feel technical, confident, and useful. Avoid childish, noisy, overproduced, or distracting animation.
- Use GSAP as the primary animation tool already present in the project.
- Do not add heavy new animation dependencies such as Lenis, Framer Motion, SplitType, or React Three Fiber unless the user explicitly approves the added dependency and the feature truly benefits from it.
- Three.js/WebGL should only be used when it adds clear value to the brand story or product experience.
- All animation must preserve readability, navigation speed, accessibility, and performance.

### Home Motion

- The home page may use scroll-driven storytelling.
- Sections may enter, hold, and exit as part of a controlled narrative.
- Use timelines, scrubbed transitions, parallax, clip-path reveals, masks, counters, and staged card reveals when they strengthen the story.
- Avoid adding horizontal scroll unless the user specifically asks for it and it is verified on mobile.
- Hero motion may include image fade/scale, subtle blur-to-sharp, headline reveal, staggered text, and CTA reveal.
- Navbar motion may include load-in, compact-on-scroll, backdrop, and logo sizing changes if it remains readable and sober.

### Home Scroll Performance Memory

- User validated the current home scroll feel as good on 2026-09-02 after the smooth-scroll and Hero sequence fixes. Preserve this direction.
- Keep Lenis synchronized through `gsap.ticker` in `src/app/_components/smooth-scroll-provider.tsx` so Lenis and ScrollTrigger run on the same clock.
- Do not rely on `respectReducedMotion: true` for Lenis on the home page, because it makes scrubbed sections feel abrupt. Respect reduced motion inside decorative section effects instead.
- The Hero bus sequence must preserve all 241 frames on desktop, mobile, and reduced-motion environments. Do not skip, remove, or halve frames.
- Do not eager-decode all 241 frames at once. Load distributed anchor frames first, prioritize the active scroll window, and let the remaining frames load in idle batches.
- When a requested Hero frame is not loaded yet, draw the nearest loaded frame instead of leaving the canvas frozen.
- Do not alter the 3D components when addressing Hero/home scroll smoothness unless the user explicitly asks for 3D changes.

### Internal Page Motion

- Internal pages must keep native/free browser scrolling.
- Do not use scroll-lock, section snap, pinned narratives, or GSAP-controlled scroll on internal pages.
- Use only light reveals, hover states, focus states, accordions, and small UI transitions.

### Interaction Patterns

- Clickable elements should have clear hover, active, and focus-visible states.
- Buttons may use subtle magnetic, lift, underline, ripple, or shadow effects, but keep them restrained.
- Cards may use reveal, lift, and light tilt on desktop. Disable or simplify complex hover/tilt on touch devices.
- Images may use diagonal masks, clip-path reveal, subtle scale, and dark blue overlays.
- SVG and line elements may use stroke-draw or simple opacity/scale reveals.
- Statistics may count up when entering the viewport.
- Timelines may use a growing line and staggered items.
- Logo walls may move continuously only if they are subtle, pause on hover, and do not distract.
- Forms should use useful microinteractions: floating labels, focus border, success/error states.

### Performance And Accessibility

- Respect `prefers-reduced-motion`.
- Prefer `transform`, `translate3d`, and `opacity`.
- Avoid animating layout-heavy properties when possible.
- Use `requestAnimationFrame`, throttling/debouncing, lazy loading, and optimized images where relevant.
- Keep animation at 60 FPS on target devices.
- Never hide important content behind animation.
- Never create horizontal overflow on mobile.
- Test desktop and mobile behavior after motion changes.

## Home 2 (`/home-2`): Inspiração e Benchmark Forge Automotive

A rota `/home-2` utiliza como **inspiração e referência direta obrigatória** o site da **[Forge Automotive](https://forgeautomotive.co.uk/)**. Todas as decisões visuais, de animação e de layout desta página devem seguir esse benchmark:

- **Site de Referência Principal:** `https://forgeautomotive.co.uk/`
- **Hero Vehicle Sequence (Scroll-Driven):**
  - O Hero **sempre** utiliza a sequência técnica do veículo (ônibus) renderizada em `<canvas>` e controlada frame a frame pelo `ScrollTrigger`.
  - Conforme o usuário rola, o veículo avança/escala em direção à tela com efeito de profundidade, acompanhado de mouse tilt 3D sutil na perspectiva.
  - **Proibido usar vídeo comum no Hero:** Nunca substituir a sequência por uma tag `<video>` em loop autoplay genérica nem inserir botões de alternância de mídia.
- **Narrativa Editorial & Pinned Storytelling:**
  - Frases técnicas e declarações editoriais que surgem centralizadas e se desvanecem com o avanço do veículo (*ex.: "RESPOSTA NO TEMPO DA OPERAÇÃO / CONHECIMENTO ANTES DO CATÁLOGO"*).
  - Seções com fixação (pinning) no scroll, transições limpas e revelação progressiva de etapas/processos.
- **Estética Atelier Aplicada ao Setor de Ônibus:**
  - Atmosfera escura e técnica (`#060606` com texturas de carbono e ruído sutil).
  - Microinterações inspiradas na Forge: bordas sutis com brilho (*conic gradient border shine*), badges técnicas numeradas e grid rigoroso.
  - **Sem rastro de fotos no cursor:** Não utilizar o efeito de rastro de imagens/cards flutuantes no cursor (cursor trail) na Hero.


## Rebranding Work Order

When implementing the rebrand, proceed in this order unless the user asks otherwise:

1. Update brand tokens, fonts, and logo assets.
2. Update header and footer.
3. Redesign the home page visual system.
4. Apply the system to internal pages.
5. Review mobile layouts and remove horizontal overflow.
6. Run `npm.cmd run build` to validate.


