import type { Metadata } from "next";
import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import "./servicos.css";
import { ServicosScrollEffects } from "@/components/servicos/scroll-effects";
import { VideoLightboxProvider, VideoCard, CaseFilmButton } from "@/components/servicos/video-lightbox";
import { ServicosContactForm } from "@/components/servicos/contact-form";

export const metadata: Metadata = {
  title: "Serviços para Proprietários",
  description: "Figueira Home · AMI 7968 · Desde 2009. Pré-venda nas redes sociais com minifilmes e IA: 247 leads por imóvel em média e imóveis vendidos sem chegarem aos portais."
};

const metrics = [
  { value: 3, suffix: "%", label: "Desconto médio", note: "Face ao valor anunciado. A média nacional varia entre 3% e 10%." },
  { value: 50, suffix: "", label: "Dias até proposta", note: "Tempo médio até proposta aceite — menos 54% face ao ano anterior." },
  { value: 3, suffix: "", label: "Visitas para fechar", note: "Compradores qualificados e visita virtual 3D antes da visita presencial." },
  { value: 0, suffix: "", label: "Escrituras falhadas", note: "Acompanhamento jurídico e documental do início ao fim do processo." }
];

const steps = [
  ["Análise de Expectativas", "Ouvimo-lo primeiro: valor pretendido, urgência, responsabilidades financeiras e a sua situação específica. A estratégia constrói-se à sua medida."],
  ["Estudo de Mercado", "Transações recentes, concorrência direta, tendências da zona e conhecimento local. Chegamos a um preço justo — e defendemo-lo com dados."],
  ["Análise da Documentação", "Caderneta, registo, licença de utilização e certificado energético. Resolvemos pendências antes de ir a mercado, não à porta do cartório."],
  ["Divulgação", "Fotografia e vídeo profissionais, visita virtual 3D, campanhas pagas, portais nacionais e internacionais e montra na Avenida Marginal."],
  ["Qualificação de Clientes", "Antes de qualquer visita validamos motivação, orçamento, necessidade de financiamento e prazo de decisão. Menos visitas, mais qualidade."],
  ["Negociação de Propostas", "Cada proposta é analisada e apresentada com contexto. Não cedemos por pressão — cedemos apenas quando os dados o justificam."],
  ["Preparação para Escritura", "CPCV, financiamento, IMT e articulação com advogados, bancos, solicitadores e cartórios. Sem surpresas de última hora."],
  ["Escritura", "Acompanhamo-lo até ao fim. Recebe o valor da sua venda com segurança, transparência e no menor tempo possível."]
];

const pillars = [
  { icon: <path d="M12 3v3M5.6 5.6l2.1 2.1M3 12h3M18 12h3M16.3 7.7l2.1-2.1M9 17h6M10 21h4M8.5 17a5.5 5.5 0 1 1 7 0" />, title: "Storytelling com IA", text: "Damos vida ao potencial do seu imóvel: o jardim com piscina numa tarde de verão, o terraço ao fim do dia com o sol a cair sobre o mar. O comprador não vê divisões — imagina a sua vida ali.", tag: "Imaginar antes de visitar" },
  { icon: <><rect x="2.5" y="6" width="13" height="12" rx="2.5" /><path d="M15.5 10.5 21.5 7v10l-6-3.5z" /></>, title: "Minifilmes com Consultores", text: "O consultor apresenta o imóvel em vídeo e mostra a envolvente — acessos, comércio, proximidade ao mar. Legendado em português, inglês e francês, para Instagram, Facebook, YouTube, TikTok e LinkedIn.", tag: "Rosto e confiança" },
  { icon: <><path d="M3 11v2a1 1 0 0 0 1 1h2.5L13 18.5v-13L6.5 10H4a1 1 0 0 0-1 1z" /><path d="M17 9.2a4 4 0 0 1 0 5.6M19.6 6.6a7.5 7.5 0 0 1 0 10.8" /></>, title: "Campanhas Pagas nas Redes Sociais", text: "Publicidade segmentada por localização, idade, interesses e comportamento de pesquisa. Investimento real para colocar o seu imóvel à frente de quem tem intenção de compra.", tag: "Alcance dirigido" },
  { icon: <path d="m12 3 2.6 5.6 6.1.8-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6L3.3 9.4l6.1-.8z" />, title: "Destaque no Idealista", text: "Posicionamos o seu imóvel nos lugares cimeiros do maior portal do país. Nas primeiras posições recebem-se contactos; na quarta página, recebe-se silêncio.", tag: "Lugares cimeiros" }
];

const flowSteps = [
  ["Cruzamento de Perfis", "A IA analisa toda a carteira e identifica os clientes cujas preferências correspondem ao seu imóvel. Em minutos, não em dias."],
  ["Contacto Proativo", "Centenas de compradores contactados em simultâneo, de forma personalizada e prioritária, sem nenhum ficar por responder."],
  ["Qualificação Final pelo Consultor", "Quem demonstra interesse real passa para o consultor, que valida motivação, orçamento e prazo antes de agendar a visita."]
];

const vsteps = [
  ["Identificamos o Potencial", "Antes de gravar, analisamos o seu imóvel e identificamos os pontos fortes que vão ressoar no comprador certo. Um jardim torna-se uma tarde de família. Um terraço, um momento de paz ao fim do dia. Uma sala ampla, uma família reunida."],
  ["Produzimos o Minifilme", "O consultor apresenta o imóvel em vídeo, em primeira pessoa. A Inteligência Artificial completa os cenários de vida — piscina no jardim, churrasqueira ao fim de semana, alguém a ler no terraço ao final da tarde. Um conteúdo com impacto emocional imediato, que ainda poucos fazem em Portugal."],
  ["Campanha Paga nas Redes Sociais", "Instagram, Facebook, YouTube, TikTok e LinkedIn. Campanhas pagas e segmentadas que chegam a milhares de potenciais compradores — incluindo quem não estava sequer à procura de casa. Quanto mais pessoas veem o seu imóvel, mais fácil é obter o valor que pretende."]
];

const cases = [
  { ref: "FH2560", title: "Apartamento T1 em localização privilegiada · Figueira da Foz", badge: "sold", badgeLabel: "✓ Vendido", metrics: [["121", "leads gerados", true], ["8", "dias até proposta aceite", true], ["61", "compradores contactados", false], ["1", "visita presencial", false], ["0%", "negociação · vendido pelo preço pedido", false, true]], neverPortals: true, note: "Uma única visita presencial foi suficiente para gerar a proposta.", videoId: "d2JKQDHVWlA", filmLabel: "A campanha que vendeu este imóvel" },
  { ref: "FH2562", title: "Apartamento · Oportunidade de Férias", badge: "sold", badgeLabel: "✓ Vendido", metrics: [["193", "leads gerados", true], ["15", "dias até proposta aceite", true], ["92", "compradores contactados", false], ["1", "visita presencial", false], ["-9,4%", "negociação face ao valor anunciado", false, true]], neverPortals: true, note: "193 leads e uma visita presencial bastaram para fechar em 15 dias.", videoId: "Zlvdk9bXINo", filmLabel: "A campanha que vendeu este imóvel" },
  { ref: "FH2520", title: "Andar de Moradia T4 com Garagem e Anexo", badge: "sold", badgeLabel: "Reservado", metrics: [["350", "leads gerados", true], ["92", "dias até proposta aceite", true], ["178", "compradores contactados", false], ["3", "visitas presenciais", false], ["-5,5%", "negociação face ao valor anunciado", false, true]], neverPortals: false, note: "Imóvel de maior complexidade — ainda assim, negociação abaixo da média de mercado, que varia entre 3% e 10%.", videoId: "OxEWkBn9_MA", filmLabel: "A campanha que levou à reserva" },
  { ref: "FH2550", title: "T3 Remodelado com Garagem · Praia de Buarcos", badge: "live", badgeLabel: "Em campanha", metrics: [["691", "leads gerados", true], ["49", "dias de campanha", true], ["252", "compradores contactados", false], ["6", "visitas presenciais", false]], neverPortals: false, note: "Em fase de pré-venda nas redes sociais, ainda antes de entrar nos portais.", videoId: "BKgx7KK7Eaw", filmLabel: "A campanha que está no ar agora" },
  { ref: "FH2573", title: "T2 Vista Mar · Condomínio de Luxo · Frente à Praia", badge: "live", badgeLabel: "Em campanha", metrics: [["344", "leads gerados", true], ["34", "dias de campanha", true], ["156", "compradores contactados", false], ["420.000 €", "valor pedido", false]], neverPortals: false, note: "Imóvel de luxo — 344 leads qualificados em 34 dias, em pré-venda exclusiva.", videoId: "zFIIaplJ3Pc", filmLabel: "A campanha que está no ar agora" },
  { ref: "FH2578", title: "T2 no Centro da Figueira da Foz · Pronto a Habitar", badge: "live", badgeLabel: "Em campanha", metrics: [["276", "leads gerados", true], ["27", "dias de campanha", true], ["95", "compradores contactados", false], ["2", "visitas presenciais", false]], neverPortals: false, note: "Em fase de qualificação de compradores antes de entrar nos portais.", videoId: "H4rUsvUGo5g", filmLabel: "A campanha que está no ar agora" }
] as const;

const videos = [
  { id: "EMpiceuEeOw", ref: "FH2581", title: "Moradia T5 com Estúdio Independente · Quinta da Borloteira" },
  { id: "OOFDXHvgfdY", ref: "FH2283DN", title: "Bellevue · Lojas e Escritórios no Bairro Novo" },
  { id: "CH1rrammR68", ref: "FH2572", title: "T4 na Cidade com Garagem · Excelente Estado" },
  { id: "aG-n_M70cq4", ref: "FH2571", title: "T2 com Terraço no Centro · Pronto a Habitar" },
  { id: "zFzWfBXrERg", ref: "FH2450B", title: "Moradia T2+T2 Renovada · 100 m da Praia de Buarcos" },
  { id: "LMtjiYwZG8A", ref: "FH2580", title: "T3 Novo para Arrendar · Buarcos", flag: "Reservado" }
] as const;

const countries = [
  { flags: ["🇵🇹"], name: "Portugal", portals: ["Figueira Home", "Supercasa", "Idealista", "Imovirtual", "Casas na Web", "Net Anúncio", "Mitula", "OLX"] },
  { flags: ["🇬🇧"], name: "Reino Unido", portals: ["propertiesinportugal.uk", "Zoopla", "Primelocation"], soon: "Rightmove — em análise" },
  { flags: ["🇫🇷"], name: "França", portals: ["immobilierportugal.fr", "Propriétés Le Figaro"] },
  { flags: ["🇩🇪", "🇦🇹"], name: "Alemanha / Áustria", portals: ["Immowelt", "Immonet"] },
  { flags: ["🇺🇸"], name: "Estados Unidos", portals: ["Realtor.com"] },
  { flags: ["🇧🇷"], name: "Brasil", portals: ["portugalcasas.com.br"] }
] as const;

const properstarFlags = [
  ["Bélgica", "🇧🇪"], ["Países Baixos", "🇳🇱"], ["Suíça", "🇨🇭"], ["Polónia", "🇵🇱"], ["Roménia", "🇷🇴"], ["Grécia", "🇬🇷"],
  ["Chipre", "🇨🇾"], ["Suécia", "🇸🇪"], ["Dinamarca", "🇩🇰"], ["Luxemburgo", "🇱🇺"], ["Canadá", "🇨🇦"], ["México", "🇲🇽"],
  ["China", "🇨🇳"], ["Índia", "🇮🇳"], ["Japão", "🇯🇵"], ["Singapura", "🇸🇬"], ["Malásia", "🇲🇾"], ["Emirados Árabes Unidos", "🇦🇪"],
  ["Catar", "🇶🇦"], ["Hong Kong", "🇭🇰"], ["Filipinas", "🇵🇭"], ["Austrália", "🇦🇺"], ["Nova Zelândia", "🇳🇿"], ["África do Sul", "🇿🇦"], ["Maurícia", "🇲🇺"]
] as const;

const techCards = [
  { icon: <><path d="M3.5 8.5 12 4l8.5 4.5v7L12 20l-8.5-4.5z" /><path d="M12 12v8M3.5 8.5 12 12l8.5-3.5" /></>, title: "Visita Virtual 3D", text: "O comprador percorre o seu imóvel a qualquer hora, de qualquer parte do mundo — e pode medir espaços no ambiente virtual para confirmar se os móveis cabem, antes sequer de o visitar." },
  { icon: <><circle cx="6" cy="7" r="2.5" /><circle cx="18" cy="17" r="2.5" /><path d="M8.5 7H13a3.5 3.5 0 0 1 3.5 3.5V15M15.5 17H11a3.5 3.5 0 0 1-3.5-3.5V9.5" /></>, title: "Matching por IA", text: "Cruzamento automático entre as características do seu imóvel e as preferências de todos os compradores em carteira. O comprador certo pode já estar na nossa base de dados." },
  { icon: <><rect x="4" y="7" width="16" height="12" rx="3.5" /><path d="M12 3v4M9 12v2M15 12v2M9.5 16.5h5" /></>, title: "Qualificação com IA", text: "Triagem automática de interessados 24/7, em qualquer idioma, com recolha da informação essencial antes de o contacto chegar ao consultor. Nenhuma oportunidade perdida.", badge: "Em desenvolvimento" },
  { icon: <><rect x="3" y="4" width="18" height="16" rx="2.5" /><path d="M3 9h18M7.5 13h4M7.5 16.5h7" /></>, title: "Portal do Proprietário", text: "Toda a informação da venda em tempo real: estatísticas de visualizações, registo de contactos e visitas, feedback dos compradores e estado do processo.", badge: "Em breve" }
];

const ai247Cards = [
  { icon: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5.2l3.2 2" /></>, title: "Resposta Imediata", text: "O agente responde instantaneamente a qualquer dúvida sobre o seu imóvel — características, preço, localização e disponibilidade para visita." },
  { icon: <><circle cx="12" cy="12" r="9" /><path d="M3.2 12h17.6M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18z" /></>, title: "Qualquer Língua", text: "Compradores britânicos, franceses, alemães ou brasileiros recebem a mesma qualidade de atendimento que um cliente português." },
  { icon: <><rect x="3.5" y="5" width="17" height="15.5" rx="2.5" /><path d="M3.5 10h17M8 3v4M16 3v4M9.5 14.6l1.9 1.9 3.4-3.7" /></>, title: "Agendamento de Visitas", text: "Quando o cliente é viável, o agente agenda a visita com o consultor — sem demora, sem espera, sem oportunidades perdidas." },
  { icon: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m15.5 15.5 5 5" /></>, title: "Contacto Proativo", text: "Além de responder, o agente contacta ativamente centenas de compradores da nossa base de dados cujo perfil corresponde ao seu imóvel." }
];

const facts = [
  { icon: <><path d="M12 3 3 7.5l9 4.5 9-4.5z" /><path d="M6.5 10.5V15c0 1.7 2.5 3 5.5 3s5.5-1.3 5.5-3v-4.5M21 7.5V13" /></>, title: "Formação contínua", text: "Mentorias ativas em IA aplicada ao imobiliário, legislação, fiscalidade e mercado — partilhadas com toda a equipa e reforçadas em eventos do setor." },
  { icon: <><path d="M16 20v-1.5A3.5 3.5 0 0 0 12.5 15h-5A3.5 3.5 0 0 0 4 18.5V20" /><circle cx="10" cy="8" r="3.2" /><path d="M17 11.5a3 3 0 1 0-2-5.3M20 20v-1.5a3.5 3.5 0 0 0-2.6-3.4" /></>, title: "Quase 16.000 seguidores", text: "Uma voz de referência no imobiliário local, presente no Instagram, Facebook, LinkedIn e TikTok — audiência que trabalha a favor do seu imóvel." },
  { icon: <><path d="M12 2.5 4.5 6v6.2c0 4.6 3.2 7.9 7.5 9.3 4.3-1.4 7.5-4.7 7.5-9.3V6z" /><path d="m8.8 12.2 2.2 2.2 4.3-4.6" /></>, title: "Licença AMI 7968", node: <>Segurança jurídica, seguro de responsabilidade civil obrigatório e idoneidade comprovada. Pode verificar a licença a qualquer momento em <a href="https://www.impic.pt" target="_blank" rel="noopener">impic.pt</a>.</> },
  { icon: <><path d="M4 20V9.5L12 4l8 5.5V20" /><path d="M4 12.5h16M9 20v-4.5h6V20" /></>, title: "Montra na Avenida Marginal", text: "Painel LED e televisão em passagem contínua, numa das principais artérias da cidade. Exposição permanente do seu imóvel, 24 horas por dia, 7 dias por semana." }
];

export default function ServicosPage() {
  return (
    <>
      <ServicosScrollEffects />
      <main className="servicos-page" id="top">
        <VideoLightboxProvider>

          {/* 1. HERO */}
          <section className="hero">
            <span className="hero__aura" aria-hidden="true" />
            <span className="hero__aura hero__aura--2" aria-hidden="true" />
            <div className="wrap hero__inner">
              <span className="eyebrow"><span className="dot" /> Figueira da Foz · Mediação Imobiliária</span>
              <h1>O Seu Imóvel nas <em>Melhores Mãos</em></h1>
              <p className="hero__sub">A estratégia certa para vender bem e depressa.</p>
              <div className="hero__actions">
                <a href="#contacto" className="btn btn--gold">Falar com um consultor</a>
                <a href="#resultados" className="btn btn--ghost">Ver resultados reais</a>
              </div>
              <a href="#contacto" className="hero__val">
                <span className="hero__val__txt">
                  <b>Quer saber o valor do seu imóvel?</b>
                  <i>Avaliação gratuita e sem compromisso, por quem acompanha o mercado da Figueira da Foz todos os dias.</i>
                </span>
                <span className="btn btn--gold btn--sm">Pedir avaliação</span>
              </a>
              <div className="hero__badges">
                <div className="hero__badge"><b>AMI 7968</b><span>Licença IMPIC</span></div>
                <div className="hero__badge"><b>Desde 2009</b><span>Experiência local</span></div>
                <div className="hero__badge"><b>+300 Famílias</b><span>Já confiaram em nós</span></div>
              </div>
            </div>
            <div className="scroll-hint" aria-hidden="true"><span>Descer</span><i /></div>
          </section>

          {/* 2. MÉTRICAS */}
          <section className="section section--tight">
            <div className="wrap">
              <div className="section-head section-head--center reveal">
                <span className="eyebrow"><span className="dot" /> Resultados</span>
                <h2>Números que falam por si</h2>
                <p className="lead">Indicadores reais da nossa atividade — o que um proprietário pode esperar quando confia o seu imóvel à Figueira Home.</p>
              </div>
              <div className="metrics">
                {metrics.map((m) => (
                  <article key={m.label} className="metric reveal">
                    <div className="metric__value" data-count={m.value} data-suffix={m.suffix}>0</div>
                    <div className="metric__label">{m.label}</div>
                    <p className="metric__note">{m.note}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* 3. O NOSSO PROCESSO */}
          <section className="section section--soft" id="processo">
            <div className="wrap">
              <div className="section-head reveal">
                <span className="eyebrow"><span className="dot" /> O Nosso Processo</span>
                <h2>Oito etapas. Nenhuma deixada ao acaso.</h2>
                <p className="lead">Da primeira conversa à assinatura da escritura, cada fase tem objetivos claros, responsáveis definidos e prazos acordados consigo.</p>
              </div>
              <div className="steps">
                {steps.map(([title, text], index) => (
                  <article key={title} className="step reveal">
                    <div className="step__num">{String(index + 1).padStart(2, "0")}</div>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* 4. DIVULGAÇÃO EM DETALHE */}
          <section className="section dark" id="divulgacao">
            <div className="wrap">
              <div className="section-head reveal">
                <span className="eyebrow"><span className="dot" /> Divulgação em Detalhe</span>
                <h2>O seu imóvel visto por quem realmente o quer comprar</h2>
                <p className="lead">Não basta publicar. Construímos uma narrativa em torno do seu imóvel e levamo-la, com investimento pago e tecnologia, ao perfil certo de comprador.</p>
              </div>
              <div className="pillars">
                {pillars.map((p) => (
                  <article key={p.title} className="pillar reveal">
                    <div className="pillar__icon" aria-hidden="true"><svg viewBox="0 0 24 24">{p.icon}</svg></div>
                    <h3>{p.title}</h3>
                    <p>{p.text}</p>
                    <span className="tag">{p.tag}</span>
                  </article>
                ))}
              </div>

              <div className="ai-block reveal">
                <div className="ai-block__head">
                  <span className="eyebrow"><span className="dot" /> Base de Dados Ativa</span>
                  <h3>Um agente de IA que contacta centenas de compradores em simultâneo</h3>
                  <p>Assim que o seu imóvel entra em carteira, a nossa IA cruza toda a base de dados de compradores e investidores e contacta, em minutos, todos os perfis compatíveis — ainda antes da publicação nos portais.</p>
                </div>
                <div className="flow">
                  {flowSteps.map(([title, text], index) => (
                    <Fragment key={title}>
                      <div className="flow__step reveal">
                        <div className="flow__n">{index + 1}</div>
                        <h4>{title}</h4>
                        <p>{text}</p>
                      </div>
                      {index < flowSteps.length - 1 && <div className="flow__arrow" aria-hidden="true">→</div>}
                    </Fragment>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* 5. A DIFERENÇA */}
          <section className="section" id="diferenca">
            <div className="wrap">
              <div className="manifesto">
                <div className="reveal">
                  <span className="eyebrow"><span className="dot" /> A Diferença</span>
                  <p className="manifesto__quote">Imagens simples do imóvel nos portais ou um minifilme com o consultor a contar a história de como é viver ali — qual impacta mais?</p>
                </div>
                <div className="manifesto__text reveal">
                  <p>A resposta é simples: as pessoas <strong>ligam-se com pessoas</strong>, não com fotografias. Quando o consultor aparece em vídeo, apresenta o imóvel com emoção e detalhe, e a Inteligência Artificial transforma o espaço em cenários reais de vida — o impacto é incomparável.</p>
                  <p>Isto é <strong>marketing ativo</strong>. O seu imóvel aparece a pessoas que não estavam sequer à procura — mas que, ao ver o vídeo, se imaginam imediatamente a viver ali. É assim que surgem mais propostas e melhores valores de venda.</p>
                  <span className="manifesto__hl">Muitos dos nossos imóveis são vendidos nesta fase, sem nunca chegarem aos portais.</span>
                </div>
              </div>
              <div className="vsteps">
                {vsteps.map(([title, text], index) => (
                  <article key={title} className="vstep reveal">
                    <div className="vstep__n">{String(index + 1).padStart(2, "0")}</div>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* 6. RESULTADOS REAIS */}
          <section className="section section--soft" id="resultados">
            <div className="wrap">
              <div className="section-head section-head--center reveal">
                <span className="eyebrow"><span className="dot" /> Resultados Reais</span>
                <h2>O que estamos a conseguir — em números reais</h2>
                <p className="lead">Dados das nossas campanhas de 2026. Cada imóvel, cada campanha — com resultados que falam por si.</p>
              </div>

              <div className="leadbar reveal">
                <div className="leadbar__item">
                  <div className="leadbar__v" data-count="247">0</div>
                  <div className="leadbar__l">Leads gerados por imóvel, em média</div>
                  <div className="leadbar__c">campanhas ativas em 2026</div>
                </div>
                <div className="leadbar__item">
                  <div className="leadbar__v" data-count="2700" data-prefix="+" data-group="1">0</div>
                  <div className="leadbar__l">Leads gerados no total</div>
                  <div className="leadbar__c">portfólio atual em campanha</div>
                </div>
                <div className="leadbar__item">
                  <div className="leadbar__v" data-count="38" data-suffix=" dias">0</div>
                  <div className="leadbar__l">Tempo médio até proposta aceite</div>
                  <div className="leadbar__c">nos imóveis vendidos em pré-venda</div>
                </div>
                <div className="leadbar__item">
                  <div className="leadbar__v">24/7</div>
                  <div className="leadbar__l">Agente de IA disponível</div>
                  <div className="leadbar__c">sem clientes perdidos por falta de resposta</div>
                </div>
              </div>

              <div className="cases">
                {cases.map((c) => (
                  <article key={c.ref} className="case reveal">
                    <div className="case__head">
                      <div className="case__ref">{c.ref}</div>
                      <div className="case__title">{c.title}</div>
                      <span className={`case__badge case__badge--${c.badge}`}>{c.badgeLabel}</span>
                    </div>
                    <div className="case__body">
                      <div className="case__metrics">
                        {c.metrics.map(([v, l, hl, wide]) => (
                          <div key={l} className={`cm${hl ? " cm--hl" : ""}${wide ? " cm--wide" : ""}`}><div className="cm__v">{v}</div><div className="cm__l">{l}</div></div>
                        ))}
                      </div>
                      {c.neverPortals && <div className="case__flag"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12.5 9 17.5 20 6.5" /></svg><span>O imóvel nunca chegou aos portais</span></div>}
                      <p className="case__note">{c.note}</p>
                      <CaseFilmButton id={c.videoId} reference={c.ref} label={c.filmLabel} />
                    </div>
                  </article>
                ))}
              </div>

              <div className="section-head section-head--center reveal videos-head">
                <span className="eyebrow"><span className="dot" /> Mais Minifilmes</span>
                <h2>Outras campanhas no ar</h2>
                <p className="lead">Cada imóvel tem o seu minifilme, gravado pelo consultor que o acompanha. Carregue em qualquer um para ver — são campanhas a decorrer agora.</p>
              </div>
              <div className="videos">
                {videos.map((v) => <VideoCard key={v.ref} id={v.id} reference={v.ref} title={v.title} flag={"flag" in v ? v.flag : undefined} />)}
              </div>
            </div>
          </section>

          {/* 7. DUAS FASES */}
          <section className="section" id="fases">
            <div className="wrap">
              <div className="section-head reveal">
                <span className="eyebrow"><span className="dot" /> Estratégia em Duas Fases</span>
                <h2>Duas fases, uma estratégia — sempre a pensar em si</h2>
                <p className="lead">Se o seu imóvel for vendido na fase de redes sociais, ótimo. Se não, avançamos para a segunda fase — com a mesma qualidade e rigor.</p>
              </div>
              <div className="phases">
                <article className="phase reveal">
                  <div className="phase__head">
                    <div className="phase__n">1</div>
                    <div><div className="phase__t">Pré-Venda nas Redes Sociais</div><div className="phase__s">Antes de entrar em qualquer portal</div></div>
                  </div>
                  <ul className="phase__list">
                    <li>Análise do potencial e produção do minifilme com consultor e IA</li>
                    <li>Campanha paga no Instagram, Facebook, YouTube, TikTok e LinkedIn</li>
                    <li>Agente de IA a contactar ativamente compradores da base de dados</li>
                    <li>Qualificação dos leads e marcação de visitas pelos consultores</li>
                    <li>Mensagem de exclusividade — &ldquo;Seja o primeiro a visitar&rdquo;</li>
                  </ul>
                </article>
                <article className="phase phase--2 reveal">
                  <div className="phase__head">
                    <div className="phase__n">2</div>
                    <div><div className="phase__t">Mercado Aberto nos Portais</div><div className="phase__s">Se necessário — com destaque garantido</div></div>
                  </div>
                  <ul className="phase__list">
                    <li>Publicação em 33 países e mais de 70 portais nacionais e internacionais</li>
                    <li>Destaque nos lugares cimeiros do Idealista — pagamos para que seja visto primeiro</li>
                    <li>Visita virtual 3D disponível — o comprador percorre o imóvel antes de visitar</li>
                    <li>Placa com QR Code — acesso imediato à página do imóvel</li>
                    <li>Agente de IA continua disponível 24/7 para qualquer dúvida</li>
                  </ul>
                </article>
              </div>
            </div>
          </section>

          {/* 8. PRESENÇA INTERNACIONAL */}
          <section className="section section--soft" id="internacional">
            <div className="wrap">
              <div className="section-head section-head--center reveal">
                <span className="eyebrow"><span className="dot" /> Presença Internacional</span>
                <h2>O seu imóvel publicado em 33 países</h2>
                <p className="lead">Portais nomeados e confirmados nos principais mercados compradores de imobiliário português — e mais 27 países através da rede global Properstar.</p>
              </div>

              <div className="intl-banner reveal">
                <div className="intl-banner__item"><b>33</b><span>Países</span></div>
                <div className="intl-banner__item"><b>40+</b><span>Portais</span></div>
                <div className="intl-banner__item"><b>3</b><span>Idiomas nas campanhas</span></div>
                <div className="intl-banner__item"><b>24/7</b><span>Visita virtual</span></div>
              </div>

              <div className="countries">
                {countries.map((c) => (
                  <article key={c.name} className="country reveal">
                    <div className="country__head">{c.flags.map((f) => <span key={f} className="country__flag">{f}</span>)}<span className="country__name">{c.name}</span></div>
                    <ul className="portals">
                      {c.portals.map((p) => <li key={p}>{p}</li>)}
                      {"soon" in c && c.soon && <li className="is-soon">{c.soon}</li>}
                    </ul>
                  </article>
                ))}

                <article className="country country--wide reveal">
                  <div className="country__head"><span className="country__flag">🌍</span><span className="country__name">Mais 27 países via Properstar Global</span></div>
                  <p style={{ fontSize: ".89rem", color: "var(--muted-fg)", margin: 0 }}>Uma única publicação, distribuída automaticamente pelos portais parceiros da rede internacional Properstar.</p>
                  <div className="flags" role="img" aria-label="Bandeiras dos países da rede Properstar Global">
                    {properstarFlags.map(([name, flag]) => <span key={name} title={name}>{flag}</span>)}
                  </div>
                  <div className="premium">
                    <span className="premium__label">Portais Premium Globais</span>
                    <div className="premium__items"><span>Luxury Estate</span><span>Property Portal</span></div>
                  </div>
                </article>
              </div>
            </div>
          </section>

          {/* 9. TECNOLOGIA */}
          <section className="section" id="tecnologia">
            <div className="wrap">
              <div className="section-head reveal">
                <span className="eyebrow"><span className="dot" /> Tecnologia</span>
                <h2>Ferramentas que trabalham por si, 24 horas por dia</h2>
                <p className="lead">Investimos em tecnologia por um motivo simples: vender mais depressa, com menos incómodo para si e com compradores mais bem preparados.</p>
              </div>
              <div className="tech">
                {techCards.map((t) => (
                  <article key={t.title} className="tech__card reveal">
                    {t.badge && <span className="badge-soon">{t.badge}</span>}
                    <div className="tech__icon" aria-hidden="true"><svg viewBox="0 0 24 24">{t.icon}</svg></div>
                    <h3>{t.title}</h3>
                    <p>{t.text}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* 10. AGENTE DE IA 24/7 */}
          <section className="section dark" id="ia-247">
            <div className="wrap">
              <div className="ai247">
                <div className="reveal">
                  <span className="eyebrow"><span className="dot" /> Disponível Sempre</span>
                  <h2>Às 4 da manhã ou às 4 da tarde — nunca perde um cliente</h2>
                  <p className="lead" style={{ marginTop: 18 }}>Nenhum contacto fica sem resposta. Nenhum cliente se perde por falta de disponibilidade. O nosso agente de IA está sempre presente — em qualquer língua, a qualquer hora.</p>
                </div>
                <div className="ai247__cards">
                  {ai247Cards.map((c) => (
                    <article key={c.title} className="ai247__card reveal">
                      <span className="ai247__ico" aria-hidden="true"><svg viewBox="0 0 24 24">{c.icon}</svg></span>
                      <div><h3>{c.title}</h3><p>{c.text}</p></div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* 11. A NOSSA GARANTIA */}
          <section className="section guarantee" id="garantia">
            <div className="wrap guarantee__inner reveal">
              <div className="guarantee__seal" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 2.5 4.5 6v6.2c0 4.6 3.2 7.9 7.5 9.3 4.3-1.4 7.5-4.7 7.5-9.3V6z" /><path d="m8.8 12.2 2.2 2.2 4.3-4.6" /></svg></div>
              <span className="eyebrow"><span className="dot" /> A Nossa Garantia</span>
              <h2>Comprometemo-nos por escrito</h2>
              <p className="guarantee__text">Se algum ponto do plano de marketing acordado não for cumprido, tem o direito de rescindir o contrato de mediação imobiliária. Sem penalizações, sem discussão.</p>
              <p className="guarantee__quote">Não escolha uma agência pela marca que representa, mas pelo serviço que apresenta.</p>
            </div>
          </section>

          {/* 12. QUEM SOMOS */}
          <section className="section" id="quem-somos">
            <div className="wrap">
              <div className="about">
                <div className="reveal">
                  <span className="eyebrow"><span className="dot" /> Quem Somos</span>
                  <h2>Uma equipa local, com exigência internacional</h2>
                  <p className="lead" style={{ marginTop: 18 }}>Desde 2009 na Figueira da Foz, com licença AMI 7968 emitida pelo IMPIC. Conhecemos cada rua, cada zona e cada tipo de comprador que procura esta cidade.</p>
                  <ul className="facts">
                    {facts.map((f) => (
                      <li key={f.title}>
                        <span className="facts__ico" aria-hidden="true"><svg viewBox="0 0 24 24">{f.icon}</svg></span>
                        <div><b>{f.title}</b><p>{"node" in f ? f.node : f.text}</p></div>
                      </li>
                    ))}
                  </ul>
                </div>
                <aside className="about__card reveal">
                  <div className="about__card-inner">
                    <div className="about__avatar">MG</div>
                    <div className="about__name">Miguel Germano</div>
                    <div className="about__role">Fundador · Direção</div>
                    <p className="about__quote">O nosso trabalho não é conseguir a angariação. É conseguir a venda — pelo valor certo, no prazo certo e sem sobressaltos até à escritura.</p>
                    <p>Acompanha pessoalmente a estratégia de cada imóvel e mantém a equipa na vanguarda do setor através de formação e mentorias contínuas em IA, legislação e fiscalidade.</p>
                    <div className="about__stats">
                      <div className="about__stat"><b>2009</b><span>Desde</span></div>
                      <div className="about__stat"><b>7968</b><span>Licença AMI</span></div>
                      <div className="about__stat"><b>+300</b><span>Famílias</span></div>
                      <div className="about__stat"><b>16k</b><span>Seguidores</span></div>
                    </div>
                  </div>
                </aside>
              </div>
            </div>
          </section>

          {/* 13. FORMULÁRIO */}
          <section className="section contact" id="contacto">
            <div className="wrap">
              <div className="contact__grid">
                <div className="reveal">
                  <span className="eyebrow"><span className="dot" /> Fale Connosco</span>
                  <h2>Quer saber quanto vale o seu imóvel?</h2>
                  <p className="lead" style={{ marginTop: 18 }}>Deixe os seus dados e um consultor entra em contacto para agendar uma reunião de análise de expectativas — sem compromisso e sem custo.</p>
                  <ul className="contact__list">
                    {["Estudo de mercado fundamentado do seu imóvel", "Plano de marketing com ações e datas definidas", "Análise da documentação antes de ir a mercado", "Um consultor dedicado do início até à escritura"].map((item) => (
                      <li key={item}><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="m8.8 12.2 2.2 2.2 4.3-4.6" /></svg><span>{item}</span></li>
                    ))}
                  </ul>
                  <div className="contact__direct">
                    <a href="tel:+351233408130"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1.5 1.5 0 0 1-1.7 1.5A16.5 16.5 0 0 1 3.5 5.7 1.5 1.5 0 0 1 5 4z" /></svg>233 408 130</a>
                    <a href="mailto:geral@figueirahome.pt"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="m3.5 7 8.5 6 8.5-6" /></svg>geral@figueirahome.pt</a>
                    <a href="https://wa.me/351928318953" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 11.7a8.5 8.5 0 0 1-12.6 7.5L3.5 20.5l1.4-4.3A8.5 8.5 0 1 1 20.5 11.7z" /><path d="M9 9.2c.3-.7.6-.7.9-.7h.7c.2 0 .5 0 .7.6l.7 1.7c0 .3 0 .5-.2.7l-.4.5c-.2.2-.3.4-.1.7a6 6 0 0 0 2.8 2.4c.3.1.5.1.7-.1l.6-.7c.2-.2.4-.2.6-.1l1.6.8c.3.1.4.3.4.5 0 .8-.6 1.6-1.4 1.8-1.6.4-4-.7-5.6-2.3-1.5-1.6-2.4-3.4-2-4.9z" /></svg>WhatsApp · 928 318 953</a>
                  </div>
                  <p className="contact__custo">233 408 130 — custo de uma chamada para um operador fixo nacional.<br />928 318 953 — custo da chamada para a rede móvel nacional.</p>
                </div>
                <div className="reveal">
                  <ServicosContactForm />
                </div>
              </div>
            </div>
          </section>
        </VideoLightboxProvider>
      </main>

      {/* RODAPÉ */}
      <div className="servicos-page">
      <footer className="footer">
        <div className="wrap">
          <div className="footer__top">
            <div>
              <Link href="#top" aria-label="Figueira Home"><Image className="footer__logo" src="/logo-figueirahome-2026.png" alt="Figueira Home" width={190} height={51} style={{ height: 38, width: "auto" }} /></Link>
              <p>Desde 2009 a acompanhar proprietários da Figueira da Foz na venda do seu imóvel — com estratégia, tecnologia e transparência do primeiro contacto até à escritura.</p>
            </div>
            <div>
              <h4>Contactos</h4>
              <div className="footer__contact">
                <a href="tel:+351233408130">233 408 130</a>
                <a href="mailto:geral@figueirahome.pt">geral@figueirahome.pt</a>
              </div>
              <p className="footer__custo">Custo de uma chamada para um operador fixo nacional.</p>
              <p style={{ marginTop: 14 }}>Ondaveloz — Mediação Imobiliária, Lda.<br />Av. Brasil 48<br />3080-353 Figueira da Foz</p>
            </div>
            <div>
              <h4>Navegação</h4>
              <div className="footer__nav">
                <a href="#processo">O Nosso Processo</a>
                <a href="#divulgacao">Divulgação</a>
                <a href="#resultados">Resultados Reais</a>
                <a href="#fases">Duas Fases</a>
                <a href="#internacional">Presença Internacional</a>
                <a href="#ia-247">Agente de IA 24/7</a>
                <a href="#garantia">A Nossa Garantia</a>
                <a href="#contacto">Falar com um consultor</a>
              </div>
            </div>
          </div>
          <div className="footer__bottom">
            <span>© {new Date().getFullYear()} Figueira Home. Todos os direitos reservados.</span>
            <span className="footer__ami">Licença AMI 7968 · IMPIC</span>
          </div>
        </div>
      </footer>
      </div>
    </>
  );
}
