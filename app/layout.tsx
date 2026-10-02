import type { Metadata, Viewport } from "next";
import { Instrument_Sans, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import { Boot } from "@/components/layout/Boot";
import { Footer } from "@/components/layout/Footer";
import { Nav } from "@/components/layout/Nav";
import { Providers } from "@/components/layout/Providers";
import { site } from "@/data/site";
import "./globals.css";

const sans = Instrument_Sans({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-instrument-sans",
  display: "swap",
});

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: `%s — V` },
  description: site.description,
  applicationName: "V — Portfolio",
  authors: [{ name: site.name, url: site.links.github ?? undefined }],
  creator: site.name,
  keywords: [
    "Vansh Apurva Dave",
    "Vansh Dave",
    "AI engineer",
    "product builder",
    "full-stack developer",
    "machine learning",
    "FastAPI",
    "Flutter",
    "Next.js",
    "portfolio",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "V — Portfolio",
    title: site.title,
    description: site.description,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  themeColor: "#08080a",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

// Runs before first paint: skip the boot sequence for returning visitors.
const bootScript = `try{var d=document.documentElement;if(localStorage.getItem('v:booted')||matchMedia('(prefers-reduced-motion: reduce)').matches){d.dataset.boot='skip'}localStorage.setItem('v:booted','1')}catch(e){}`;

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  alternateName: "V",
  url: site.url,
  jobTitle: "AI Engineer & Product Builder",
  affiliation: { "@type": "CollegeOrUniversity", name: site.education.school },
  sameAs: [site.links.github, site.links.linkedin].filter(Boolean),
  knowsAbout: ["Artificial Intelligence", "Machine Learning", "Full-Stack Development", "AI Agents", "Data Analytics"],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${serif.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <Script id="boot" strategy="beforeInteractive">
          {bootScript}
        </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body>
        <a
          href="#main"
          className="label fixed left-4 top-4 z-[300] -translate-y-24 rounded-full bg-paper px-4 py-3 text-ink transition-transform focus:translate-y-0"
        >
          Skip to content
        </a>
        <Boot />
        <Providers>
          <Nav />
          <main id="main" className="relative z-10">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
