import { Outfit } from "next/font/google";
import { Toaster } from "react-hot-toast";
import StoreProvider from "@/app/StoreProvider";
import "./globals.css";
import React from 'react'
import MetaPixel from "@/components/MetaPixel";

const outfit = Outfit({ subsets: ["latin"], weight: ["400", "500", "600"] });

export const metadata = {
  title: "Qui - Shop smarter",
  description: "qui - Shop smarter",
};

export default function RootLayout({ children }) {
  const ik = process.env.IMAGEKIT_URL_ENDPOINT;
  let ikOrigin = null;
  try { if (ik) ikOrigin = new URL(ik).origin; } catch {}
  return (
    <html lang="en">
      <head>
        {ikOrigin && (
          <>
            <link rel="dns-prefetch" href={ikOrigin} />
            <link rel="preconnect" href={ikOrigin} crossOrigin="anonymous" />
          </>
        )}
          {/* Meta Pixel Code moved to Client Component */}
    
        {/* End Meta Pixel Code */}

      </head>
      <body className={`${outfit.className} antialiased`} suppressHydrationWarning>
          <MetaPixel />
        <StoreProvider>
          <Toaster />
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
