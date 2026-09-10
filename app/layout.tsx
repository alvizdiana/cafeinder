import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cafeinder — Temukan cafe di sekitarmu",
  description: "Cari cafe terdekat dengan filter rating, harga, dan fasilitas seperti WiFi, musholla, cocok WFA, dan lainnya.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
