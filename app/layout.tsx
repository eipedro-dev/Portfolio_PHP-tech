import "@/styles/global.css";
import type { Metadata, Viewport } from "next";

const SITE_URL = "https://pedro.dev";
const OG_IMAGE = `${SITE_URL}/og.png`;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
  maximumScale: 1.0,
  userScalable: false,
  themeColor: "#f0f4f1",
};

const titulo = "Pedro Henrique | Desenvolvedor Frontend";
const descricao =
  "Portfólio interativo de Pedro Henrique, Desenvolvedor Frontend focado em arquitetura web, performance e experiências digitais incríveis.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: titulo,
    template: "%s | Pedro Henrique",
  },
  description: descricao,
  keywords: [
    "Pedro Henrique",
    "Desenvolvedor Frontend",
    "Portfólio",
    "React",
    "Next.js",
    "Web Design",
    "JavaScript",
    "TypeScript",
  ],
  authors: [{ name: "Pedro Henrique", url: SITE_URL }],
  creator: "Pedro Henrique",
  referrer: "no-referrer",
  formatDetection: {
    telephone: false,
  },
  robots: {
    index: process.env.NODE_ENV !== "development",
    follow: process.env.NODE_ENV !== "development",
  },
  other: {
    "x-ua-compatible": "ie=edge",
    "x-dns-prefetch-control": "off",
    "geo.region": "BR",
    "msapplication-TileColor": "#f0f4f1",
  },
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#333333",
      },
    ],
  },
  manifest: "/site.webmanifest",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: titulo,
    description: descricao,
    siteName: "Pedro H",
    locale: "pt_BR",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Capa do Portfólio de Pedro Henrique",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: titulo,
    description: descricao,
    images: [OG_IMAGE],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const schemaOrgJSONLD = {
    "@context": "http://schema.org",
    "@type": "Person",
    name: "Pedro Henrique",
    jobTitle: "Desenvolvedor Frontend",
    url: SITE_URL,
    image: OG_IMAGE,
    email: "pedrohdev01@gmail.com",
    sameAs: [
      "https://www.linkedin.com/in/pedro-henrique-j-dev",
      "https://github.com/eipedro-dev",
    ],
  };

  return (
    <html lang="pt-BR">
      <head>
        <link rel="preload" href="/fonts/NeueHaasDisplayBold.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/NeueHaasDisplayLight.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/NeueHaasDisplayLightItalic.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/NeueHaasDisplayMedium.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/NeueHaasDisplayRoman.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/NeueHaasDisplayRomanItalic.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrgJSONLD) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
