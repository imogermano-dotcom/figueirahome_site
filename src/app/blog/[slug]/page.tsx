import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { VideoFooter } from "@/components/video-footer";

const posts: Record<string, { title: string; body: string }> = {
  "como-preparar-imovel-para-venda": {
    title: "Como preparar o seu imóvel para venda",
    body: "Antes de publicar, confirme a documentação, prepare fotografias de qualidade, defina um preço suportado pelo mercado local e organize informação sobre áreas, estado e custos associados."
  },
  "comprar-casa-na-figueira-da-foz": {
    title: "Comprar casa na Figueira da Foz",
    body: "A escolha deve considerar proximidade a serviços, acessos, praia, exposição solar e objetivo da compra. Buarcos, Quiaios e o centro da Figueira da Foz respondem a perfis diferentes."
  }
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = posts[slug];
  return post ? { title: post.title, description: post.body.slice(0, 150) } : { title: "Artigo não encontrado" };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = posts[slug];
  if (!post) notFound();
  return (
    <>
      <main className="container max-w-3xl pt-28 pb-16">
        <h1 className="section-title">{post.title}</h1>
        <p className="mt-6 leading-8 text-[var(--muted)]">{post.body}</p>
      </main>
      <VideoFooter />
    </>
  );
}
