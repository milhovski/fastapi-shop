import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { CartProvider } from "@/components/cart-provider";
import { CartSheet } from "@/components/cart-sheet";
import { SiteHeader } from "@/components/site-header";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FORMA — вещи для жизни",
  description: "Современные товары для дома и повседневной жизни.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ru"
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", inter.variable)}
    >
      <body className="flex min-h-full flex-col">
        <CartProvider>
          <SiteHeader />
          {children}
          <CartSheet />
          <footer className="mt-auto border-t">
            <div className="mx-auto flex max-w-7xl flex-col justify-between gap-2 px-5 py-8 text-sm text-muted-foreground sm:flex-row lg:px-8">
              <span>© 2026 FORMA</span>
              <span>Простые вещи. Честные материалы.</span>
            </div>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}
