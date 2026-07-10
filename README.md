# Figueira Home

Site Next.js App Router para a Figueira Home, com imóveis dinâmicos em Supabase, leads e chat AI.

## Ambiente

Crie `.env.local` quando houver Supabase/Vercel AI Gateway:

```bash
NEXT_PUBLIC_SITE_URL=https://figueirahome.pt
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
AI_MODEL=openai/gpt-5.4
```

Sem Supabase configurado, o site usa dados locais de exemplo para permitir desenvolvimento.

## Supabase

O site usa as tabelas existentes do projeto Supabase.

Mapeamento atual:

- `imoveis`: fonte principal para listagem, destaques, detalhe e pesquisa do chat
- `contactos`: destino dos leads criados por formulários e chat

Regra de publicação atual:

- `disponibilidade = "Disponível"`
- preço de venda ou arrendamento maior que zero

Mapeamento de campos de imóveis:

- `imovel_ref` gera o slug público
- `titulo` ou, quando vazio, `natureza + localização`
- `descricao`
- `natureza`, `quartos`, `casas_banho`
- `area_util`, com fallback para `area_bruta` e `area_terreno`
- `venda_preco` ou `arrendamento_preco`
- `zona`, `freguesia`, `concelho`
- `foto_principal` e `fotos`

Grave sempre áreas em metros quadrados; a aplicação renderiza sempre `m²`.
