import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import BottomNav from '@/components/BottomNav';
import LenisProvider from '@/components/LenisProvider';
import { QuickAddSheet } from '@/components/QuickAddSheet';
import { Toaster } from "sonner";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  // Renders to <meta name="theme-color">, which takes a literal color — var()
  // does not resolve here. Keep in sync with --luma-canvas in app/globals.css
  // (and with manifest.ts, which has the same constraint).
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#1B1C21" },
    { media: "(prefers-color-scheme: light)", color: "#1B1C21" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: {
    default: "PaisaTrack",
    template: "%s | PaisaTrack",
  },
  description:
    "Track your daily expenses, manage your balance, set budgets, and keep an eye on your daily spending.",
  applicationName: "PaisaTrack",
  authors: [{ name: "PaisaTrack" }],
  keywords: ["expense tracker", "budget", "finance", "personal finance", "spending tracker"],
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "PaisaTrack",
    startupImage: ["/apple-touch-icon.png"],
  },
  openGraph: {
    type: "website",
    siteName: "PaisaTrack",
    title: "PaisaTrack - Personal Expense Manager",
    description: "Track expenses, manage balance, and stay on budget.",
  },
  twitter: {
    card: "summary",
    title: "PaisaTrack",
    description: "Track expenses, manage balance, and stay on budget.",
  },
  icons: {
    icon: [
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/icon-192x192.png",
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${fraunces.variable} ${inter.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Bank logos come from logo.dev. Warming the connection means the first
            logo doesn't pay DNS + TLS on the critical path; the images
            themselves are lazy-loaded, so they never block a render. */}
        <link rel="preconnect" href="https://img.logo.dev" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://img.logo.dev" />
      </head>
      <body className="min-h-screen flex flex-col tablet:flex-row tablet:items-start bg-luma-canvas text-luma-text">
        <LenisProvider>
          <Sidebar />
          <main className="flex-1 min-w-0 dock-clearance">
            {children}
          </main>
          <Toaster />
          <BottomNav />
          <QuickAddSheet />
        </LenisProvider>
      </body>
    </html>
  );
}
