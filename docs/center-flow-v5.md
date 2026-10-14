# Entrada exclusiva — Flow v5

Tomada gerada com Omni 1.1 Flash no Google Flow, usando os quadros inicial e final produzidos para a Center. Cena contínua de um ônibus branco e azul em estrada aberta, sem logotipos de transportadora, interior ou galpão. É uma cena conceitual, não uma filmagem de frota da Center.

Projeto Flow: `0d50feea-d929-4422-af36-501629d89adb`. Cena: `cf054867-d6b6-41b5-a623-5c2d99ab2de9`. Título: “Center Ônibus — entrada exclusiva — Omni 1.1”.

O original é 720p; a exportação aprimorada pelo Flow é 1920 × 1080, 24 fps e 8 segundos. Ambos os vídeos estão preservados em `asset-sources/flow-v5`, fora do controle de versão. A saída aprimorada não deve ser descrita como geração nativa em 1080p.

`scripts/prepare-flow-hero.mjs` extrai 241 arquivos por versão: desktop 1920 × 1080 e celular 960 × 540. O vídeo possui 192 quadros nativos; a amostragem para o contrato de 241 arquivos repete quadros existentes, sem interpolação óptica. A proveniência e o hash do vídeo estão em `public/sequences/flow-v5-manifest.json`.

As sequências completas ocupam aproximadamente 34,77 MB e 11,82 MB. O carregador não baixa a sequência inteira em segundo plano: solicita cinco âncoras e uma janela próxima do quadro corrente, priorizada pela direção da rolagem. Mantém até 32 imagens decodificadas no desktop e 16 no celular. O enquadramento móvel acompanha a frente do ônibus.

As sequências anteriores permanecem preservadas, mas a entrada e seu pôster apontam apenas para as novas versões Flow. O vídeo não roda em autoplay: os quadros continuam controlados pela rolagem.

Reprodução: defina `CENTER_FFMPEG` para um executável FFmpeg confiável e execute `node scripts/prepare-flow-hero.mjs <vídeo-exportado>`. Verificação visual e de carregamento: `scripts/verify-flow-hero.mjs`, com `CENTER_PLAYWRIGHT_MODULE` e, opcionalmente, `CENTER_PREVIEW_URL`.
