import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/ModeToggle";
import { Manrope } from "next/font/google";

import "./globals.css";

const manrope = Manrope({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Wallet Generater",
  description: "Generate diffenent eth wallet",
  //TODO: change the icon
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  //TODO: add footer also
  return (
    <html lang="en">
      <body className={`${manrope.className}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster />

          {children}
          {/* <Footer /> */}
        </ThemeProvider>
      </body>
    </html>
  );
}
