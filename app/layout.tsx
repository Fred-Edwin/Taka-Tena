import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthSessionProvider from "@/components/providers/session-provider";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "TakaTena - Transform Waste Into Value",
    template: "%s | TakaTena"
  },
  description: "Kenya's leading marketplace for sustainable material exchange. Connect with recyclers and processors to transform waste materials into opportunities while building a circular economy.",
  keywords: [
    "waste management",
    "recycling",
    "circular economy",
    "Kenya",
    "sustainability",
    "material exchange",
    "waste processing",
    "environmental impact"
  ],
  authors: [{ name: "TakaTena Team" }],
  creator: "TakaTena",
  publisher: "TakaTena",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://takatena.co.ke'),
  openGraph: {
    type: "website",
    locale: "en_KE",
    url: "/",
    title: "TakaTena - Transform Waste Into Value",
    description: "Kenya's leading marketplace for sustainable material exchange. Transform waste materials into opportunities while building a circular economy.",
    siteName: "TakaTena",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "TakaTena - Transform Waste Into Value"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    site: "@takatena",
    creator: "@takatena",
    title: "TakaTena - Transform Waste Into Value",
    description: "Kenya's leading marketplace for sustainable material exchange. Transform waste materials into opportunities while building a circular economy.",
    images: ["/og-image.png"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <AuthSessionProvider>
          {children}
          <Toaster />
        </AuthSessionProvider>
      </body>
    </html>
  );
}
