import type { Metadata } from "next";
// import { Inter } from "next/font/google"; // Hata almamak için geçici olarak kapatıldı
// import "./globals.css"; // Hata almamak için geçici olarak kapatıldı

// const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Eğitimpedia",
  description: "Okul Tercih Formu",
  icons: {
    icon: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Önizleme ortamında "<html> cannot appear as a child of <div>" hatasını önlemek için
  // html ve body etiketleri yerine div kullanılmıştır.
  return (
    <div style={{ minHeight: "100vh", fontFamily: "sans-serif" }}>
      {/* <body className={inter.className}>{children}</body> */}
      <div>{children}</div>
    </div>
  );
}
