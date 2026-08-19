"use client";

import { useEffect, useState } from "react";
import { Bath, BedDouble, Calendar, Car, MapPin, Ruler, Sun, Zap } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { PropertyGallery } from "@/components/property-gallery";
import { PropertyVideo } from "@/components/property-video";
import { VideoFooter } from "@/components/video-footer";
import { fixedPhone, phoneCallCost } from "@/lib/contact-details";
import { formatArea, formatCurrency, initials } from "@/lib/format";
import { getSupabaseBrowserClient, hasSupabaseEnv } from "@/lib/supabase";
import { figueiraTeam, sampleAgents } from "@/lib/team";
import type { Agent, Property, PropertyImage } from "@/lib/types";

type ImovelDetailRow = {
  imovel_ref: string | null;
  titulo: string | null;
  natureza: string | null;
  disponibilidade: string | null;
  estado: string | null;
  angariador: string | null;
  vendedor: string | null;
  quartos: number | null;
  casas_banho: number | null;
  area_util: number | null;
  area_bruta: number | null;
  area_terreno: number | null;
  venda_preco: number | null;
  arrendamento_preco: number | null;
  concelho: string | null;
  freguesia: string | null;
  zona: string | null;
  descricao: string | null;
  certificacao_energetica: string | null;
  garagem: boolean | null;
  varanda: boolean | null;
  foto_principal: string | null;
  fotos: string[] | string | null;
  plantas: string[] | string | null;
  video_url: string | null;
  visita_virtual_url: string | null;
};

function slugify(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function normalize(value?: string | null) {
  return value?.trim().toLowerCase() || "";
}

function agentFromName(name: string | null, role: string): Agent | null {
  if (!name) return null;
  const teamMember = figueiraTeam.find((member) => [member.name, ...(member.aliases || [])].some((candidate) => normalize(candidate) === normalize(name)));
  const knownAgent = teamMember || sampleAgents.find((agent) => normalize(agent.name) === normalize(name));
  return {
    id: knownAgent?.id || slugify(name),
    name: knownAgent?.name || name,
    role,
    phone: knownAgent?.phone || null,
    email: knownAgent?.email || null,
    photo_url: knownAgent?.photo_url || null
  };
}

function urls(value: string[] | string | null) {
  if (Array.isArray(value)) return value.filter((item): item is string => typeof item === "string" && Boolean(item.trim()));
  return value?.trim() ? [value] : [];
}

function images(values: string[], title: string, label: "imagem" | "planta"): PropertyImage[] {
  return Array.from(new Set(values)).map((url, index) => ({ url, alt: `${title} - ${label} ${index + 1}`, sort_order: index + 1, is_primary: index === 0 }));
}

function mapProperty(row: ImovelDetailRow): Property | null {
  const id = row.imovel_ref?.trim();
  if (!id) return null;
  const salePrice = Number(row.venda_preco || 0);
  const rentalPrice = Number(row.arrendamento_preco || 0);
  const business = rentalPrice > 0 && !salePrice ? "arrendar" : "comprar";
  const price = business === "arrendar" ? rentalPrice : salePrice || rentalPrice;
  if (!price) return null;

  const location = [row.zona, row.freguesia, row.concelho].filter(Boolean).join(" - ") || "Figueira da Foz";
  const type = row.natureza || "Imóvel";
  const title = row.titulo?.trim() || `${type} em ${location}`;
  const area = [row.area_util, row.area_bruta, row.area_terreno].map((value) => Number(value || 0)).find((value) => value > 0) || null;
  const agent = agentFromName(row.angariador || row.vendedor, row.angariador ? "Angariador" : "Consultor");

  return {
    id, slug: slugify(id), title, description: row.descricao?.trim() || "", business, type, location, price,
    bedrooms: row.quartos, bathrooms: row.casas_banho, area_sqm: area, status: row.disponibilidade || row.estado || "Disponível",
    energy_certificate: row.certificacao_energetica?.trim() || null,
    has_garage: Boolean(row.garagem), has_balcony: Boolean(row.varanda),
    featured: false, published: true, agent_id: agent?.id || null, agent, created_at: "", updated_at: "",
    video_url: row.video_url?.trim() || null, visita_virtual_url: row.visita_virtual_url?.trim() || null,
    images: images([row.foto_principal, ...urls(row.fotos)].filter((url): url is string => Boolean(url?.trim())), title, "imagem"),
    floor_plans: images(urls(row.plantas), title, "planta")
  };
}

export function PropertyDetailBrowserFallback({ slug, reference }: { slug: string; reference?: string }) {
  const [property, setProperty] = useState<Property | null>(null);
  const [state, setState] = useState<"loading" | "missing">(() => hasSupabaseEnv() ? "loading" : "missing");

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    let cancelled = false;
    const fields = "imovel_ref,titulo,natureza,disponibilidade,estado,angariador,vendedor,quartos,casas_banho,area_util,area_bruta,area_terreno,venda_preco,arrendamento_preco,concelho,freguesia,zona,descricao,certificacao_energetica,garagem,varanda,foto_principal,fotos,plantas,video_url,visita_virtual_url";
    const request = reference
      ? supabase.from("imoveis").select(fields).eq("imovel_ref", reference).eq("publicado", true).eq("disponibilidade", "Disponível").maybeSingle()
      : supabase.from("imoveis").select(fields).eq("publicado", true).eq("disponibilidade", "Disponível").limit(500);

    void request.then(({ data, error }) => {
      if (cancelled) return;
      const row = Array.isArray(data) ? data.find((item) => slugify(String(item.imovel_ref || "")) === slug) : data;
      const mapped = !error && row ? mapProperty(row as ImovelDetailRow) : null;
      setProperty(mapped);
      setState(mapped ? "loading" : "missing");
    });

    return () => { cancelled = true; };
  }, [reference, slug]);

  if (!property) return <main className="container pt-32 pb-20"><h1 className="section-title">{state === "loading" ? "A carregar imóvel…" : "Imóvel não encontrado"}</h1><p className="mt-4 text-[var(--muted)]">{state === "loading" ? "A obter os detalhes do imóvel." : "O conteúdo pedido não existe ou deixou de estar publicado."}</p></main>;

  const mapEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(property.location)}&output=embed`;
  return <><main className="pt-28"><section className="container"><PropertyGallery images={property.images || []} title={property.title} /><div className="mt-8 grid gap-10 lg:grid-cols-[1fr_380px]"><article><p className="text-sm font-extrabold uppercase tracking-[1.5px] text-[var(--gold)]">{property.type}</p><h1 className="section-title mt-2">{property.title}</h1><p className="mt-3 text-sm font-bold text-[var(--muted)]">Referência: <span className="text-[var(--text)]">{property.id}</span></p><p className="mt-3 flex items-center gap-2 text-[var(--muted)]"><MapPin size={18} />{property.location}</p><div className="display-font mt-6 text-3xl font-extrabold text-[var(--blue)]">{formatCurrency(property.price)}</div><div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><Info icon={<BedDouble size={20} />} label="Quartos" value={String(property.bedrooms ?? "-")} /><Info icon={<Bath size={20} />} label="WC" value={String(property.bathrooms ?? "-")} /><Info icon={<Ruler size={20} />} label="Área" value={formatArea(property.area_sqm)} /><Info icon={<Calendar size={20} />} label="Estado" value={property.status} />{property.energy_certificate && <Info icon={<Zap size={20} />} label="Certificado energético" value={property.energy_certificate} />}{property.has_garage && <Info icon={<Car size={20} />} label="Garagem" value="Sim" />}{property.has_balcony && <Info icon={<Sun size={20} />} label="Varanda" value="Sim" />}</div><h2 className="mt-10 text-2xl font-extrabold">Descrição</h2><p className="mt-4 whitespace-pre-line leading-8 text-[var(--muted)]">{property.description}</p>{property.floor_plans?.length ? <section className="mt-10 border-l-4 border-[var(--gold)] pl-5"><p className="text-sm font-extrabold uppercase tracking-[1.5px] text-[var(--gold)]">Documentação do imóvel</p><h2 className="mt-2 text-2xl font-extrabold">Plantas do imóvel</h2><div className="mt-5"><PropertyGallery images={property.floor_plans} title={property.title} contentLabel="planta" /></div></section> : null}{property.video_url ? <section className="mt-10"><h2 className="text-2xl font-extrabold">Vídeo do imóvel</h2><div className="mt-4 overflow-hidden rounded-md border border-[var(--border)] bg-[var(--navy)]"><PropertyVideo url={property.video_url} title={property.title} /></div></section> : null}{property.visita_virtual_url ? <section className="mt-10"><h2 className="text-2xl font-extrabold">Visita virtual</h2><div className="mt-4 overflow-hidden rounded-md border border-[var(--border)] bg-[var(--navy)]"><PropertyVideo url={property.visita_virtual_url} title={`Visita virtual: ${property.title}`} /></div></section> : null}<h2 className="mt-10 text-2xl font-extrabold">Localização aproximada</h2><iframe title={`Mapa aproximado de ${property.location}`} src={mapEmbedUrl} className="mt-4 block h-[320px] w-full rounded-md border border-[var(--border)] sm:h-[380px]" loading="lazy" /></article><aside className="grid h-fit gap-6"><div className="rounded-md border border-[var(--border)] p-6"><h2 className="mb-4 text-xl font-extrabold">Contactar sobre este imóvel</h2><ContactForm source="property_detail" propertyId={property.id} /></div>{property.agent && <div className="rounded-md border border-[var(--border)] p-6"><h2 className="mb-4 text-xl font-extrabold">Agente responsável</h2><div className="flex items-center gap-4"><div className="grid h-16 w-16 place-items-center rounded-full bg-[var(--navy)] font-extrabold text-white">{initials(property.agent.name)}</div><div><div className="font-extrabold">{property.agent.name}</div><div className="text-sm text-[var(--muted)]">{property.agent.role}</div>{property.agent.phone ? <div className="mt-1 text-sm font-bold text-[var(--blue)]">{property.agent.phone}<span className="mt-1 block text-xs font-medium text-[var(--muted)]">{phoneCallCost(property.agent.phone)}</span></div> : <div className="mt-3 text-sm"><span className="block font-bold text-[var(--text)]">Contacto Figueira Home</span><span className="font-bold text-[var(--blue)]">{fixedPhone}</span><span className="mt-1 block text-xs text-[var(--muted)]">{phoneCallCost(fixedPhone)}</span></div>}</div></div></div>}</aside></div></section></main><VideoFooter /></>;
}

function Info({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return <div className="rounded-md border border-[var(--border)] p-4">{icon}<div className="mt-2 text-xs font-extrabold uppercase text-[var(--muted)]">{label}</div><div className="font-extrabold">{value}</div></div>;
}
