import type { Metadata } from "next";
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
  title: "Interactive comments section",
  description: "Interactive comments section created using Next.JS, TypeScript and Tailwind",
  icons: { 
    icon: "/favicon-32x32.png", 
  },
  openGraph: {
    title: "Interactive comments section",
    description: "Interactive comments section created using Next.JS, TypeScript and Tailwind",
    images: [
      {
        url: "https://res.cloudinary.com/dz209s6jk/image/upload/f_auto,q_auto,w_700/Challenges/v9wskl4mnbt5gbxm4o2r.jpg",
        width: 700,
        height: 513,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://res.cloudinary.com/dz209s6jk/image/upload/f_auto,q_auto,w_700/Challenges/v9wskl4mnbt5gbxm4o2r.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
