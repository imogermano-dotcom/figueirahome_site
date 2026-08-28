import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { VideoFooter } from "@/components/video-footer";
import { fixedPhone, mobilePhone, phoneCallCost } from "@/lib/contact-details";

export const metadata: Metadata = { title: "Contacto", description: "Contacte a Figueira Home para comprar, vender, arrendar ou pedir avaliação gratuita." };

export default function ContactPage() {
  return (
    <>
      <main className="bg-[var(--offwhite)] pt-28">
        <section className="container grid gap-10 pb-16 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <h1 className="section-title">Contacto</h1>
            <p className="mt-4 leading-8 text-[var(--muted)]">Envie o seu pedido para a equipa Figueira Home. Para avaliação gratuita, inclua a localização e uma breve descrição do imóvel.</p>
            <div className="mt-8 grid gap-3 text-[var(--text)]">
              <p><strong>Morada:</strong> Av. do Brasil, 48, 3080-323 Buarcos, Figueira da Foz</p>
              <p><strong>Telefone:</strong> {fixedPhone} <span className="text-sm text-[var(--muted)]">{phoneCallCost(fixedPhone)}</span></p>
              <p><strong>Telemóvel:</strong> {mobilePhone} <span className="text-sm text-[var(--muted)]">{phoneCallCost(mobilePhone)}</span></p>
              <p><strong>Email:</strong> geral@figueirahome.pt</p>
              <p><strong>AMI:</strong> 7968</p>
            </div>
          </div>
          <ContactForm />
        </section>
      </main>
      <VideoFooter />
    </>
  );
}
