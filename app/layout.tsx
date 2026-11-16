import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CafeInder — Find Your Peace",
  description: "Find the nearest café using filters for ratings, price, and amenities such as Wi-Fi, a prayer room, WFA-friendly, and more.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
