import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Digital Nomads in Nepal",
  description: "The ultimate guide to living and working remotely in the Himalayas.",
  metadataBase: new URL('https://digitalnomadsinnepal.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Digital Nomads in Nepal',
    description: 'The ultimate guide to living and working remotely in the Himalayas.',
    url: 'https://digitalnomadsinnepal.com',
    siteName: 'Digital Nomads in Nepal',
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
