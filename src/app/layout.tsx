import type { Metadata } from "next";
// import { Inter } from "next/font/google"; // Ortam hatasını önlemek için kapalı
// import "./globals.css"; // Ortam hatasını önlemek için kapalı

// const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Eğitimpedia - Okul Tercih Formu",
  description: "Ebeveyn Mentoru ve Okul Seçim Uzmanı Ali Koç ile okul tercih ve tavsiye formu.",
  icons: {
    icon: '/logo.png', // Public klasöründeki logo.png dosyasını kullanır
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Önizleme ortamında "validateDOMNesting" hatasını önlemek için html/body yerine div kullanıyoruz.
  return (
    <div lang="tr">
      {/* Font yüklenemediği için varsayılan font kullanılıyor */}
      <div style={{ fontFamily: 'sans-serif', minHeight: '100vh' }}>{children}</div>
    </div>
  );
}
