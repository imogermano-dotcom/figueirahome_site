import type { Metadata } from "next";
import { getProperties } from "@/lib/properties";
import type { PropertyFilters } from "@/lib/types";
import { PropertyCard } from "@/components/property-card";
import { QuickSearch } from "@/components/quick-search";
import { VideoFooter } from "@/components/video-footer";

export const metadata: Metadata = {
  title: "Imóveis",
  description: "Imóveis publicados da Figueira Home na Figueira da Foz, com filtros por negócio, tipo, localização, preço, quartos e área em m²."
};

export default async function PropertiesPage({ searchParams }: { searchParams: Promise<PropertyFilters> }) {
  const filters = await searchParams;
  const properties = await getProperties(filters);
  return (
    <>
      <main className="bg-[var(--offwhite)] pt-28">
        <section className="container pb-10">
          <h1 className="section-title">Imóveis</h1>
          <p className="mt-3 max-w-2xl leading-7 text-[var(--muted)]">Lista dinâmica de imóveis publicados. Imóveis não publicados nunca aparecem nesta página.</p>
          <div className="mt-8 rounded-md border border-[var(--border)] bg-white p-5"><QuickSearch compact /></div>
        </section>
        <section className="container pb-16">
          <div className="mb-5 text-sm font-bold text-[var(--muted)]">{properties.length} resultado(s)</div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => <PropertyCard key={property.id} property={property} />)}
          </div>
          {properties.length === 0 && <div className="rounded-md border border-[var(--border)] bg-white p-8 text-[var(--muted)]">Não existem imóveis publicados para os filtros selecionados.</div>}
        </section>
      </main>
      <VideoFooter />
    </>
  );
}
