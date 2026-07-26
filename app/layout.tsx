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
    "Track your daily expenses, manage your balance, set budgets, and stay on top of recurring payments.",
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
      <body className="min-h-screen flex flex-col tablet:flex-row tablet:items-start bg-[#1B1C21] text-[#F2EFEA]">
        <LenisProvider>
          <Sidebar />
          <main className="flex-1 min-w-0 pb-28 tablet:pb-0">
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
