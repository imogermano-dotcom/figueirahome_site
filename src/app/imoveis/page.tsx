import type { Metadata } from "next";
import type { PropertyFilters } from "@/lib/types";
import { QuickSearch } from "@/components/quick-search";
import { VideoFooter } from "@/components/video-footer";
import { PropertyResults } from "@/components/property-results";

export const metadata: Metadata = {
  title: "Imóveis",
  description: "Imóveis publicados da Figueira Home na Figueira da Foz, com filtros por negócio, tipo, localização, preço, quartos e área em m²."
};

export default async function PropertiesPage({ searchParams }: { searchParams: Promise<PropertyFilters> }) {
  const filters = await searchParams;
  return (
    <>
      <main className="bg-[var(--offwhite)] pt-28">
        <section className="container pb-10">
          <h1 className="section-title font-body-heading">Imóveis</h1>
          <p className="mt-3 max-w-2xl leading-7 text-[var(--muted)]">Lista dinâmica de imóveis publicados. Imóveis não publicados nunca aparecem nesta página.</p>
          <div className="mt-8 rounded-md border border-[var(--border)] bg-white p-5"><QuickSearch compact /></div>
        </section>
        <section className="container pb-16">
          <PropertyResults filters={filters} />
        </section>
      </main>
      <VideoFooter />
    </>
  );
}
