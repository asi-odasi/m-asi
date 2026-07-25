import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "m-asi",
  description: "Yapay Zeka ve Semantik Vektör Analizi Tabanlı Dezenformasyon Tespiti",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
