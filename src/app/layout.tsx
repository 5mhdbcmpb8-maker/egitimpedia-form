import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://egitimpedia-form.vercel.app"),
  title: "Eğitimpedia Okul Tercih Formu",
  description: "Eğitimpedia Okul Tercih Formu",

  icons: {
    icon: "/favicon.ico",
  },

  openGraph: {
    type: "website",
    url: "https://egitimpedia-form.vercel.app",
    title: "Eğitimpedia Okul Tercih Formu",
    description: "Eğitimpedia Okul Tercih Formu",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Eğitimpedia",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Eğitimpedia Okul Tercih Formu",
    description: "Eğitimpedia Okul Tercih Formu",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
