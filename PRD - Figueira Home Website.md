# PRD — Website Figueira Home
**Versão:** 1.1 · **Data:** Junho 2025  
**Cliente:** Figueira Home (Ondaveloz Mediação Imobiliária Lda) · AMI 7968  
**Referência visual:** `mockup-v2.html` (aprovado pelo cliente)

---

## 1. Contexto e Objetivos

A Figueira Home é uma agência imobiliária licenciada (AMI 7968) com sede em Buarcos, Figueira da Foz, ativa desde 2009. O site atual (figueirahome.pt) tem problemas de design desatualizado, erros de dados (área em sq ft em vez de m²) e fraca presença SEO.

**Objetivo:** construir um site moderno, rápido e apelativo que:
- Transmita profissionalismo e credibilidade local
- Gere leads (pedidos de avaliação, contactos)
- Apresente o portfólio de imóveis de forma clara
- Corrija todos os erros do site atual
- Seja responsivo e otimizado para SEO

---

## 2. Stack Técnica Recomendada

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| CMS / Imóveis | Headless WordPress + WPGraphQL **ou** Notion API (mais simples) |
| Formulários | React Hook Form + Resend (email) |
| Imagens | Next/Image com otimização automática |
| Deploy | Vercel |
| Analytics | Google Analytics 4 + Google Search Console |

> **Alternativa simples (vibe coding rápido):** HTML + CSS + JS vanilla em ficheiros estáticos, sem framework. Usar o `mockup-v2.html` como base direta.

---

## 3. Design System

### 3.1 Paleta de Cores

```css
--navy:    #0D2B4E;   /* fundo principal, nav, secções escuras */
--navy2:   #122F57;   /* cards sobre navy, variação */
--blue:    #1565C0;   /* CTAs primários, links ativos */
--blue-h:  #1976D2;   /* hover de blue */
--gold:    #C9943A;   /* acentos decorativos, botão CTA */
--gold-l:  #E8B86D;   /* texto dourado, tags, destaques */
--white:   #FFFFFF;
--offwhite:#F4F6F9;   /* fundos de secção alternados */
--text:    #1A2A3A;   /* texto corpo principal */
--muted:   #5A6A7A;   /* texto secundário / subtítulos */
--border:  #DDE3EC;   /* divisórias, bordas de card */
```

### 3.2 Tipografia

```
Headings: Raleway (Google Fonts) — weights: 700, 800
Body:     Open Sans (Google Fonts) — weights: 400, 500, 600
```

```html
<link href="https://fonts.googleapis.com/css2?family=Raleway:wght@700;800&family=Open+Sans:wght@400;500;600&display=swap" rel="stylesheet">
```

### 3.3 Espaçamento e Layout

- Max-width do conteúdo: `1200px`, centrado com `margin: 0 auto`
- Padding horizontal de secções: `48px` (desktop), `20px` (mobile)
- Gap entre elementos de grid: `24px` (cards), `64px` (two-col layouts)
- Border-radius: `4px` (botões), `6px` (cards)

### 3.4 Sombras

```css
/* card hover */
box-shadow: 0 16px 40px rgba(0,0,0,0.35);

/* nav scrolled */
box-shadow: 0 1px 0 #DDE3EC;
```

### 3.5 Sistema de Animações

#### Hero — Entrada em cascata (keyframe)
```css
@keyframes heroUp {
  from { opacity: 0; transform: translateY(36px); }
  to   { opacity: 1; transform: translateY(0); }
}
.hero-tag  { animation: heroUp 0.8s cubic-bezier(0.22,1,0.36,1) 0.25s both; }
.hero h1   { animation: heroUp 0.9s cubic-bezier(0.22,1,0.36,1) 0.45s both; }
.hero-sub  { animation: heroUp 0.8s cubic-bezier(0.22,1,0.36,1) 0.65s both; }
.hero-btns { animation: heroUp 0.8s cubic-bezier(0.22,1,0.36,1) 0.85s both; }
```

#### Scroll — Fade direcional (IntersectionObserver, threshold 0.12)
```css
/* fade vertical (padrão) */
.fade       { opacity:0; transform:translateY(24px);  transition: opacity 0.6s ease, transform 0.6s ease; }
/* slide da esquerda */
.fade-left  { opacity:0; transform:translateX(-52px); transition: opacity 0.7s ease, transform 0.7s ease; }
/* slide da direita */
.fade-right { opacity:0; transform:translateX(52px);  transition: opacity 0.7s ease, transform 0.7s ease; }

.fade.show, .fade-left.show, .fade-right.show { opacity:1; transform:translate(0,0); }
```

Uso nas secções:
- **Quem Somos:** texto → `fade-left`, imagem → `fade-right`
- **Cards** (serviços, imóveis, equipa, testemunhos): `fade` com `transition-delay` crescente (0s, 0.1s, 0.2s...)

#### Contadores animados (stats)
```js
// Ease-out cúbico de 0 → target em 1800ms
// Dispara ao entrar em viewport via IntersectionObserver (threshold 0.3)
// Elementos: <span class="count-num" data-count="78">0</span>
```

#### Zoom em imagens de cards (hover)
```css
.prop-img-wrap, .svc-img { overflow: hidden; }
.zoom-layer { transition: transform 0.55s ease; }
.prop-card:hover .zoom-layer,
.svc-card:hover .zoom-layer { transform: scale(1.07); }
```

#### Parallax no vídeo hero
```js
// O vídeo move-se a 28% da velocidade do scroll, criando profundidade
heroVideo.style.transform = `translateY(${scrollY * 0.28}px)`;
```

#### Nav transparente → branca
```js
// Ao scrollY > 20: adiciona classe .scrolled → background white + box-shadow
nav.classList.toggle('scrolled', window.scrollY > 20);
// transition: background 0.3s, box-shadow 0.3s
```

#### Card hover
- Elevação: `translateY(-5px)`, `transition: 0.25s`
- Botões: mudança de `background`, `transition: 0.2s`

---

## 4. Estrutura do Site (Páginas)

```
/ (Homepage)
/imoveis (Listagem de imóveis)
/imoveis/[slug] (Detalhe de imóvel)
/empreendimentos (Projetos / Developments)
/quem-somos (Sobre nós + Equipa)
/blog (Artigos)
/blog/[slug] (Artigo individual)
/contacto (Formulário + mapa)
```

---

## 5. Homepage — Secções Detalhadas

### 5.1 NAV

**Comportamento:**
- `position: sticky; top: 0; z-index: 200`
- **No topo da página:** `background: transparent`, texto branco, links com hover dourado (`#E8B86D`)
- **Ao fazer scroll (`scrollY > 20`):** transição suave para `background: white`, texto escuro, links com hover azul (`#1565C0`)
- Transição: `background 0.3s, box-shadow 0.3s`

**Conteúdo:**
- **Logo** (esquerda): `<img src="logotipo-pequeno.png">`, height `44px`
  - URL do logo: `https://figueirahome.pt/wp-content/uploads/2020/12/logotipo-pequeno.png`
  - Fallback se imagem falhar: texto "FigueiraHome" em Raleway
- **Links** (centro-direita): Home · Imóveis · Empreendimentos · Quem Somos · Blog
  - padding: `24px 16px`, border-bottom active: `3px solid currentColor`
- **CTA** (direita): botão "Contacto" — `background: #1565C0`, branco, `padding: 10px 24px`, `border-radius: 4px`

**Mobile:** hamburger menu (≤768px), menu lateral ou dropdown

---

### 5.2 HERO

**Layout:** full-width, `min-height: 620px`. O hero começa atrás do nav (`margin-top: -72px`), e o conteúdo tem `padding-top: 140px` para compensar.

**Vídeo de fundo:**
- Elemento: `<video autoplay muted loop playsinline>`
- Ficheiro web (produção): `Video/hero-web.mp4` (1080p, ~17MB, `faststart`)
- Ficheiro original: `Video/13335753_3840_2160_30fps.mp4` (4K, 30fps, 138MB — apenas arquivo)
- Poster (fallback enquanto carrega): `hero-poster.jpg` (frame extraído do vídeo ao segundo 8)
- Conteúdo do vídeo: vista aérea drone da praia da Figueira da Foz ao pôr do sol
- CSS: `object-fit: cover; object-position: center center; will-change: transform`
- Parallax: `translateY(scrollY * 0.28px)` aplicado via JS

> **Nota para produção:** para o site definitivo, poderão existir 2 vídeos diferentes — um para o hero e outro para o CTA/footer. O ficheiro atual é o mesmo para ambas as zonas.

**Overlay (gradiente sobre o vídeo):**
```css
background: linear-gradient(90deg,
  rgba(13,43,78,0.92)  0%,    /* navy opaco — área do texto */
  rgba(13,43,78,0.78) 28%,
  rgba(13,43,78,0.38) 52%,
  rgba(13,43,78,0.10) 72%,
  rgba(13,43,78,0.02) 100%);  /* transparente — vídeo visível */
```

**Conteúdo (alinhado à esquerda, z-index acima do gradiente):**
```
[tag]  —— IMOBILIÁRIA LICENCIADA AMI 7968
[h1]   A Sua Imobiliária de Referência na <span gold>Figueira da Foz</span>
[p]    Compre, venda ou arrende o seu imóvel com uma equipa local especializada,
       presente na região desde 2009. Transparência e resultados em cada transação.
[btns] [Ver Imóveis] [Avaliação Gratuita]
```

- Tag: `font-size: 0.75rem`, `letter-spacing: 2px`, uppercase, dourado (`#E8B86D`), linha decorativa à esquerda
- H1: Raleway 800, `clamp(2rem, 4vw, 3.2rem)`, branco, `line-height: 1.15`
- Parágrafo: Open Sans, `1rem`, `rgba(255,255,255,0.72)`, `line-height: 1.7`
- Botão primário: `background: #1565C0`, border `2px solid #1565C0`, branco
- Botão ghost: `background: transparent`, border `2px solid rgba(255,255,255,0.55)`, branco
- **Entrada:** animação em cascata (ver secção 3.5)

**Wave SVG** (transição para a secção navy seguinte):
```html
<svg viewBox="0 0 1440 64" preserveAspectRatio="none" style="position:absolute;bottom:0;width:100%">
  <path d="M0,64 C360,0 1080,0 1440,64 L1440,64 L0,64 Z" fill="#0D2B4E"/>
</svg>
```

---

### 5.3 3 SERVICE CARDS

**Layout:** fundo `#0D2B4E` (navy), 3 colunas, `gap: 24px`, `max-width: 1200px`

**Cards** (fundo `#122F57`, `border-radius: 6px`, `border: 1px solid rgba(255,255,255,0.07)`):
- Hover: `translateY(-5px)`, sombra intensa
- Imagem topo (180px): zoom `scale(1.08)` no hover via `.zoom-layer` (ver 3.5)

| Card | Título | Descrição resumida | Botão |
|---|---|---|---|
| 1 | Comprar Imóvel | Mais de 78 imóveis na Figueira da Foz. Aptos, moradias, terrenos, comercial. | Explorar Imóveis |
| 2 | Vender o Seu Imóvel | Avaliação gratuita, fotografia profissional, drone, marketing digital avançado. | Saber Mais |
| 3 | Arrendar ou Trespassar | Mediação de arrendamentos e trespasses. Processo simples e rápido. | Ver Disponíveis |

---

### 5.4 PESQUISA RÁPIDA (Search Banner)

**Layout:** faixa `#F4F6F9`, `padding: 40px 48px`, entre service cards e secção Quem Somos

**Campos (em linha no desktop):**
- Negócio: `<select>` → Comprar / Arrendar / Trespassar
- Localização: `<select>` → Qualquer zona / Figueira da Foz / Buarcos / Quiaios / Coimbra
- Tipo de Imóvel: `<select>` → Qualquer tipo / Apartamento / Moradia / Terreno / Comercial
- Preço Máximo: `<select>` → Sem limite / €100k / €200k / €300k / €500k
- Botão "🔍 Pesquisar" — `background: #1565C0`, branco

---

### 5.5 QUEM SOMOS + DIFERENCIAIS

**Layout:** fundo branco, `padding: 80px 48px`, 2 blocos

**Bloco A — 2 colunas com animação direcional:**
- Esquerda (`fade-left`): Texto "Quem Somos" + parágrafos + 3 stats com contador animado
- Direita (`fade-right`): Imagem/placeholder com accent borders azul/dourado nos cantos

**Texto:**
> A Figueira Home nasceu em 2009 com o objetivo de fazer a diferença no mercado imobiliário local. Apostamos em métodos de trabalho inovadores, tecnologia digital avançada e numa abordagem totalmente transparente — para que cada transação seja mais rápida, mais segura e mais satisfatória.
>
> Somos uma equipa local, licenciada pela IMPIC (AMI 7968), com profundo conhecimento de cada zona, cada rua e cada bairro da Figueira da Foz.

**Stats (contadores animados ao entrar em viewport):**
| Número | Label |
|---|---|
| 78+ | Imóveis disponíveis |
| 15+ | Anos de experiência |
| 500+ | Transações |

**Bloco B — Diferenciais (grid 2×2):**

| Ícone | Título | Descrição |
|---|---|---|
| 📸 | Fotografia Profissional | Foto e vídeo de alta qualidade, incluindo filmagem com drone para captação aérea. |
| 📊 | Avaliação de Mercado | Análise rigorosa do valor real do seu imóvel com base no mercado local atual. |
| 📱 | Marketing Digital | Presença em portais imobiliários, Google Ads, redes sociais e email marketing. |
| 📋 | Gestão Documental | Tratamos de toda a documentação e preparação para escritura. |

---

### 5.6 IMÓVEIS EM DESTAQUE

**Layout:** fundo `#0D2B4E`, `padding: 60px 48px`, grid de 3 cards

**Cards de imóvel** (com zoom `scale(1.07)` na imagem ao hover):

| Campo | Card 1 | Card 2 | Card 3 |
|---|---|---|---|
| Tipo | Apartamento T2 | Moradia T3+1 | Moradia T7 de Luxo |
| Título | Terraço com piscina panorâmica e vista mar | Tranquilidade e conforto em Quiaios | O Refúgio Perfeito — Vista sobre mar e serra |
| Local | Figueira da Foz — Buarcos | Quiaios — Figueira da Foz | Figueira da Foz |
| Preço | €420.000 | €299.000 | €1.200.000 |
| Quartos | 2 | 4 | 7 |
| WC | 2 | 3 | 5 |
| Área | 120 m² | 137 m² | 325 m² |
| Badge | Em Destaque | Moradia | Vista Mar |

> ⚠️ **Bug a corrigir do site atual:** exibir sempre área em **m²** (nunca em sq ft)

**Botão no fundo:** "Ver Todos os Imóveis (78) →"

---

### 5.7 A NOSSA EQUIPA

**Layout:** fundo `#F4F6F9`, 4 cards em linha

| Nome | Cargo | Detalhe |
|---|---|---|
| Sofia Monteiro | Sócia & Gerente | Processos & Documentação |
| Miguel Germano | Diretor Comercial | 50 imóveis em carteira |
| Maria José Bóia | Consultora | 12 imóveis em carteira |
| Alexandra Santos | Consultora | 8 imóveis em carteira |

Cada card: avatar circular com iniciais (navy bg, branco) + nome + cargo + detalhe. Usar foto real quando disponível.

---

### 5.8 TESTEMUNHOS

**Layout:** fundo branco, 3 cards em linha

| Estrelas | Texto | Autor | Data |
|---|---|---|---|
| ★★★★★ | "A equipa da Figueira Home foi excecional. Vendemos o apartamento em menos de 3 semanas, acima do preço que esperávamos. Recomendo sem hesitar." | Ana Carvalho | Vendedora · Março 2025 |
| ★★★★★ | "Encontrámos a casa dos nossos sonhos em Quiaios. O Miguel explicou tudo com clareza, sem pressão. O processo foi muito tranquilo do início ao fim." | Ricardo Silva | Comprador · Janeiro 2025 |
| ★★★★★ | "As fotos com drone do meu imóvel foram impressionantes. Recebi propostas na primeira semana de publicação. Profissionais de excelência." | Luísa Monteiro | Vendedora · Novembro 2024 |

---

### 5.9 CTA BANNER + FOOTER — Fundo de Vídeo Partilhado

**Estrutura HTML:** CTA banner e footer estão envolvidos num único `<div class="bg-video-wrap">` com vídeo de fundo partilhado.

```html
<div class="bg-video-wrap">
  <video class="bg-video" autoplay muted loop playsinline poster="hero-poster.jpg">
    <source src="Video/hero-web.mp4" type="video/mp4">
  </video>
  <div class="bg-overlay"></div>  <!-- overlay escuro: rgba(5,15,30,0.84) -->

  <section class="cta-banner">...</section>
  <footer>...</footer>
</div>
```

**Overlay:** `rgba(5, 15, 30, 0.84)` — escuro suficiente para legibilidade total do texto branco.

> **Nota:** o vídeo atual é o mesmo da praia da Figueira da Foz. Quando disponível um segundo vídeo (ex: vista noturna ou interior de imóvel), substituir o `src` neste wrapper.

---

#### 5.9.1 CTA BANNER

**Layout:** fundo transparente (vídeo por baixo), `padding: 70px 48px`, centrado

**Conteúdo:**
```
Quer vender o seu imóvel ao melhor preço?

Fazemos uma avaliação gratuita e sem compromisso. A nossa equipa coloca o seu
imóvel à frente de milhares de compradores ativos na região.

[Pedir Avaliação Gratuita]   [Falar com a Equipa]
```

Botão primário: `background: #C9943A` (gold), branco  
Botão secundário: outline branco

---

#### 5.9.2 FOOTER

**Layout:** fundo transparente (vídeo por baixo), `padding: 60px 48px 28px`, 4 colunas

**Coluna 1 — Logo + Info:**
- Logo Figueira Home (filter: branco)
- Badge "Licença AMI 7968"
- Texto descritivo
- Links sociais: Facebook · Instagram · YouTube · WhatsApp

**Coluna 2 — Imóveis:** Apartamentos · Moradias · Terrenos · Comercial · Empreendimentos · Arrendar

**Coluna 3 — A Empresa:** Quem Somos · A Nossa Equipa · Testemunhos · Blog · Recrutamento · Vender o Meu Imóvel

**Coluna 4 — Contacto:**
```
📍 Av. do Brasil, 48 · 3080-323 Buarcos · Figueira da Foz
📞 +351 233 408 130
📱 +351 913 702 002
✉️ geral.figueirahome@gmail.com
```

**Barra inferior:**
`© 2025 Figueira Home · Ondaveloz Mediação Imobiliária Lda · AMI 7968`  
Links: Política de Privacidade · Política de Cookies · Livro de Reclamações

---

## 6. Página de Imóveis (`/imoveis`)

- Filtros (sidebar ou topo): Negócio, Tipo, Localização, Preço min/máx, Quartos mín, Área mín
- Grid de cards responsivo (3 col desktop, 2 col tablet, 1 col mobile)
- Cada card: foto + badge (tipo/estado) + título + localização + preço + especificações (quartos, WC, **m²**)
- Paginação ou infinite scroll
- Ordenação: Mais Recentes / Preço Asc / Preço Desc / Área

---

## 7. Página de Detalhe de Imóvel (`/imoveis/[slug]`)

1. Galeria de fotos (slider/lightbox) — foto principal + thumbnails
2. Header: tipo + título + preço + badge + botão "Contactar sobre este imóvel"
3. Info rápida: quartos, WC, **área em m²**, ano construção, estado
4. Descrição completa
5. Características detalhadas (grid)
6. Mapa (localização aproximada)
7. Formulário de contacto / pedido de visita
8. Agente responsável (foto, nome, contacto direto)
9. Imóveis semelhantes (3 cards)

> ⚠️ **Bug crítico:** exibir sempre **m²** — o site atual mostra sq ft por erro de configuração

---

## 8. Requisitos Funcionais

### 8.1 Formulário de Contacto / Pedido de Avaliação
- Campos: Nome, Email, Telefone, Mensagem, Tipo de pedido (Comprar/Vender/Arrendar/Avaliação)
- Validação client-side obrigatória
- Envio por email para `geral.figueirahome@gmail.com`
- Mensagem de sucesso/erro visível
- Proteção: honeypot ou reCAPTCHA v3

### 8.2 Pesquisa de Imóveis
- Filtros combinados (AND lógico)
- URL com parâmetros (ex: `/imoveis?tipo=apartamento&preco_max=300000`)
- Resultado em tempo real ou botão "Pesquisar"

### 8.3 Partilha de Imóvel
- Botões de partilha: WhatsApp, Facebook, copiar link

---

## 9. SEO

### 9.1 Meta tags obrigatórias em cada página

```html
<title>Figueira Home — Imobiliária na Figueira da Foz | Compra, Venda e Arrendamento</title>
<meta name="description" content="Imobiliária licenciada (AMI 7968) em Figueira da Foz. Mais de 78 imóveis disponíveis — apartamentos, moradias, terrenos. Avaliação gratuita. Presentes na região desde 2009.">
<meta property="og:title" content="Figueira Home — Imobiliária na Figueira da Foz">
<meta property="og:description" content="Compre, venda ou arrende o seu imóvel com a equipa local de referência.">
<meta property="og:image" content="/og-image.jpg">
<meta property="og:type" content="website">
<meta property="og:locale" content="pt_PT">
```

### 9.2 Schema.org (JSON-LD)

```json
{
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  "name": "Figueira Home",
  "url": "https://figueirahome.pt",
  "telephone": "+351233408130",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Av. do Brasil, 48",
    "addressLocality": "Buarcos",
    "postalCode": "3080-323",
    "addressCountry": "PT"
  },
  "openingHours": "Mo-Fr 09:00-18:00"
}
```

### 9.3 Outras práticas SEO
- URLs amigáveis em português: `/imoveis/apartamento-t2-buarcos-figueira-da-foz`
- `sitemap.xml` gerado automaticamente
- `robots.txt` correto
- Imagens com `alt` descritivo
- Velocidade: WebP, lazy loading, Core Web Vitals verdes

---

## 10. Responsividade

| Breakpoint | Layout |
|---|---|
| ≥ 1200px | Desktop completo, 3 colunas em grids |
| 768px–1199px | Tablet, 2 colunas, nav comprimida |
| < 768px | Mobile, 1 coluna, hamburger menu |

**Elementos críticos no mobile:**
- Hero: texto stack vertical, botões em coluna, vídeo com `object-position: 60% center` para focar na praia
- Nav: hamburger com menu overlay
- Cards: 1 coluna
- Pesquisa: campos em coluna, botão full-width
- Vídeos de fundo: manter `autoplay muted playsinline` (obrigatório no iOS)

---

## 11. Performance e Qualidade

- Lighthouse Score: ≥ 90 em Performance, Acessibilidade, SEO
- Imagens: formato WebP, lazy loading
- Fontes: `display=swap` no Google Fonts
- HTTPS obrigatório

**Gestão dos vídeos de fundo:**
- Servir sempre a versão web comprimida (1080p, ~17MB), nunca o original 4K
- Usar `preload="none"` ou `preload="metadata"` para não bloquear o carregamento inicial
- Adicionar `<link rel="preload" as="video" href="Video/hero-web.mp4">` no `<head>` para o hero
- Em mobile (< 768px), considerar substituir o vídeo por imagem estática (`hero-poster.jpg`) para poupar dados móveis
- `movflags +faststart` obrigatório no encoding (permite reprodução antes do download completo)

---

## 12. Correções Prioritárias vs. Site Atual

| # | Problema atual | Correção |
|---|---|---|
| 1 | Área dos imóveis em sq ft | Exibir sempre em **m²**. Verificar e corrigir na fonte de dados. |
| 2 | Meta description genérica | Usar descrição específica com keywords locais e AMI |
| 3 | Design desatualizado | Novo design conforme mockup-v2.html |
| 4 | Sem animações de entrada | Sistema completo: cascata hero, fade direcional, contadores, zoom cards |
| 5 | Nav sempre branca | Nav transparente no hero (sobre vídeo), branca ao scroll |
| 6 | Sem CTA forte | Botão "Avaliação Gratuita" no hero + CTA banner com vídeo de fundo |
| 7 | Sem identidade visual local | Vídeo aéreo da praia da Figueira da Foz no hero e CTA/footer |

---

## 13. Assets e Ficheiros

| Asset | Localização / Ficheiro | Notas |
|---|---|---|
| Logo PNG | `https://figueirahome.pt/wp-content/uploads/2020/12/logotipo-pequeno.png` | Usar filter:invert no footer |
| Vídeo hero (web) | `Video/hero-web.mp4` | 1080p, 15s, ~17MB, H.264, faststart |
| Vídeo original | `Video/13335753_3840_2160_30fps.mp4` | 4K, 30s, 138MB — só arquivo |
| Poster hero | `hero-poster.jpg` | Frame do vídeo ao segundo 8 |
| Foto clock tower | `clock tower orizontal.jpg` | Fallback alternativo para hero |
| Mockup aprovado | `mockup-v2.html` | Fonte da verdade para design |
| Referência layout | `layout a usar.jpg` | Layout original de referência |
| Favicon | A criar | Baseado no logo |
| OG Image | A criar | 1200×630px, foto da cidade + logo |
| Vídeo CTA/footer | A fornecer pelo cliente | Por agora usa o mesmo `hero-web.mp4` |

---

## 14. Checklist de Entrega

- [ ] Homepage completa e responsiva
- [ ] Nav transparente no hero / branca ao scroll
- [ ] Vídeo hero a funcionar (autoplay, muted, loop, fallback para poster no mobile)
- [ ] Vídeo CTA+footer a funcionar
- [ ] Todos os sistemas de animação implementados (cascata, fade direcional, contadores, zoom, parallax)
- [ ] Formulário de contacto a funcionar (envio de email)
- [ ] Formulário de avaliação gratuita
- [ ] Página de listagem de imóveis com filtros
- [ ] Página de detalhe de imóvel (área em m²)
- [ ] Integração com portfólio real (WordPress/API ou CMS)
- [ ] SEO: meta tags + Schema.org em todas as páginas
- [ ] Sitemap.xml + robots.txt
- [ ] Google Analytics 4 instalado
- [ ] Lighthouse ≥ 90
- [ ] Testes em iOS Safari e Chrome Android (especialmente vídeo autoplay)
- [ ] Cookie consent (RGPD)
- [ ] Política de Privacidade atualizada
- [ ] Livro de Reclamações eletrónico (link obrigatório por lei)

---

*PRD v1.1 — atualizado após sessão de design com as seguintes alterações vs. v1.0: hero com vídeo drone em vez de imagem estática, parallax no hero, sistema de animações expandido (cascata, direcional, contadores, zoom), CTA banner e footer com vídeo de fundo partilhado.*  
*Referência de design: `mockup-v2.html` — usar como fonte da verdade.*
