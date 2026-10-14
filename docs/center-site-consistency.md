# Consistência entre páginas — Center Ônibus

As páginas internas utilizavam outro cabeçalho, outra assinatura, escalas distintas de título, sombras e tratamentos independentes de cartões. A home não tinha o rodapé institucional.

## Estrutura compartilhada

- Home e páginas internas usam o mesmo componente de cabeçalho e menu, com seis destinos principais e os cinco links institucionais preservados.
- Os estilos desse componente foram extraídos da folha da home para `src/app/_components/center-site-header.css`, importada pelo layout raiz. Não há duas implementações de navegação em paralelo.
- A assinatura alterna entre a reduzida colorida e a versão parcialmente invertida fornecida por Rafa. O contraste é recalculado ao navegar entre rotas, além da rolagem.
- O botão do menu só fica disponível depois de a interação estar pronta. Escape, retorno de foco e contenção de teclado são os mesmos em todas as páginas.
- O mesmo `InstitutionalFooter` aparece uma vez em cada página, inclusive na home. Preserva navegação, atendimento, privacidade e unidades SP/BA/RJ. As duas linhas telefônicas de BA e RJ são links separados.
- No celular, o cabeçalho sai de cena durante a leitura do rodapé para não encobrir seus links e contatos; volta ao retornar ao conteúdo.

## Linguagem visual

`src/app/site-consistency.css` define as regras comuns: Archivo Condensed + Inter, azul Center, branco/cinza, pattern de rotas, largura de conteúdo de 1180px, margens responsivas, títulos e aberturas com escala comum, cartões sem sombras pesadas, botões e campos com acabamento reto.

Catálogo, detalhes de produto, artigos e formulários preservam suas organizações funcionais. A unidade está na identidade, navegação, alinhamentos e controles, sem transformar uma ficha técnica em uma página editorial.

## Verificação

`scripts/verify-site-consistency.mjs` deriva as páginas públicas do manifesto atual do Next.js e verifica 22 rotas em 1440, 390 e 320 pixels. Cobre cabeçalho único, rodapé idêntico, fontes, ausência de excesso horizontal, menu, links secundários, erros de execução/hidratação e navegação real por links entre home, catálogo, blog e artigo. Também verifica busca do catálogo e filtros/pesquisa dos vendedores.

Capturas e resultados são gerados em `review/consistency`. Os verificadores anteriores continuam cobrindo a home, movimento reduzido, equipes, marcas e preparação do formulário de contato.

Resultado final: compilação de produção aprovada; 66 combinações de rota/tamanho aprovadas, incluindo as transições por links, buscas e filtros. Sem erros de execução ou hidratação e sem excesso horizontal. Os verificadores anteriores de home, seis tamanhos móveis, equipes, marcas, menu e formulário também passaram.
