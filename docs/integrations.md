# Publicação e catálogo

O site consulta os feeds públicos do ecossistema no servidor a cada acesso. Nenhuma credencial do Mercado Livre ou da intranet é enviada ao navegador do visitante.

- `CENTER_ECOSYSTEM_ORIGIN`: origem da intranet. Padrão: `https://intranet.centeronibus.com.br`.
- `CENTER_SITE_ORIGIN`: origem pública para o sitemap. Padrão: `https://centerbus.netlify.app`.
- O deploy precisa executar Next.js com servidor (Netlify Next.js Runtime). A exportação estática `CENTER_STATIC_EXPORT=1` não atende às integrações em tempo de execução.

## Blog

`GET /public/posts` fornece apenas artigos com status `published`. Rascunhos, chaves e auditoria permanecem privados. Artigos publicados aparecem na listagem, página individual e sitemap sem novo deploy do site. Os artigos históricos do site continuam disponíveis. O assistente mantém a revisão humana de artigos com afirmações técnicas.

## Mercado Livre

No assistente da intranet, o administrador informa App ID, Client Secret e ID do vendedor. A pessoa dona da conta registra no aplicativo a URL de retorno exibida no painel e autoriza a conexão. A sessão de colaborador não possui acesso ao DevCenter.

O ecossistema armazena configuração e tokens com AES-256-GCM usando `SETTINGS_KEY`. OAuth usa PKCE, state de uso único e cookie HttpOnly. A conta autorizada precisa corresponder ao vendedor configurado.

A rotina da Netlify inicia uma função de fundo autenticada a cada 15 minutos. A importação percorre a busca com `search_type=scan` e consulta os anúncios em lotes de 20, aceitando somente produtos ativos e com estoque. A renovação dos tokens acontece no servidor; a trava com comparação de versão evita renovações concorrentes. O catálogo só é substituído após uma importação completa. Produtos pausados ou sem estoque saem na atualização seguinte. Não há modificação dos anúncios no Mercado Livre.

`GET /public/catalog` publica somente os campos usados no catálogo. Após conexão e primeira importação, esse catálogo substitui os exemplos fixos do site. Um catálogo conectado e vazio permanece vazio. Após 30 minutos sem atualização, o site oculta os preços e evita afirmar disponibilidade. Uma indisponibilidade total da intranet usa o conteúdo institucional local do site; as mensagens locais dizem para consultar disponibilidade.

## Validação

Publicar primeiro o ecossistema e depois o site. Verificar os dois feeds e a listagem do blog. Após autorizar a conta vendedora, aguardar a primeira sincronização e conferir contagem, fotos, preço e destino dos links. Pausar um anúncio de teste e confirmar sua remoção após o próximo ciclo. Não criar artigos nem alterar anúncios reais apenas para testes.
