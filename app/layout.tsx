import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StadiaX — The Autonomous AI Operating System for Smart Stadiums",
  description: "StadiaX transforms stadiums into autonomous intelligent ecosystems by orchestrating crowd intelligence, security, transportation, accessibility, sustainability, and fan experiences using Generative AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} h-full antialiased dark`}
      style={{ colorScheme: "dark" }}
    >
      <body className="min-h-full bg-[#07111F] text-[#F8FAFC] font-sans antialiased overflow-x-hidden">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#132238",
              color: "#F8FAFC",
              border: "1px solid rgba(0, 229, 255, 0.2)",
              borderRadius: "0.75rem",
              backdropFilter: "blur(12px)",
            },
          }}
        />
      </body>
    </html>
  );
}

