import type { Metadata } from "next";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

import "./globals.css";

export const metadata: Metadata = {
  title: "Market Home Dashboard",
  description:
    "A customizable market home screen with universal market cards, responsive layouts, and future-ready card creation flows.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="min-h-screen bg-[rgb(var(--app-bg))] text-slate-900 antialiased transition-colors dark:text-slate-50">
        {children}
      </body>
    </html>
  );
}
