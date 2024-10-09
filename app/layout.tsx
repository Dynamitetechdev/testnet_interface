import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./global.scss";
import Header from "./components/navigations/header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bondhive (testnet) - Maximize Your Investment Returns by Locking in Your Yield with Crypto Bonds",
  description: "Maximize Your Investment Returns by Locking in Your Yield with Crypto Bonds",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        </body>
    </html>
  );
}
