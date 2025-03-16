import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FitnessPark QR Code Generator",
  description: "API pour générer des QR codes FitnessPark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-white">
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
