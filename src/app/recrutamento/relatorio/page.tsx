import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { RelatorioView } from "@/components/recruitment/relatorio-view";
import { VideoFooter } from "@/components/video-footer";

const recruitBody = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-recruit-body", display: "swap" });
const recruitDisplay = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["600", "700", "800"], variable: "--font-recruit-display", display: "swap" });

export const metadata: Metadata = { title: "O teu relatório de perfil", robots: { index: false, follow: false } };

export default async function RelatorioPage({ searchParams }: { searchParams: Promise<{ t?: string }> }) {
  const { t } = await searchParams;

  return (
    <>
      <main className={`recruitment-page pt-[72px] ${recruitBody.variable} ${recruitDisplay.variable}`} style={{ background: "var(--r-bg)", minHeight: "100vh" }}>
        <RelatorioView token={t || null} />
      </main>
      <VideoFooter variant="recruitment" />
    </>
  );
}
