import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar, FloatingDock } from "@/modules/shared/components/layout";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/modules/shared/components/providers/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "oklch(0.12 0.008 85)" },
    { media: "(prefers-color-scheme: light)", color: "oklch(0.98 0.005 85)" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: {
    default: "Luma",
    template: "%s | Luma",
  },
  description:
    "Luma - Your modular personal operating system. Track expenses, manage goals, build habits, and stay organized.",
  applicationName: "Luma",
  authors: [{ name: "Luma" }],
  keywords: ["personal os", "expense tracker", "budget", "finance", "goals", "habits", "planner"],
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Luma",
    startupImage: ["/apple-touch-icon.png"],
  },
  openGraph: {
    type: "website",
    siteName: "Luma",
    title: "Luma - Your Personal Operating System",
    description: "Track expenses, manage goals, build habits, and stay organized.",
  },
  twitter: {
    card: "summary",
    title: "Luma",
    description: "Track expenses, manage goals, build habits, and stay organized.",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col md:flex-row bg-background text-foreground">
        <ThemeProvider defaultTheme="dark" storageKey="luma-theme">
          <Sidebar />
          <main className="flex-1 min-w-0 pb-24 md:pb-0 overflow-y-auto">
            {children}
          </main>
          <Toaster />
          <FloatingDock />
        </ThemeProvider>
      </body>
    </html>
  );
}
