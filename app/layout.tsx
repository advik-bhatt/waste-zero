import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "WasteZero — Kill duplicate orders. Kill food waste.",
  description:
    "WasteZero is a kitchen operations OS that eliminates duplicate orders, delegates tasks by role, and prioritizes the right ticket first. Built for fast-casual.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
