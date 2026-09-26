import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Providers } from "@/components/Providers";
import GoogleTagManager from "@/components/analytics/GoogleTagManager";
import AnalyticsTracker from "@/components/analytics/AnalyticsTracker";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Digital Nomads in Nepal | Vetted Remote Work Guides",
    template: "%s | Digital Nomads in Nepal",
  },
  description: "The ultimate guide to living and working remotely in the Himalayas. Vetted information on visas, internet, coworking, cost of living, and nomad hubs.",
  metadataBase: new URL('https://digitalnomadsinnepal.com'),
  icons: {
    icon: [
      { url: '/faviconlogo.png', type: 'image/png' },
      { url: '/favicon.ico' },
      { url: '/icon-512.png', type: 'image/png', sizes: '512x512' },
    ],
    shortcut: ['/faviconlogo.png', '/favicon.ico'],
    apple: [
      { url: '/faviconlogo.png', sizes: '180x180', type: 'image/png' },
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.webmanifest',
  openGraph: {
    title: 'Digital Nomads in Nepal | Vetted Remote Work Guides',
    description: 'The ultimate guide to living and working remotely in the Himalayas. Visas, internet, coworking, and community.',
    url: 'https://digitalnomadsinnepal.com',
    siteName: 'Digital Nomads in Nepal',
    images: [
      {
        url: '/webistepnglogo.png',
        width: 1024,
        height: 1024,
        alt: 'Digital Nomads in Nepal Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Digital Nomads in Nepal',
    description: 'The ultimate guide to living and working remotely in the Himalayas.',
    images: ['/webistepnglogo.png'],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://digitalnomadsinnepal.com/#organization',
      name: 'Digital Nomads in Nepal',
      url: 'https://digitalnomadsinnepal.com',
      logo: 'https://digitalnomadsinnepal.com/webistepnglogo.png',
      description: 'Community and resource hub for remote workers, freelancers, and digital nomads in Nepal.',
    },
    {
      '@type': 'WebSite',
      '@id': 'https://digitalnomadsinnepal.com/#website',
      url: 'https://digitalnomadsinnepal.com',
      name: 'Digital Nomads in Nepal',
      description: 'Vetted remote work guides, visa updates, cost of living, and coworking hubs in Nepal.',
      publisher: {
        '@id': 'https://digitalnomadsinnepal.com/#organization',
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className}>
        <GoogleTagManager />
        <AnalyticsTracker />
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            <div className="flex min-h-screen flex-col">
              {children}
            </div>
          </ThemeProvider>
        </Providers>
        <div id="search-modal-root" />
      </body>
    </html>
  );
}
