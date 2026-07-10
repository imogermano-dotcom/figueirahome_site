import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { VideoFooter } from "@/components/video-footer";

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
              <p><strong>Telefone:</strong> +351 233 408 130</p>
              <p><strong>Telemóvel:</strong> +351 913 702 002</p>
              <p><strong>Email:</strong> geral.figueirahome@gmail.com</p>
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
