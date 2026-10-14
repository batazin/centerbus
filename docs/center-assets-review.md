# Assets e revisão da Center Ônibus — 09/10/2026

A home e `/home-2` usam o mesmo conjunto novo em `public/images/center-v2/`. Foram entregues 17 imagens: 13 ilustrações conceituais produzidas com a ferramenta de geração de imagens do Codex e quatro aplicações de três fotografias reais da Center em São Paulo. O manifesto registra origem, prompt, tamanho, peso e qualidade de cada arquivo.

As fotos reais de conferência, expedição e estoque substituem o consultor fictício e o galpão de veículos. As peças geradas ilustram famílias do catálogo: não constituem fotografia de um SKU nem prova de compatibilidade. As logos e fontes vieram do brandbook operacional v2 de 21/09/2026, sem redesenho da assinatura.

## Sequência do hero

- A sequência original em `public/sequences/bus/` permanece intacta, com 241 arquivos.
- A sequência ativa em `public/sequences/bus-drive-v2/` contém 241 arquivos WebP de 1920 × 1080, aproximadamente 6,4 MB no total.
- Derivação: interpolação óptica do trecho contínuo original de pista (quadros 1–31), seguida de sustentação do último quadro. Os cortes posteriores para hangar, raio-x e cabine foram excluídos da narrativa ativa.
- A fonte de pista é 854 × 480. A saída Full HD é ampliada; não é uma nova filmagem nativa em alta resolução. Uma fonte nativa melhor poderá substituir esses arquivos mantendo a implementação.
- O canvas desenha um quadro nítido por vez; não faz crossfade entre veículos. A fila tem quatro carregamentos simultâneos, âncoras distribuídas e prioridade ao quadro pedido. O cache decodificado é limitado a 16 imagens no celular e 32 no desktop.

## Correções funcionais

CTAs de contato levam a `/fale-conosco`; catálogo leva a `/produtos`. Links do rodapé levam a páginas reais. O formulário prepara os dados de um e-mail e oferece um link para abrir o aplicativo do visitante, informa que ainda não houve recebimento e permite retomar os dados. Não há backend de envio neste projeto e não se simula confirmação de entrega.

O menu exclui links ocultos da navegação por teclado, mantém foco dentro da navegação, fecha por Escape, devolve o foco e bloqueia a rolagem de fundo. A redução de movimento preserva a sequência interativa do hero e simplifica efeitos decorativos. A identidade usa Archivo Condensed e Inter locais, sem importação da serifada da Forge.

Foram retiradas afirmações sem fonte, como quantidades conflitantes de estoque, homologação do CO 11084 e eliminação de pontos cegos. O framework foi atualizado de Next 16.2.11 para 16.4.0 dentro da mesma versão principal.

## Referências consultadas

- Forge Automotive: https://forgeautomotive.co.uk/
- Center Ônibus: https://centeronibus.com.br/
- Perfil institucional: https://www.linkedin.com/company/auto-pe%C3%A7as-center-%C3%B4nibus/
- Brandbook local operacional v2 de 21/09/2026.

## Preparação e verificação

`node scripts/prepare-center-assets.mjs` usa os masters locais em `asset-sources/`. Esses originais estão preservados na máquina de produção e fora do Git; os WebP finais e os prompts estão versionados. O diretório alternativo de fontes pode ser informado por `CENTER_PHOTO_SOURCE`.

`node scripts/verify-center-site.mjs` verifica a prévia em `localhost:3100` usando Playwright instalado no ambiente. `CENTER_PLAYWRIGHT_MODULE` permite indicar o módulo disponível. O teste não envia nenhuma mensagem: verifica apenas a preparação do mailto.

A spec inicial pedia 31–120 frames, enquanto AGENTS.md exigia preservar os 241 existentes. A entrega preserva todos os originais e prepara 241 frames contínuos para a rota Forge, atendendo à regra de não cortar para raio-x ou cabine.

## Resultado da validação final

Build de produção aprovado (29 páginas). Lint: zero erros e 21 avisos. Validação dos 17 assets, transparência dos recortes e 241 frames aprovada. Navegador Edge em desktop, celular e redução de movimento: zero erros de execução, zero imagens quebradas e zero overflow horizontal. Menu, seis rotas internas e preparação do e-mail aprovados. Nenhuma mensagem foi enviada.

Auditoria de dependências de produção: zero vulnerabilidades. Permanecem cinco avisos altos na cadeia de ferramentas de desenvolvimento; a correção automática forçada propunha retroceder uma versão principal da configuração do framework e não foi aplicada.
