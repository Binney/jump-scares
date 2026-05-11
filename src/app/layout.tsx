import { Roboto_Condensed } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import React from "react";
import Footer from "@/components/Footer";

const robotoCondensed = Roboto_Condensed({
  variable: "--font-roboto-condensed",
  subsets: ["latin"],
});

export const metadata = {
  title: "Jump Scares - Escape Room Content Warnings",
  description: "Find escape rooms that match your comfort level",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${robotoCondensed.variable} font-sans`}>
      <body>
        <AuthProvider>
          <main>{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
