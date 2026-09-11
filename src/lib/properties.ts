import { cache } from "react";
import { unstable_noStore as noStore } from "next/cache";
import { getSupabasePublicServerClient, getSupabaseServiceClient } from "./supabase";
import { sampleAgents, sampleProperties } from "./sample-data";
import { figueiraTeam } from "./team";
import { sendLeadToEgo } from "./ego";
import type { Agent, LeadInput, Property, PropertyFilters, PropertyImage } from "./types";

let lastSuccessfulProperties: Property[] | null = null;

type ImovelRow = {
  imovel_ref: string | null;
  publicado: boolean | null;
  natureza: string | null;
  disponibilidade: string | null;
  estado: string | null;
  angariador: string | null;
  vendedor: string | null;
  titulo: string | null;
  quartos: number | null;
  area_util: number | null;
  area_bruta: number | null;
  area_terreno: number | null;
  venda_preco: number | null;
  arrendamento_preco: number | null;
  concelho: string | null;
  freguesia: string | null;
  zona: string | null;
  data_criacao: string | null;
  data_alteracao: string | null;
  descricao: string | null;
  casas_banho: number | null;
  certificacao_energetica: string | null;
  garagem: boolean | null;
  varanda: boolean | null;
  foto_principal: string | null;
  fotos: string[] | null;
  plantas: string[] | string | null;
  video_url: string | null;
  visita_virtual_url: string | null;
  destaque: boolean | null;
};

function normalize(value?: string | null) {
  return value?.trim().toLowerCase() || "";
}

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function locationFromImovel(row: ImovelRow) {
  return [row.zona, row.freguesia, row.concelho].filter(Boolean).join(" - ") || "Figueira da Foz";
}

function mapLocationFromImovel(row: ImovelRow) {
  return [row.zona, row.freguesia, row.concelho].filter(Boolean).join(", ") || null;
}

function businessFromImovel(row: ImovelRow): Property["business"] {
  if ((Number(row.arrendamento_preco) || 0) > 0 && !(Number(row.venda_preco) || 0)) return "arrendar";
  return "comprar";
}

function priceFromImovel(row: ImovelRow) {
  return businessFromImovel(row) === "arrendar"
    ? Number(row.arrendamento_preco || 0)
    : Number(row.venda_preco || row.arrendamento_preco || 0);
}

function typeFromImovel(row: ImovelRow) {
  const natureza = row.natureza || "Imóvel";
  if (row.quartos && /apartamento|moradia|andar/i.test(natureza)) return `${natureza} T${row.quartos}`;
  return natureza;
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

function urlsFromColumn(value: string[] | string | null | undefined) {
  if (Array.isArray(value)) return value.filter((url): url is string => typeof url === "string" && Boolean(url.trim()));
  return value?.trim() ? [value] : [];
}

function imageItemsFromUrls(urls: string[], title: string, label: "imagem" | "planta"): PropertyImage[] {
  return Array.from(new Set(urls)).map((url, index) => ({
    url,
    alt: `${title} - ${label} ${index + 1}`,
    sort_order: index + 1,
    is_primary: index === 0
  }));
}

function imagesFromImovel(row: ImovelRow, title: string) {
  return imageItemsFromUrls([row.foto_principal, ...urlsFromColumn(row.fotos)].filter((url): url is string => Boolean(url?.trim())), title, "imagem");
}

function floorPlansFromImovel(row: ImovelRow, title: string) {
  return imageItemsFromUrls(urlsFromColumn(row.plantas), title, "planta");
}

function areaFromImovel(row: ImovelRow) {
  const area = [row.area_util, row.area_bruta, row.area_terreno]
    .map((value) => Number(value || 0))
    .find((value) => value > 0);

  return area || null;
}

function energyCertificateFromImovel(row: ImovelRow) {
  return row.certificacao_energetica?.trim() || null;
}

function mapImovel(row: ImovelRow): Property | null {
  const ref = row.imovel_ref?.trim();
  if (!ref) return null;
  const price = priceFromImovel(row);
  const published = row.publicado === true && row.disponibilidade === "Disponível" && price > 0;
  const type = typeFromImovel(row);
  const location = locationFromImovel(row);
  const title = row.titulo?.trim() || `${type} em ${location}`;
  const description = row.descricao?.trim() || `${type} localizado em ${location}.`;
  const createdAt = row.data_criacao || new Date().toISOString();
  const updatedAt = row.data_alteracao || createdAt;
  const agent = agentFromName(row.angariador || row.vendedor, row.angariador ? "Angariador" : "Consultor");

  return {
    id: ref,
    slug: slugify(ref),
    title,
    description,
    business: businessFromImovel(row),
    type,
    location,
    price,
    bedrooms: row.quartos,
    bathrooms: row.casas_banho,
    area_sqm: areaFromImovel(row),
    energy_certificate: energyCertificateFromImovel(row),
    has_garage: Boolean(row.garagem),
    has_balcony: Boolean(row.varanda),
    map_location: mapLocationFromImovel(row),
    video_url: row.video_url?.trim() || null,
    visita_virtual_url: row.visita_virtual_url?.trim() || null,
    status: row.disponibilidade || row.estado || "Disponível",
    featured: Boolean(row.destaque),
    published,
    agent_id: agent?.id || null,
    created_at: createdAt,
    updated_at: updatedAt,
    agent,
    images: imagesFromImovel(row, title),
    floor_plans: floorPlansFromImovel(row, title)
  };
}

function mapImoveis(rows: ImovelRow[]) {
  return rows.map(mapImovel).filter((property): property is Property => Boolean(property));
}

function applyFilters(properties: Property[], filters: PropertyFilters) {
  let rows = properties.filter((property) => property.published);
  const referencia = normalize(filters.referencia);
  const negocio = normalize(filters.negocio);
  const tipo = normalize(filters.tipo);
  const localizacao = normalize(filters.localizacao);
  const precoMax = Number(filters.preco_max || 0);
  const quartosMin = Number(filters.quartos_min || 0);
  const areaMin = Number(filters.area_min || 0);

  if (referencia) rows = rows.filter((property) => normalize(property.id).includes(referencia));
  if (negocio) rows = rows.filter((property) => property.business === negocio);
  if (tipo) rows = rows.filter((property) => normalize(property.type).includes(tipo));
  if (localizacao) rows = rows.filter((property) => normalize(property.location).includes(localizacao));
  if (precoMax) rows = rows.filter((property) => property.price <= precoMax);
  if (quartosMin) rows = rows.filter((property) => (property.bedrooms || 0) >= quartosMin);
  if (areaMin) rows = rows.filter((property) => (property.area_sqm || 0) >= areaMin);

  switch (filters.ordem) {
    case "preco_asc":
      rows = rows.sort((a, b) => a.price - b.price);
      break;
    case "preco_desc":
      rows = rows.sort((a, b) => b.price - a.price);
      break;
    case "area_desc":
      rows = rows.sort((a, b) => (b.area_sqm || 0) - (a.area_sqm || 0));
      break;
    default:
      rows = rows.sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at));
  }

  return rows;
}

function featuredOrNewest(properties: Property[], limit: number) {
  const published = properties
    .filter((property) => property.published)
    .sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at));
  const featured = published.filter((property) => property.featured);
  const newest = published.filter((property) => !property.featured);
  return [...featured, ...newest].slice(0, limit);
}

async function getPublishedProperties() {
  const supabase = getSupabaseServiceClient();
  if (!supabase) return sampleProperties;

  const query = (client = supabase) => client
    .from("imoveis")
    .select("*")
    .eq("publicado", true)
    .eq("disponibilidade", "Disponível")
    .order("data_criacao", { ascending: false })
    .limit(500);

  let result = await query();
  if (result.error) result = await query();
  if (result.error) {
    const publicClient = getSupabasePublicServerClient();
    if (publicClient) result = await query(publicClient);
  }

  if (result.error) {
    console.error(result.error);
    return lastSuccessfulProperties || sampleProperties;
  }

  const properties = mapImoveis((result.data || []) as ImovelRow[]);
  lastSuccessfulProperties = properties;
  return properties;
}

export async function getProperties(filters: PropertyFilters = {}) {
  noStore();
  return applyFilters(await getPublishedProperties(), filters);
}

export async function getFeaturedProperties(limit = 3) {
  noStore();
  return featuredOrNewest(await getPublishedProperties(), limit);
}

export const getPropertyBySlug = cache(async (slug: string, reference?: string) => {
  noStore();
  const requestedReference = reference?.trim();
  const supabase = getSupabaseServiceClient();

  if (requestedReference && supabase) {
    let result = await supabase
      .from("imoveis")
      .select("*")
      .eq("imovel_ref", requestedReference)
      .eq("publicado", true)
      .eq("disponibilidade", "Disponível")
      .maybeSingle();

    if (result.error || !result.data) {
      const publicClient = getSupabasePublicServerClient();
      if (publicClient) {
        result = await publicClient
          .from("imoveis")
          .select("*")
          .eq("imovel_ref", requestedReference)
          .eq("publicado", true)
          .eq("disponibilidade", "Disponível")
          .maybeSingle();
      }
    }

    if (!result.error && result.data) {
      const property = mapImovel(result.data as ImovelRow);
      if (property) return property;
    }
  }

  const property = (await getPublishedProperties()).find((item) => item.slug === slug)
    || sampleProperties.find((item) => item.slug === slug && item.published)
    || null;
  return property;
});

export async function getAgents() {
  noStore();
  const supabase = getSupabaseServiceClient();
  if (!supabase) return sampleAgents;
  const { data, error } = await supabase
    .from("imoveis")
    .select("angariador,vendedor")
    .not("angariador", "is", null)
    .limit(200);
  if (error) return sampleAgents;
  const agents = Array.from(new Set((data || []).flatMap((row) => [row.angariador, row.vendedor]).filter(Boolean)))
    .slice(0, 4)
    .map((name) => agentFromName(String(name), "Consultor"))
    .filter((agent): agent is Agent => Boolean(agent));
  return agents.length ? agents : sampleAgents;
}

export async function createLead(input: LeadInput) {
  const supabase = getSupabaseServiceClient();
  if (!supabase) {
    console.info("Lead fallback", input);
    return { ok: true, id: "local-fallback" };
  }
  const { data, error } = await supabase
    .from("contactos")
    .insert({
      nome: input.name,
      email: input.email || null,
      telemovel: input.phone || null,
      tipos: [input.request_type, input.source],
      mensagem: input.property_id ? `[Imóvel ${input.property_id}]\n${input.message}` : input.message,
      criado_em: new Date().toISOString().slice(0, 10)
    })
    .select("nome")
    .single();
  if (error) throw error;

  if (input.property_id) {
    const { data: imovel } = await supabase
      .from("imoveis")
      .select("ego_id,publicado")
      .eq("imovel_ref", input.property_id)
      .maybeSingle();
    if (imovel?.publicado && imovel.ego_id) {
      const egoResult = await sendLeadToEgo({
        egoId: imovel.ego_id,
        name: input.name,
        email: input.email,
        phone: input.phone,
        message: input.message
      });
      if (egoResult.status === "erro") console.error("eGO lead sync falhou", egoResult.error);
    }
  }

  return { ok: true, id: data.nome as string };
}
