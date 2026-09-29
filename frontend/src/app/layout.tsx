import type { Metadata } from "next";
import { Fraunces, Geist, Geist_Mono, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { AuthProvider } from "@/lib/context/AuthContext";
import { BookmarksProvider } from "@/lib/context/BookmarksContext";
import { ThemeProvider } from "@/components/theme-provider";

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['500', '600'],
  style: ['normal', 'italic'],
});

const plexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '600'],
});

export const metadata: Metadata = {
  title: 'MovieBrowser',
  description: 'Browse and bookmark movies and TV series',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fraunces.variable} ${plexSans.variable}`} suppressHydrationWarning>
      <body className="font-body bg-background text-foreground">
       <ThemeProvider>
        <AuthProvider>
          <BookmarksProvider>
            <Navbar />
            <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
          </BookmarksProvider>
        </AuthProvider>
         </ThemeProvider>
      </body>
    </html>
  );
}
