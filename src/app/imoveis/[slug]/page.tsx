import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Bath, BedDouble, Calendar, MapPin, Ruler } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { PropertyCard } from "@/components/property-card";
import { VideoFooter } from "@/components/video-footer";
import { formatArea, formatCurrency, initials } from "@/lib/format";
import { getProperties, getPropertyBySlug } from "@/lib/properties";
import { getPrimaryPropertyImage } from "@/lib/property-images";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) return { title: "Imóvel não encontrado" };

  const summary = [property.type, `em ${property.location}`, property.area_sqm ? formatArea(property.area_sqm) : null, formatCurrency(property.price)]
    .filter(Boolean)
    .join(", ");

  return {
    title: property.title,
    description: `${summary}.`
  };
}

export default async function PropertyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) notFound();

  const similar = (await getProperties({ tipo: property.type.split(" ")[0] }))
    .filter((item) => item.id !== property.id)
    .slice(0, 3);
  const primaryImage = getPrimaryPropertyImage(property);

  return (
    <>
      <main className="pt-28">
        <section className="container">
          <div className="property-detail-media relative h-[420px] overflow-hidden rounded-md">
            {primaryImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img className="h-full w-full object-cover" src={primaryImage.url} alt={primaryImage.alt || property.title} />
            ) : (
              <div className="property-fallback h-full w-full">
                <div className="property-fallback-content property-fallback-content-large">
                  <span>{property.type}</span>
                  <strong>{property.location}</strong>
                </div>
              </div>
            )}
          </div>
          <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_380px]">
            <article>
              <p className="text-sm font-extrabold uppercase tracking-[1.5px] text-[var(--gold)]">{property.type}</p>
              <h1 className="section-title mt-2">{property.title}</h1>
              <p className="mt-3 flex items-center gap-2 text-[var(--muted)]"><MapPin size={18} />{property.location}</p>
              <div className="display-font mt-6 text-3xl font-extrabold text-[var(--blue)]">{formatCurrency(property.price)}</div>
              <div className="mt-6 grid gap-3 sm:grid-cols-4">
                <Info icon={<BedDouble size={20} />} label="Quartos" value={String(property.bedrooms ?? "-")} />
                <Info icon={<Bath size={20} />} label="WC" value={String(property.bathrooms ?? "-")} />
                <Info icon={<Ruler size={20} />} label="Área" value={formatArea(property.area_sqm)} />
                <Info icon={<Calendar size={20} />} label="Estado" value={property.status} />
              </div>
              <h2 className="mt-10 text-2xl font-extrabold">Descrição</h2>
              <p className="mt-4 whitespace-pre-line leading-8 text-[var(--muted)]">{property.description}</p>
              <h2 className="mt-10 text-2xl font-extrabold">Localização aproximada</h2>
              <div className="mt-4 rounded-md border border-[var(--border)] bg-[var(--offwhite)] p-8 text-[var(--muted)]">{property.location}</div>
            </article>
            <aside className="grid h-fit gap-6">
              <div className="rounded-md border border-[var(--border)] p-6">
                <h2 className="mb-4 text-xl font-extrabold">Contactar sobre este imóvel</h2>
                <ContactForm source="property_detail" propertyId={property.id} />
              </div>
              {property.agent && (
                <div className="rounded-md border border-[var(--border)] p-6">
                  <h2 className="mb-4 text-xl font-extrabold">Agente responsável</h2>
                  <div className="flex items-center gap-4">
                    <div className="grid h-16 w-16 place-items-center rounded-full bg-[var(--navy)] font-extrabold text-white">{initials(property.agent.name)}</div>
                    <div>
                      <div className="font-extrabold">{property.agent.name}</div>
                      <div className="text-sm text-[var(--muted)]">{property.agent.role}</div>
                      <div className="mt-1 text-sm font-bold text-[var(--blue)]">{property.agent.phone}</div>
                    </div>
                  </div>
                </div>
              )}
            </aside>
          </div>
          {similar.length > 0 && (
            <section className="py-16">
              <h2 className="section-title mb-8">Imóveis semelhantes</h2>
              <div className="grid gap-6 md:grid-cols-3">{similar.map((item) => <PropertyCard key={item.id} property={item} />)}</div>
            </section>
          )}
        </section>
      </main>
      <VideoFooter />
    </>
  );
}

function Info({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return <div className="rounded-md border border-[var(--border)] p-4">{icon}<div className="mt-2 text-xs font-extrabold uppercase text-[var(--muted)]">{label}</div><div className="font-extrabold">{value}</div></div>;
}
