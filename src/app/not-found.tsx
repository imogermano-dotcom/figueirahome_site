import Link from "next/link";

export default function NotFound() {
  return (
    <main className="container pt-32 pb-20">
      <h1 className="section-title">Página não encontrada</h1>
      <p className="mt-4 text-[var(--muted)]">O conteúdo pedido não existe ou deixou de estar publicado.</p>
      <Link href="/imoveis" className="btn btn-primary mt-8">Ver imóveis</Link>
    </main>
  );
}
