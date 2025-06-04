'use client';

import Head from 'next/head';

interface DynamicMetaTagsProps {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product';
  twitterCard?: 'summary' | 'summary_large_image';
  canonicalUrl?: string;
}

export function DynamicMetaTags({
  title,
  description,
  keywords,
  ogImage = '/og-image.jpg',
  ogType = 'website',
  twitterCard = 'summary_large_image',
  canonicalUrl,
}: DynamicMetaTagsProps) {
  const fullTitle = title ? `${title} | EcoGrow` : 'EcoGrow - Smart Plant Growth Management Platform';
  const defaultDescription = 'Track, manage, and optimize your plant growth journey with EcoGrow. From seed to harvest, get intelligent insights and tools for successful cultivation.';
  const defaultKeywords = ['plant growth', 'garden management', 'plant tracking', 'growing guide', 'plant journal', 'garden calendar', 'plant care', 'harvest tracking'];

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      <meta name="keywords" content={(keywords || defaultKeywords).join(', ')} />
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="EcoGrow" />
      
      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description || defaultDescription} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
    </Head>
  );
} 