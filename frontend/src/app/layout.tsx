import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/Sidebar';
import { ThemeProvider } from "@/components/ThemeProvider"

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'YabaTech Analytics | Command Center',
  description: 'Advanced Student Academic Performance Dashboard',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-slate-50 dark:bg-black font-sans antialiased overflow-hidden`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex h-screen bg-white dark:bg-black"> {/* Main Canvas Background */}
            <Sidebar />
            <main className="flex-1 overflow-y-auto relative">
              {/* Top Gradient/Accent Bar */}
              <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-slate-100 dark:from-slate-900 to-transparent pointer-events-none -z-10" />

              <div className="container mx-auto p-8 max-w-[1600px]">
                {children}
              </div>
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
