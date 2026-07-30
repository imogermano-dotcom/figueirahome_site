import Link from "next/link";
import { Mail, MapPin, Phone, Smartphone } from "lucide-react";
import { fixedPhone, mobilePhone, phoneCallCost } from "@/lib/contact-details";

const footerLinks = {
  imoveis: [
    { href: "/imoveis?tipo=Apartamento", label: "Apartamentos" },
    { href: "/imoveis?tipo=Moradia", label: "Moradias" },
    { href: "/imoveis?tipo=Terreno", label: "Terrenos" },
    { href: "/imoveis?tipo=Comercial", label: "Comercial" },
    { href: "/empreendimentos", label: "Empreendimentos" },
    { href: "/imoveis?negocio=arrendar", label: "Arrendar" }
  ],
  empresa: [
    { href: "/quem-somos", label: "Quem Somos" },
    { href: "/quem-somos#equipa", label: "A Nossa Equipa" },
    { href: "/#testemunhos", label: "Testemunhos" },
    { href: "/blog", label: "Blog" },
    { href: "/recrutamento", label: "Recrutamento" },
    { href: "/contacto?pedido=avaliacao", label: "Vender o Meu Im\u00f3vel" }
  ]
} as const;

const socialLinks = [
  { href: "https://www.instagram.com/figueirahome/", label: "Instagram", icon: "instagram" },
  { href: "https://www.facebook.com/FigueiraHome/", label: "Facebook", icon: "facebook" },
  { href: "https://www.youtube.com/@figueirahome", label: "YouTube", icon: "youtube" },
  { href: "https://wa.me/351913702002", label: "WhatsApp", icon: "whatsapp" }
] as const;

export function VideoFooter({ variant = "default" }: { variant?: "default" | "recruitment" }) {
  const isRecruitment = variant === "recruitment";
  const opportunityLinks = [
    { href: "#perfil", label: "Questionário de perfil" },
    { href: "#processo", label: "Como funciona" },
    { href: "#candidatura", label: "Candidatar-me" },
    { href: "/politica-privacidade", label: "Privacidade no recrutamento" },
  ];
  const companyLinks = isRecruitment
    ? [
        { href: "/quem-somos", label: "Quem Somos" },
        { href: "/quem-somos#equipa", label: "A Nossa Equipa" },
        { href: "/#testemunhos", label: "Testemunhos" },
        { href: "/blog", label: "Blog" },
        { href: "/recrutamento", label: "Recrutamento" },
      ]
    : footerLinks.empresa;
  return (
    <div className="relative overflow-hidden bg-[var(--navy)] text-white">
      <video className="absolute inset-0 h-full w-full object-cover opacity-70" autoPlay muted loop playsInline preload="metadata">
        <source src="/Video/hero-web.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-[rgba(5,15,30,0.58)]" />
      <section className="container relative py-16 text-center">
        <h2 className="display-font text-3xl font-extrabold md:text-5xl">{isRecruitment ? "Pronto para perceber se este caminho é para si?" : "Quer vender o seu imóvel ao melhor preço?"}</h2>
        <p className="mx-auto mt-5 max-w-2xl text-white/72">{isRecruitment ? "Comece pelo questionário de perfil. A candidatura demora poucos minutos e a nossa equipa analisa cada passo com atenção." : "Fazemos uma avaliação gratuita e sem compromisso. A nossa equipa coloca o seu imóvel à frente de compradores ativos na região."}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href={isRecruitment ? "#perfil" : "/contacto?pedido=avaliacao"} className="btn btn-gold">{isRecruitment ? "Começar candidatura" : "Pedir Avaliação Gratuita"}</Link>
          <Link href={isRecruitment ? "#processo" : "/contacto"} className="btn btn-outline-light">{isRecruitment ? "Ver o processo" : "Falar com a Equipa"}</Link>
        </div>
      </section>
      <footer className="container relative grid gap-8 border-t border-white/12 py-12 md:grid-cols-4">
        <div>
          <div className="mb-3 inline-flex rounded-sm bg-[var(--gold)] px-3 py-1 text-xs font-extrabold">{"Licen\u00e7a AMI 7968"}</div>
          <div className="display-font text-2xl font-extrabold">Figueira<span className="text-[var(--gold-l)]">Home</span></div>
          <p className="mt-3 text-sm leading-7 text-white/65">{"A sua imobili\u00e1ria de refer\u00eancia na Figueira da Foz. Ondaveloz - Media\u00e7\u00e3o Imobili\u00e1ria Lda, desde 2009."}</p>
          <div className="mt-4 flex gap-2">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                aria-label={`${social.label} da Figueira Home (abre numa nova janela)`}
                className="grid h-10 w-10 place-items-center rounded-full border border-white/25 text-white/85 transition hover:-translate-y-0.5 hover:border-[var(--gold)] hover:bg-[var(--gold)] hover:text-[var(--navy)] focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:ring-offset-2 focus:ring-offset-[var(--navy)]"
              >
                <SocialIcon name={social.icon} />
              </a>
            ))}
          </div>
        </div>
        <FooterCol title={isRecruitment ? "A oportunidade" : "Imóveis"} items={isRecruitment ? opportunityLinks : footerLinks.imoveis} />
        <FooterCol title="A Empresa" items={companyLinks} />
        <div>
          <h3 className="mb-4 font-extrabold">Contacto</h3>
          <div className="grid gap-3 text-sm text-white/70">
            <p className="flex gap-2"><MapPin size={17} /> Av. do Brasil, 48, 3080-323 Buarcos, Figueira da Foz</p>
            <p className="flex gap-2"><Phone className="mt-0.5 shrink-0" size={17} /><span>{fixedPhone}<small className="block text-white/55">{phoneCallCost(fixedPhone)}</small></span></p>
            <p className="flex gap-2"><Smartphone className="mt-0.5 shrink-0" size={17} /><span>{mobilePhone}<small className="block text-white/55">{phoneCallCost(mobilePhone)}</small></span></p>
            <p className="flex gap-2"><Mail size={17} /> geral.figueirahome@gmail.com</p>
          </div>
        </div>
        <div className="border-t border-white/12 pt-6 text-xs text-white/55 md:col-span-4 md:flex md:items-center md:justify-between">
          <span>{"\u00a9 2026 Figueira Home \u00b7 Ondaveloz Media\u00e7\u00e3o Imobili\u00e1ria Lda \u00b7 AMI 7968"}</span>
          <div className="mt-3 flex gap-4 md:mt-0">
            <Link href="/politica-privacidade">{"Pol\u00edtica de Privacidade"}</Link>
            <Link href="/politica-cookies">{"Pol\u00edtica de Cookies"}</Link>
            <Link href="https://www.livroreclamacoes.pt/">{"Livro de Reclama\u00e7\u00f5es"}</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function SocialIcon({ name }: { name: (typeof socialLinks)[number]["icon"] }) {
  const common = { width: 19, height: 19, viewBox: "0 0 24 24", "aria-hidden": true };

  switch (name) {
    case "instagram":
      return <svg {...common} fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>;
    case "facebook":
      return <svg {...common} fill="currentColor"><path d="M13.8 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.6-1.5H17V3.9c-.4-.1-1.3-.2-2.3-.2-2.3 0-3.9 1.4-3.9 4V10H8v3h2.8v8h3Z" /></svg>;
    case "youtube":
      return <svg {...common} fill="currentColor"><path d="M21.6 7.2a3 3 0 0 0-2.1-2.1C17.7 4.6 12 4.6 12 4.6s-5.7 0-7.5.5A3 3 0 0 0 2.4 7.2C2 9 2 12 2 12s0 3 .4 4.8a3 3 0 0 0 2.1 2.1c1.8.5 7.5.5 7.5.5s5.7 0 7.5-.5a3 3 0 0 0 2.1-2.1c.4-1.8.4-4.8.4-4.8s0-3-.4-4.8ZM10 15.5v-7l6 3.5-6 3.5Z" /></svg>;
    case "whatsapp":
      return <svg {...common} fill="currentColor"><path d="M12 2a9.8 9.8 0 0 0-8.4 14.9L2 22l5.3-1.5A9.8 9.8 0 1 0 12 2Zm0 17.8a8 8 0 0 1-4.1-1.1l-.3-.2-3.1.9.9-3-.2-.3A8 8 0 1 1 12 19.8Zm4.4-6c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1l-.7.8c-.1.2-.3.2-.5.1a6.5 6.5 0 0 1-1.9-1.2 7 7 0 0 1-1.3-1.7c-.1-.2 0-.4.1-.5l.4-.5.2-.4a.5.5 0 0 0 0-.5l-.8-1.8c-.2-.4-.4-.3-.5-.3h-.5c-.2 0-.5.1-.7.4-.2.3-.9.9-.9 2.1 0 1.3.9 2.5 1 2.7.1.2 1.8 2.8 4.4 3.9.6.3 1.1.4 1.5.5.6.2 1.2.2 1.6.1.5-.1 1.4-.6 1.6-1.2.2-.6.2-1.1.1-1.2-.1-.1-.2-.2-.5-.3Z" /></svg>;
  }
}

function FooterCol({ title, items }: { title: string; items: ReadonlyArray<{ href: string; label: string }> }) {
  return (
    <div>
      <h3 className="mb-4 font-extrabold">{title}</h3>
      <ul className="grid gap-2 text-sm text-white/65">
        {items.map((item) => <li key={item.label}><Link href={item.href}>{item.label}</Link></li>)}
      </ul>
    </div>
  );
}
