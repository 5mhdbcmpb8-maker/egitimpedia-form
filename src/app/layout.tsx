import type { Metadata } from "next";
// Ortam hatasını önlemek için font ve css importlarını geçici olarak kapatıyoruz.
// Gerçek projenizde dosyalar varsa bunları açabilirsiniz.
// import { Inter } from "next/font/google";
// import "./globals.css";

// const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Eğitimpedia", // Sekme başlığı
  description: "Okul Tercih Formu", // Site açıklaması
  icons: {
    icon: '/logo.png', // Sekme ikonu
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
    <div lang="tr" style={{ minHeight: "100vh" }}>
      {/* <body className={inter.className}>{children}</body> */}
      <div style={{ minHeight: "100vh" }}>{children}</div>
    </div>
  );
}
