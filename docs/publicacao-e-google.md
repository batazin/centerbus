# Publicação e medição — Center Ônibus

Revisão de 10/11/2026. Domínio canônico previsto: https://centeronibus.com.br.

## Preparado no código

- Metadados próprios, URLs canônicas e imagem social de 1200 × 630; idioma pt-BR e fontes locais.
- Dados estruturados da organização, contatos das três unidades e serviço de vidros.
- Sitemap inclui páginas institucionais, vendedores, serviços, produtos e artigos disponíveis; robots exclui áreas de teste e a orientação de conclusão do WhatsApp.
- Redirecionamentos permanentes de /home-2 para / e de /troca-de-parabrisa para /troca-e-instalacao-de-vidros, inclusive subpáginas.
- Prévias Netlify (deploy-preview/branch-deploy) recebem noindex e sitemap vazio. Outros ambientes privados devem usar CENTER_SITE_INDEXABLE=0.
- Estrutura opcional de medição, consentimento, cliques em WhatsApp, telefone, Mercado Livre e intenção de orçamento. Não envia nome, telefone, empresa ou mensagem para a medição. URLs de medição não incluem parâmetros de busca.

## Configuração real ainda pendente

Rafa informou que a Center ainda não tem os IDs. Não foram criados recursos Google, conversões, anúncios ou campanhas nesta revisão.

Verificação da fonte pública em 10/11/2026: `/public/catalog` retornou `connected: false`, `updatedAt: null`, `products: []`. A sincronização com o Mercado Livre ainda precisa ser autorizada e importada no ecossistema. O site mantém o catálogo local como alternativa.

1. Criar propriedade GA4 e conta/recurso do Google Ads sob a titularidade da Center. Configurar o fluxo web no domínio definitivo. GTM é opcional.
2. Preencher as variáveis de .env.example no ambiente de hospedagem e reconstruir o site. Escolher GTM **ou** instalação direta GA4/Ads para não duplicar tags. No modo GTM, mapear os eventos abaixo no container e respeitar os sinais de consentimento.
3. Definir os rótulos reais de conversão. Cliques e abertura de WhatsApp representam intenção de contato, não lead confirmado. Não usar visita direta à página /obrigado como conversão de lead recebido.
4. Conferir com Tag Assistant e tempo real do GA4: recusa não carrega tags; permissão carrega; cada ação gera somente um evento de contato. Testar navegação entre páginas e revogação nas preferências.
5. Configurar domínio/HTTPS na hospedagem, CENTER_SITE_ORIGIN com o domínio definitivo e CENTER_SITE_INDEXABLE=1 apenas em produção. Redirecionar o domínio alternativo (www ou sem www) para o escolhido na hospedagem.
6. Verificar domínio no Search Console (DNS ou GOOGLE_SITE_VERIFICATION), enviar /sitemap.xml e conferir a URL publicada. Validar o catálogo integrado, fotos e disponibilidade; a existência de catálogo local não confirma sincronização com Mercado Livre.

## Eventos

| Evento | Significado |
| --- | --- |
| whatsapp_click | Clique no WhatsApp fora da landing |
| phone_click | Clique em telefone fora da landing |
| marketplace_click | Saída para Mercado Livre |
| lp_whatsapp_click | Clique no WhatsApp da landing, com unidade/posição |
| lp_phone_click | Clique no telefone da landing |
| lp_form_submit | Formulário válido; mensagem preparada para abrir WhatsApp |
| center_page_view | Navegação para containers GTM; usar page_path sem dados pessoais |

O formulário de vidros continua sem recebimento em CRM/e-mail: a pessoa precisa enviar a mensagem no WhatsApp. Fotos são anexadas lá. Confirmação efetiva de lead exige uma integração futura com o canal de atendimento.

Referências: [Metadados do Google](https://developers.google.com/search/docs/crawling-indexing/special-tags), [Consent Mode](https://developers.google.com/tag-platform/security/guides/consent).
