import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/src/components/navigation/Header";
import { Footer } from "@/src/components/navigation/Footer";

export const metadata: Metadata = {
  title: "Sistema Inteligente - Sisteminha Embrapa",
  description: "Monitoramento IoT, registros, dashboards e apoio à decisão para produtores.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="flex min-h-screen flex-col">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
