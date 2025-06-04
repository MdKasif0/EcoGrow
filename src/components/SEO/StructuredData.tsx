'use client';

import { useEffect } from 'react';

interface StructuredDataProps {
  type: 'WebApplication' | 'WebSite' | 'Organization';
  data: Record<string, any>;
}

export function StructuredData({ type, data }: StructuredDataProps) {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': type,
      ...data,
    });
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [type, data]);

  return null;
}

// Predefined structured data for common pages
export const webAppData = {
  name: 'EcoGrow',
  description: 'Smart Plant Growth Management Platform',
  applicationCategory: 'LifestyleApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  featureList: [
    'Smart Calendar & Reminders',
    'Plant Growth Tracker',
    'Seed-to-Harvest Timeline Visualization',
  ],
};

export const websiteData = {
  name: 'EcoGrow',
  url: 'https://eco-grow.netlify.app',
  description: 'Track, manage, and optimize your plant growth journey with EcoGrow.',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://eco-grow.netlify.app/search?q={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
};

export const organizationData = {
  name: 'EcoGrow',
  url: 'https://eco-grow.netlify.app',
  logo: 'https://eco-grow.netlify.app/icons/icon-512x512.png',
  sameAs: [
    'https://twitter.com/ecogrow',
    'https://facebook.com/ecogrow',
    'https://instagram.com/ecogrow',
  ],
}; 