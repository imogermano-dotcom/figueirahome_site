import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Building2, Mail, MessageCircle, Phone } from "lucide-react";
import { notFound } from "next/navigation";
import { PropertyCard } from "@/components/property-card";
import { VideoFooter } from "@/components/video-footer";
import { phoneCallCost } from "@/lib/contact-details";
import { getProperties } from "@/lib/properties";
import { figueiraTeam } from "@/lib/team";

function getMember(slug: string) {
  return figueiraTeam.find((member) => member.id === slug) || null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const member = getMember(slug);
  if (!member) return { title: "Consultor não encontrado" };

  return {
    title: member.name,
    description: `${member.name} — ${member.role} na Figueira Home, imobiliária na Figueira da Foz.`,
    alternates: { canonical: `/consultores/${slug}` }
  };
}

export default async function ConsultantPage({ params }: { params: Promise<{ slug: string }> }) {
  const member = getMember((await params).slug);
  if (!member) notFound();

  const properties = (await getProperties()).filter((property) => property.agent?.id === member.id || property.agent_id === member.id);
  const directContact = member.phone ? `tel:${member.phone.replace(/\s/g, "")}` : member.email ? `mailto:${member.email}` : "/contacto";
  const contactLabel = member.phone ? `Ligar a ${member.name}` : member.email ? `Enviar email a ${member.name}` : "Falar com a Figueira Home";
  const whatsappLink = member.phone ? `https://wa.me/${member.phone.replace(/[^0-9]/g, "")}` : null;
  const propertiesHeading = properties.length === 1 ? "1 imóvel atualmente disponível." : `${properties.length} imóveis atualmente disponíveis.`;
  const profileBio = member.profile_bio || [member.bio];

  return (
    <>
      <main className="bg-[var(--offwhite)] pt-28">
        <section className="container pb-14 md:pb-20">
          <Link href="/quem-somos#equipa" className="inline-flex items-center gap-2 text-sm font-extrabold text-[var(--blue)] hover:text-[var(--navy)]"><ArrowLeft size={17} /> Equipa Figueira Home</Link>
          <div className="mt-8 overflow-hidden rounded-md border border-[var(--border)] bg-white lg:grid lg:grid-cols-[minmax(300px,0.72fr)_1.28fr]">
            <div className="relative min-h-[340px] bg-[var(--navy)] sm:min-h-[420px]">
              <Image src={member.photo_url} alt={`Retrato de ${member.name}`} fill priority sizes="(min-width: 1024px) 38vw, 100vw" className="object-contain p-8" />
            </div>
            <div className="p-8 sm:p-12">
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[var(--blue)]">Equipa Figueira Home</p>
              <h1 className="section-title mt-4">{member.name}</h1>
              <p className="mt-3 text-lg font-extrabold text-[var(--gold)]" translate="no">{member.role}</p>
              <div className="mt-7 max-w-2xl space-y-5 text-[1.05rem] leading-8 text-[var(--muted)]">{profileBio.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link href={directContact} className="btn btn-primary">{contactLabel} <ArrowUpRight size={16} /></Link>
                {whatsappLink && <a href={whatsappLink} target="_blank" rel="noopener" className="btn btn-outline-dark btn-whatsapp"><MessageCircle size={16} /> WhatsApp</a>}
                <Link href="#imoveis" className="btn btn-outline-dark">Ver imóveis associados</Link>
              </div>
              {(member.phone || member.email) && <div className="mt-9 grid gap-3 border-t border-[var(--border)] pt-6 text-sm text-[var(--muted)] sm:grid-cols-2">
                {member.phone && <a href={`tel:${member.phone.replace(/\s/g, "")}`} className="inline-flex items-start gap-3 hover:text-[var(--blue)]"><Phone className="mt-0.5 text-[var(--gold)]" size={18} /><span><strong className="block text-[var(--text)]">{member.phone}</strong><span>{phoneCallCost(member.phone)}</span></span></a>}
                {member.email && <a href={`mailto:${member.email}`} className="inline-flex items-start gap-3 hover:text-[var(--blue)]"><Mail className="mt-0.5 text-[var(--gold)]" size={18} /><span><strong className="block text-[var(--text)]">{member.email}</strong><span>Email</span></span></a>}
              </div>}
            </div>
          </div>
        </section>

        <section id="imoveis" className="border-t border-[var(--border)] bg-white py-16 md:py-20">
          <div className="container">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[var(--blue)]">Imóveis associados</p>
                <h2 className="section-title mt-4">{properties.length ? propertiesHeading : "Sem imóveis disponíveis neste momento."}</h2>
              </div>
              {properties.length > 0 && <Link href="/imoveis" className="inline-flex items-center gap-2 font-extrabold text-[var(--blue)] hover:text-[var(--navy)]">Ver todos os imóveis <ArrowUpRight size={18} /></Link>}
            </div>
            {properties.length > 0 ? <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{properties.map((property) => <PropertyCard key={property.id} property={property} />)}</div> : <div className="mt-10 flex max-w-2xl items-start gap-4 rounded-md border border-[var(--border)] bg-[var(--offwhite)] p-6 text-[var(--muted)]"><Building2 className="mt-0.5 shrink-0 text-[var(--gold)]" size={22} /><p>Os imóveis publicados atribuídos a este elemento da equipa aparecerão aqui automaticamente.</p></div>}
          </div>
        </section>
      </main>
      <VideoFooter />
    </>
  );
}
