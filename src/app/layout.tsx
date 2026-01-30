import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Oracles | AI Prediction Market",
  description:
    "An LLM-powered prediction market where a council of AI models researches and predicts outcomes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased min-h-screen`}>
        <ThemeProvider>
          <header className="border-b border-[var(--card-border)] bg-[var(--card-bg)]">
            <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
              <a href="/" className="text-xl font-bold tracking-tight">
                The Oracles
              </a>
              <ThemeToggle />
            </div>
          </header>
          <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
