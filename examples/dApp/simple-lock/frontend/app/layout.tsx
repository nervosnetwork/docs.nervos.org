import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Simple Hash Lock | CKB",
  description: "An educational CKB hash-lock transaction example.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
