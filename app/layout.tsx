import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Providers } from "@/components/Providers";
import GoogleTagManager from "@/components/analytics/GoogleTagManager";
import AnalyticsTracker from "@/components/analytics/AnalyticsTracker";
import WhatsAppButton from "@/components/WhatsAppButton";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Digital Nomads in Nepal | Workspaces, Stays & Remote Work Guides",
    template: "%s | Digital Nomads in Nepal",
  },
  description: "The complete platform for remote workers in Nepal. Vetted workspaces, work-friendly stays, local guides, cost of living breakdowns, and digital nomad hubs.",
  keywords: [
    "digital nomads in nepal",
    "digital nomad nepal",
    "remote work nepal",
    "coworking space kathmandu",
    "coworking pokhara",
    "nepal digital nomad visa",
    "work from nepal",
    "coliving nepal",
    "nepal internet speed for remote work",
    "cost of living nepal digital nomad",
    "best places to work in kathmandu",
    "work friendly stays nepal",
  ],
  metadataBase: new URL('https://digitalnomadsinnepal.com'),
  icons: {
    icon: [
      { url: '/faviconnew.png', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon.ico' },
      { url: '/webapp-installed-icon.png', type: 'image/png', sizes: '512x512' },
    ],
    shortcut: ['/faviconnew.png', '/favicon.ico'],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
      { url: '/webapp-installed-icon.png', sizes: '180x180', type: 'image/png' },
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
      <body className={inter.className} suppressHydrationWarning>
        <GoogleTagManager />
        <AnalyticsTracker />
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            <div className="flex min-h-screen flex-col" suppressHydrationWarning>
              {children}
            </div>
            <WhatsAppButton />
          </ThemeProvider>
        </Providers>
        <div id="search-modal-root" />
      </body>
    </html>
  );
}
