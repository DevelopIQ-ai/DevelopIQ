import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DevelopIQ",
  description: "AI for Construction",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          id="apollo-tracking"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              function initApollo() {
                var n = Math.random().toString(36).substring(7);
                var o = document.createElement("script");
                o.src = "https://assets.apollo.io/micro/website-tracker/tracker.iife.js?nocache=" + n;
                o.async = true;
                o.defer = true;
                o.onload = function() {
                  window.trackingFunctions && window.trackingFunctions.onLoad({
                    appId: "6808dfdd318937001569c9da"
                  });
                };
                document.head.appendChild(o);
              }
              initApollo();
            `
          }}
        />
      </head>
      <body className={jetbrainsMono.className}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
