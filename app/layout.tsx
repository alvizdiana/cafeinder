import type { Metadata } from "next";
import { MotionConfig } from "motion/react";
import "./globals.css";

export const metadata: Metadata = {
  title: "CafeInder — Find Your Peace",
  description: "Find the nearest café using filters for ratings, price, and amenities such as Wi-Fi, a prayer room, WFA-friendly, and more.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <html lang="id">
        <body>{children}</body>
      </html>
    </MotionConfig>
  );
}
