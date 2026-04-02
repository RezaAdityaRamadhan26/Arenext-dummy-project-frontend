import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Arenext — Sewa Lapangan Olahraga",
  description:
    "Platform booking lapangan olahraga terbaik. Cepat, aman, dan tanpa ribet.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${poppins.variable} ${inter.variable} antialiased bg-white text-black`}
      >
        {children}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
