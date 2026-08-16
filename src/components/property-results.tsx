"use client";

import { useEffect, useMemo, useState } from "react";
import { PropertyCard } from "@/components/property-card";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import type { Property, PropertyFilters, PropertyImage } from "@/lib/types";

type ImovelCardRow = {
  imovel_ref: string | null;
  titulo: string | null;
  natureza: string | null;
  disponibilidade: string | null;
  estado: string | null;
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
  casas_banho: number | null;
  garagem: boolean | null;
  varanda: boolean | null;
  foto_principal: string | null;
  destaque: boolean | null;
};

function normalize(value?: string | null) {
  return value?.trim().toLowerCase() || "";
}

function slugify(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function mapProperty(row: ImovelCardRow): Property | null {
  const id = row.imovel_ref?.trim();
  if (!id) return null;
  const salePrice = Number(row.venda_preco || 0);
  const rentalPrice = Number(row.arrendamento_preco || 0);
  const business = rentalPrice > 0 && !salePrice ? "arrendar" : "comprar";
  const price = business === "arrendar" ? rentalPrice : salePrice || rentalPrice;
  if (!price) return null;

  const type = row.natureza || "Imóvel";
  const typeWithBedrooms = row.quartos && /apartamento|moradia|andar/i.test(type) ? `${type} T${row.quartos}` : type;
  const location = [row.zona, row.freguesia, row.concelho].filter(Boolean).join(" - ") || "Figueira da Foz";
  const title = row.titulo?.trim() || `${typeWithBedrooms} em ${location}`;
  const area = [row.area_util, row.area_bruta, row.area_terreno].map((value) => Number(value || 0)).find((value) => value > 0) || null;
  const images: PropertyImage[] = row.foto_principal?.trim() ? [{ url: row.foto_principal, alt: title, sort_order: 1, is_primary: true }] : [];
  const createdAt = row.data_criacao || new Date().toISOString();

  return {
    id,
    slug: slugify(id),
    title,
    description: "",
    business,
    type: typeWithBedrooms,
    location,
    price,
    bedrooms: row.quartos,
    bathrooms: row.casas_banho,
    area_sqm: area,
    has_garage: Boolean(row.garagem),
    has_balcony: Boolean(row.varanda),
    status: row.disponibilidade || row.estado || "Disponível",
    featured: Boolean(row.destaque),
    published: true,
    agent_id: null,
    created_at: createdAt,
    updated_at: row.data_alteracao || createdAt,
    images
  };
}

function applyFilters(properties: Property[], filters: PropertyFilters) {
  let rows = [...properties];
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

  return rows.sort((a, b) => {
    if (filters.ordem === "preco_asc") return a.price - b.price;
    if (filters.ordem === "preco_desc") return b.price - a.price;
    if (filters.ordem === "area_desc") return (b.area_sqm || 0) - (a.area_sqm || 0);
    return Date.parse(b.created_at) - Date.parse(a.created_at);
  });
}

export function PropertyResults({ filters }: { filters: PropertyFilters }) {
  const [properties, setProperties] = useState<Property[] | null>(null);
  const [error, setError] = useState(false);
  const filteredProperties = useMemo(() => properties ? applyFilters(properties, filters) : [], [properties, filters]);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setError(true);
      return;
    }

    let cancelled = false;
    void supabase
      .from("imoveis")
      .select("imovel_ref,titulo,natureza,disponibilidade,estado,quartos,area_util,area_bruta,area_terreno,venda_preco,arrendamento_preco,concelho,freguesia,zona,data_criacao,data_alteracao,casas_banho,garagem,varanda,foto_principal,destaque")
      .eq("publicado", true)
      .eq("disponibilidade", "Disponível")
      .order("data_criacao", { ascending: false })
      .limit(500)
      .then(({ data, error: queryError }) => {
        if (cancelled) return;
        if (queryError) {
          setError(true);
          return;
        }
        setProperties((data || []).flatMap((row: ImovelCardRow) => {
          const property = mapProperty(row);
          return property ? [property] : [];
        }));
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (error) return <div className="rounded-md border border-[var(--border)] bg-white p-8 text-[var(--muted)]">Não foi possível carregar os imóveis neste momento. Por favor, tente novamente.</div>;
  if (!properties) return <div className="rounded-md border border-[var(--border)] bg-white p-8 text-[var(--muted)]">A carregar imóveis…</div>;

  return (
    <>
      <div className="mb-5 text-sm font-bold text-[var(--muted)]">{filteredProperties.length} resultado(s)</div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProperties.map((property) => <PropertyCard key={property.id} property={property} />)}
      </div>
      {filteredProperties.length === 0 && <div className="rounded-md border border-[var(--border)] bg-white p-8 text-[var(--muted)]">Não existem imóveis publicados para os filtros selecionados.</div>}
    </>
  );
}
