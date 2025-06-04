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
import Preloader from '@/components/layout/Preloader';
import ActiveUserModeDisplay from '@/components/layout/ActiveUserModeDisplay';
import { ToastProvider } from '@/components/ui/toast-provider';
import { StructuredData, webAppData, websiteData, organizationData } from '@/components/SEO/StructuredData';

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
  metadataBase: new URL('https://eco-grow.netlify.app'),
  title: {
    default: 'EcoGrow - Smart Plant Growth Management Platform',
    template: '%s | EcoGrow'
  },
  description: 'Track, manage, and optimize your plant growth journey with EcoGrow. From seed to harvest, get intelligent insights and tools for successful cultivation.',
  keywords: ['plant growth', 'garden management', 'plant tracking', 'growing guide', 'plant journal', 'garden calendar', 'plant care', 'harvest tracking'],
  authors: [{ name: 'EcoGrow Team' }],
  creator: 'EcoGrow',
  publisher: 'EcoGrow',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://eco-grow.netlify.app',
    title: 'EcoGrow - Smart Plant Growth Management Platform',
    description: 'Track, manage, and optimize your plant growth journey with EcoGrow. From seed to harvest, get intelligent insights and tools for successful cultivation.',
    siteName: 'EcoGrow',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'EcoGrow Platform Preview'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EcoGrow - Smart Plant Growth Management Platform',
    description: 'Track, manage, and optimize your plant growth journey with EcoGrow. From seed to harvest, get intelligent insights and tools for successful cultivation.',
    images: ['/og-image.jpg'],
    creator: '@ecogrow',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-site-verification', // Add your Google Search Console verification code
  },
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
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="theme-color" content="#ffffff" />
        <StructuredData type="WebApplication" data={webAppData} />
        <StructuredData type="WebSite" data={websiteData} />
        <StructuredData type="Organization" data={organizationData} />
      </head>
      <body className={`${inter.variable} ${roboto_mono.variable} font-sans antialiased`}>
        <ToastProvider>
          <Preloader videoSrc="/videos/EcoGrow-preloader-screen.mp4">
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
                  <ActiveUserModeDisplay />
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
