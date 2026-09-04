-- Migration — adicionar coluna `mensagem` a `contactos`
--
-- O formulário de contacto (/contacto, /servicos, ficha de imóvel) sempre
-- exigiu e validou uma mensagem de texto livre, mas createLead() nunca a
-- gravava — `contactos` não tinha coluna para isso (é a tabela de Pessoa
-- do CRM eGO, sincronizada via `ego_link`/`ego_atualizado_em`, não uma
-- tabela de pedidos). Resultado: toda mensagem escrita por um visitante
-- do site era descartada silenciosamente.
--
-- Coluna nova, nullable, sem default: aditiva, não interfere com o
-- sync eGO (que escreve apenas os campos que conhece).

alter table contactos add column if not exists mensagem text;

comment on column contactos.mensagem is
  'Texto livre do pedido, escrito pelo visitante no site (não vem do eGO).';
