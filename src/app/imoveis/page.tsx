import type { Metadata } from "next";
import type { PropertyFilters } from "@/lib/types";
import { QuickSearch } from "@/components/quick-search";
import { VideoFooter } from "@/components/video-footer";
import { PropertyCard } from "@/components/property-card";
import { getProperties } from "@/lib/properties";

export const metadata: Metadata = {
  title: "Imóveis",
  description: "Imóveis publicados da Figueira Home na Figueira da Foz, com filtros por negócio, tipo, localização, preço, quartos e área em m².",
  alternates: { canonical: "/imoveis" }
};

export default async function PropertiesPage({ searchParams }: { searchParams: Promise<PropertyFilters> }) {
  const filters = await searchParams;
  // Lista renderizada no servidor: antes era carregada no browser depois da hidratação
  // (CLS 0,32 e LCP 2,2s no GTmetrix, 2026-10-08) e o HTML chegava sem imóveis.
  const properties = await getProperties(filters);
  return (
    <>
      <main className="bg-[var(--offwhite)] pt-28">
        <section className="container pb-10">
          <h1 className="section-title font-body-heading">Imóveis</h1>
          <p className="mt-3 max-w-2xl leading-7 text-[var(--muted)]">Lista dinâmica de imóveis publicados. Imóveis não publicados nunca aparecem nesta página.</p>
          <div className="mt-8 rounded-md border border-[var(--border)] bg-white p-5"><QuickSearch compact /></div>
        </section>
        <section className="container pb-16">
          <div className="mb-5 text-sm font-bold text-[var(--muted)]">{properties.length} resultado(s)</div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {properties.map((property, index) => <PropertyCard key={property.id} property={property} priority={index < 3} />)}
          </div>
          {properties.length === 0 && <div className="rounded-md border border-[var(--border)] bg-white p-8 text-[var(--muted)]">Não existem imóveis publicados para os filtros selecionados.</div>}
        </section>
      </main>
      <VideoFooter />
    </>
  );
}
