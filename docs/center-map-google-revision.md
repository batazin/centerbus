# Ajuste de mapas, WhatsApp e marcas — 23/10/2026

Esta revisão substitui o mapa vetorial descrito em `center-october-update.md`.

- Google Maps incorporado por endereço completo das três unidades. Aparência escura aplicada ao iframe por CSS; não usa o modo escuro nativo da API JavaScript nem requer chave. Controles, identificação Google e créditos permanecem visíveis.
- Removidos MapLibre, seu worker, estilo e dependências. A identificação OpenFreeMap deixa de aparecer porque esse provedor não é mais utilizado.
- Botão circular mantém o seletor das três unidades e usa o vetor padrão WhatsApp, obtido de https://github.com/simple-icons/simple-icons/blob/develop/icons/whatsapp.svg (Simple Icons, CC0).
- Removidos os dois botões de pausar/retomar marcas. A faixa pausa ao passar o mouse ou receber foco e continua respeitando a preferência de movimento reduzido.
