import type { Metadata } from "next";
import { VideoFooter } from "@/components/video-footer";

export const metadata: Metadata = { title: "Empreendimentos", description: "Empreendimentos e projetos acompanhados pela Figueira Home.", alternates: { canonical: "/empreendimentos" } };

export default function DevelopmentsPage() {
  return (
    <>
      <main className="container pt-28 pb-16">
        <h1 className="section-title">Empreendimentos</h1>
        <p className="mt-4 max-w-2xl leading-8 text-[var(--muted)]">Esta área fica preparada para projetos e empreendimentos. Quando existirem registos publicados na base de dados, podem ser ligados ao mesmo modelo dinâmico dos imóveis.</p>
      </main>
      <VideoFooter />
    </>
  );
}
