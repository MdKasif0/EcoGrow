import type { Metadata, Viewport } from 'next';
import { Inter, Roboto_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import ServiceWorkerRegistrar from '@/components/pwa/ServiceWorkerRegistrar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import DesktopSidebar from '@/components/layout/DesktopSidebar';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { PWAInstallProvider } from '@/context/PWAInstallContext';
import Preloader from '@/components/layout/Preloader'; // Added Preloader import
import ActiveUserModeDisplay from '@/components/layout/ActiveUserModeDisplay';
import { ToastProvider } from '@/components/ui/toast-provider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const roboto_mono = Roboto_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '700'],
});

const siteBaseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL('https://ecogrow.netlify.app/'), // Updated URL
  title: {
    default: 'EcoGrow',
    template: '%s - EcoGrow',
  },
  description: 'EcoGrow: Your AI-powered gardening companion and plant encyclopedia.', // Update description
  keywords: ['gardening', 'plants', 'AI', 'grow guide', 'plant care', 'horticulture', 'agriculture'],
  manifest: '/manifest.webmanifest',
  openGraph: {
    title: 'EcoGrow', // Update Open Graph title
    description: 'EcoGrow: Your AI-powered gardening companion and plant encyclopedia.', // Update Open Graph description
    url: 'https://ecogrow.netlify.app/', // Updated URL
    siteName: 'EcoGrow', // Update Open Graph site name
    images: [
      {
        url: '/og-image.png', // Update if you have a new OG image for EcoGrow
        width: 1200,
        height: 630,
        alt: 'EcoGrow - AI-powered Gardening Guide', // Update alt text
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EcoGrow', // Update Twitter title
    description: 'EcoGrow: Your AI-powered gardening companion and plant encyclopedia.', // Update Twitter description
    images: ['/og-image.png'], // Update if you have a new Twitter image for EcoGrow
  },
  authors: [{ name: 'Your Name or Team', url: 'yourwebsite.com' }], // Update author details
  creator: 'Your Name or Team', // Update creator details
  publisher: 'Your Name or Team', // Update publisher details
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'hsl(var(--background))' },
    { media: '(prefers-color-scheme: dark)', color: 'hsl(var(--background))' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${roboto_mono.variable} font-sans antialiased`}>
        <ToastProvider>
          <Preloader videoSrc="/videos/EcoGrow-preloader-screen.mp4"> {/* Updated Preloader video path */}
            <PWAInstallProvider>
              <ThemeProvider
                  attribute="class"
                  defaultTheme="system"
                  enableSystem
                  disableTransitionOnChange
              >
                <ServiceWorkerRegistrar />
                <SidebarProvider defaultOpen={true}>
                  <div className="flex">
                    <DesktopSidebar />
                    <SidebarInset>
                      <main className="container mx-auto p-4 pb-20 md:p-8 md:pb-8">
                        {children}
                      </main>
                    </SidebarInset>
                  </div>
                  <MobileBottomNav />
                  <ActiveUserModeDisplay /> {/* Display active mode */}
                </SidebarProvider>
                <Toaster />
              </ThemeProvider>
            </PWAInstallProvider>
          </Preloader>
        </ToastProvider>
      </body>
    </html>
  );
}
