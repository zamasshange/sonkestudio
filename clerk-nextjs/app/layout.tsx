import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sonke.studio"),
  title: {
    default: "SONKE Studio | Together, Powered by AI",
    template: "%s | SONKE Studio",
  },
  description:
    "SONKE Studio is a South African AI productivity ecosystem built by Zama Shange under BDL Corp. Purpose-built AI tools for students, creators, developers, businesses, and modern professionals.",
  keywords: [
    "SONKE",
    "SONKE Studio",
    "BDL Corp",
    "Zama Shange",
    "AI tools South Africa",
    "South African AI platform",
    "AI productivity platform",
    "AI tools for students",
    "AI tools for creators",
    "AI tools for developers",
  ],
  openGraph: {
    title: "SONKE Studio | Ai Ecosystem Built in South Africa for a Global Generation",
    description:
      "One intelligent ecosystem where productivity, creativity, education, and AI come together.",
    url: "https://sonke.studio",
    siteName: "SONKE Studio",
    locale: "en_ZA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SONKE Studio | Together, Powered by AI",
    description:
      "Modern AI experiences designed for everyone, built by BDL Corp and founded by Zama Shange.",
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
      <body className="min-h-full flex flex-col">
        <ClerkProvider>{children}</ClerkProvider>
      </body>
    </html>
  );
}
