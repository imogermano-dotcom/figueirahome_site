import type { Metadata } from "next";
import { Bath, BedDouble, Calendar, Car, MapPin, Ruler, Sun, Zap } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { PropertyGallery } from "@/components/property-gallery";
import { PropertyCard } from "@/components/property-card";
import { PropertyDetailBrowserFallback } from "@/components/property-detail-browser-fallback";
import { PropertyVideo } from "@/components/property-video";
import { VideoFooter } from "@/components/video-footer";
import { formatArea, formatCurrency, initials } from "@/lib/format";
import { fixedPhone, phoneCallCost } from "@/lib/contact-details";
import { getProperties, getPropertyBySlug } from "@/lib/properties";
import { getPrimaryPropertyImage } from "@/lib/property-images";

export async function generateMetadata({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ ref?: string }> }): Promise<Metadata> {
  const [{ slug }, { ref }] = await Promise.all([params, searchParams]);
  const property = await getPropertyBySlug(slug, ref);
  if (!property) return { title: "Imóvel não encontrado" };

  const summary = [property.type, `em ${property.location}`, property.area_sqm ? formatArea(property.area_sqm) : null, formatCurrency(property.price)]
    .filter(Boolean)
    .join(", ");

  return {
    title: property.title,
    description: `${summary}.`
  };
}

export default async function PropertyDetailPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ ref?: string }> }) {
  const [{ slug }, { ref }] = await Promise.all([params, searchParams]);
  const property = await getPropertyBySlug(slug, ref);
  if (!property) return <PropertyDetailBrowserFallback slug={slug} reference={ref} />;

  const similar = (await getProperties({ tipo: property.type.split(" ")[0] }))
    .filter((item) => item.id !== property.id)
    .slice(0, 3);
  const primaryImage = getPrimaryPropertyImage(property);
  const mapLocation = property.map_location || property.location;
  const mapEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(mapLocation)}&output=embed`;

  return (
    <>
      <main className="pt-28">
        <section className="container">
          {primaryImage ? (
            <PropertyGallery images={property.images || []} title={property.title} />
            ) : (
            <div className="property-detail-media relative h-[420px] overflow-hidden rounded-md">
              <div className="property-fallback h-full w-full">
                <div className="property-fallback-content property-fallback-content-large">
                  <span>{property.type}</span>
                  <strong>{property.location}</strong>
                </div>
              </div>
            </div>
          )}
          <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_380px]">
            <article>
              <p className="text-sm font-extrabold uppercase tracking-[1.5px] text-[var(--gold)]">{property.type}</p>
              <h1 className="section-title mt-2">{property.title}</h1>
              <p className="mt-3 text-sm font-bold text-[var(--muted)]">Referência: <span className="text-[var(--text)]">{property.id}</span></p>
              <p className="mt-3 flex items-center gap-2 text-[var(--muted)]"><MapPin size={18} />{property.location}</p>
              <div className="display-font mt-6 text-3xl font-extrabold text-[var(--blue)]">{formatCurrency(property.price)}</div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <Info icon={<BedDouble size={20} />} label="Quartos" value={String(property.bedrooms ?? "-")} />
                <Info icon={<Bath size={20} />} label="WC" value={String(property.bathrooms ?? "-")} />
                <Info icon={<Ruler size={20} />} label="Área" value={formatArea(property.area_sqm)} />
                <Info icon={<Calendar size={20} />} label="Estado" value={property.status} />
                {property.energy_certificate && <Info icon={<Zap size={20} />} label="Certificado energético" value={property.energy_certificate} />}
                {property.has_garage && <Info icon={<Car size={20} />} label="Garagem" value="Sim" />}
                {property.has_balcony && <Info icon={<Sun size={20} />} label="Varanda" value="Sim" />}
              </div>
              <h2 className="mt-10 text-2xl font-extrabold">Descrição</h2>
              <p className="mt-4 whitespace-pre-line leading-8 text-[var(--muted)]">{property.description}</p>
              {property.floor_plans && property.floor_plans.length > 0 && (
                <section className="mt-10 border-l-4 border-[var(--gold)] pl-5" aria-labelledby="floor-plans-title">
                  <p className="text-sm font-extrabold uppercase tracking-[1.5px] text-[var(--gold)]">Documentação do imóvel</p>
                  <h2 id="floor-plans-title" className="mt-2 text-2xl font-extrabold">Plantas do imóvel</h2>
                  <div className="mt-5"><PropertyGallery images={property.floor_plans} title={property.title} contentLabel="planta" /></div>
                </section>
              )}
              {property.video_url && <section className="mt-10"><h2 className="text-2xl font-extrabold">Vídeo do imóvel</h2><div className="mt-4 overflow-hidden rounded-md border border-[var(--border)] bg-[var(--navy)]"><PropertyVideo url={property.video_url} title={property.title} /></div></section>}
              {property.visita_virtual_url && <section className="mt-10"><h2 className="text-2xl font-extrabold">Visita virtual</h2><div className="mt-4 overflow-hidden rounded-md border border-[var(--border)] bg-[var(--navy)]"><PropertyVideo url={property.visita_virtual_url} title={`Visita virtual: ${property.title}`} /></div></section>}
              <h2 className="mt-10 text-2xl font-extrabold">Localização aproximada</h2>
              <div className="mt-4 overflow-hidden rounded-md border border-[var(--border)] bg-[var(--offwhite)]">
                <iframe
                  title={`Mapa aproximado de ${property.location}`}
                  src={mapEmbedUrl}
                  className="block h-[320px] w-full border-0 sm:h-[380px]"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">O mapa indica apenas a zona aproximada do imóvel.</p>
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
                      {property.agent.phone ? <div className="mt-1 text-sm font-bold text-[var(--blue)]">{property.agent.phone}<span className="mt-1 block text-xs font-medium text-[var(--muted)]">{phoneCallCost(property.agent.phone)}</span></div> : <div className="mt-3 text-sm"><span className="block font-bold text-[var(--text)]">Contacto Figueira Home</span><span className="font-bold text-[var(--blue)]">{fixedPhone}</span><span className="mt-1 block text-xs text-[var(--muted)]">{phoneCallCost(fixedPhone)}</span></div>}
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
