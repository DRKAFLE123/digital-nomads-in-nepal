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
    default: "Digital Nomads in Nepal | Workspaces, Stays & Remote Work Guides",
    template: "%s | Digital Nomads in Nepal",
  },
  description: "The complete platform for remote workers in Nepal. Vetted workspaces, work-friendly stays, local guides, cost of living breakdowns, and digital nomad hubs.",
  metadataBase: new URL('https://digitalnomadsinnepal.com'),
  icons: {
    icon: [
      { url: '/faviconlogo.png', type: 'image/png' },
      { url: '/favicon.ico' },
      { url: '/icon-512.png', type: 'image/png', sizes: '512x512' },
    ],
    shortcut: ['/faviconlogo.png', '/favicon.ico'],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.webmanifest',
  openGraph: {
    title: 'Digital Nomads in Nepal | Workspaces, Stays & Remote Work Guides',
    description: 'Find vetted workspaces, work-friendly stays, local guides, practical resources and places to live and work across Nepal.',
    url: 'https://digitalnomadsinnepal.com',
    siteName: 'Digital Nomads in Nepal',
    images: [
      {
        url: '/webisteofficiallogo-removebg-preview.png',
        width: 654,
        height: 274,
        alt: 'Digital Nomads in Nepal Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Digital Nomads in Nepal | Workspaces, Stays & Remote Work Guides',
    description: 'Find vetted workspaces, work-friendly stays, local guides, practical resources and places to live and work across Nepal.',
    images: ['/webisteofficiallogo-removebg-preview.png'],
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
      logo: 'https://digitalnomadsinnepal.com/webisteofficiallogo-removebg-preview.png',
      description: 'Community and resource hub for remote workers, freelancers, and digital nomads in Nepal.',
    },
    {
      '@type': 'WebSite',
      '@id': 'https://digitalnomadsinnepal.com/#website',
      url: 'https://digitalnomadsinnepal.com',
      name: 'Digital Nomads in Nepal',
      description: 'Vetted remote work guides, verified coworking spaces, work-friendly stays, and cost of living in Nepal.',
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
