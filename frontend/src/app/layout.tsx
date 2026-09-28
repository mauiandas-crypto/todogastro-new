import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
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
  title: "TodoGastro - Equipamiento Gastronómico Profesional en Uruguay",
  description: "Equipamiento gastronómico profesional para bares, restaurantes y hoteles. Más de 20 años equipando negocios en Uruguay.",
  keywords: ["equipamiento gastronómico", "cocinas profesionales", "refrigeración", "Uruguay", "Montevideo"],
  authors: [{ name: "TodoGastro" }],
  creator: "TodoGastro",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    locale: "es_UY",
    url: "https://todogastro.uy",
    title: "TodoGastro - Equipamiento Gastronómico Profesional",
    description: "Equipamiento gastronómico de calidad para tu negocio. Envío a todo Uruguay.",
    siteName: "TodoGastro",
    images: [
      {
        url: "https://todogastro.uy/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "TodoGastro",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

interface LayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: LayoutProps) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <head>
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script
              id="google-analytics"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${gaId}');
                `,
              }}
            />
          </>
        )}
      </head>
      <body className="min-h-full flex flex-col dark:bg-gray-900 dark:text-gray-100">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <CookieBanner />
      </body>
    </html>
  );
}
