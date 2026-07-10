import type { Metadata } from "next";
import { getAgents } from "@/lib/properties";
import { initials } from "@/lib/format";
import { VideoFooter } from "@/components/video-footer";

export const metadata: Metadata = { title: "Quem Somos", description: "Conheça a equipa Figueira Home, imobiliária licenciada AMI 7968 em Buarcos desde 2009." };

export default async function AboutPage() {
  const agents = await getAgents();
  return (
    <>
      <main className="pt-28">
        <section className="container pb-16">
          <h1 className="section-title">Quem Somos</h1>
          <p className="mt-5 max-w-3xl leading-8 text-[var(--muted)]">A Figueira Home é uma agência imobiliária local com sede em Buarcos, licenciada pela IMPIC com AMI 7968. Trabalhamos compra, venda, arrendamento e avaliação com conhecimento direto da Figueira da Foz.</p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {agents.map((agent) => (
              <article key={agent.id} className="rounded-md border border-[var(--border)] p-6 text-center">
                <div className="mx-auto mb-4 grid h-20 w-20 place-items-center rounded-full bg-[var(--navy)] text-xl font-extrabold text-white">{initials(agent.name)}</div>
                <h2 className="font-extrabold">{agent.name}</h2>
                <p className="mt-1 text-sm text-[var(--muted)]">{agent.role}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
      <VideoFooter />
    </>
  );
}
