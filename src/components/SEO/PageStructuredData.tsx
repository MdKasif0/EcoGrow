'use client';

import { StructuredData } from './StructuredData';

interface PageStructuredDataProps {
  type: 'Article' | 'Product' | 'FAQPage';
  data: Record<string, any>;
}

export function PageStructuredData({ type, data }: PageStructuredDataProps) {
  return <StructuredData type={type} data={data} />;
}

// Predefined structured data for common page types
export const articleData = {
  '@type': 'Article',
  headline: '',
  description: '',
  image: '',
  datePublished: '',
  dateModified: '',
  author: {
    '@type': 'Organization',
    name: 'EcoGrow',
    url: 'https://eco-grow.netlify.app',
  },
  publisher: {
    '@type': 'Organization',
    name: 'EcoGrow',
    logo: {
      '@type': 'ImageObject',
      url: 'https://eco-grow.netlify.app/icons/icon-512x512.png',
    },
  },
};

export const productData = {
  '@type': 'Product',
  name: '',
  description: '',
  image: '',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock',
  },
  brand: {
    '@type': 'Brand',
    name: 'EcoGrow',
  },
};

export const faqData = {
  '@type': 'FAQPage',
  mainEntity: [] as Array<{
    '@type': 'Question';
    name: string;
    acceptedAnswer: {
      '@type': 'Answer';
      text: string;
    };
  }>,
}; 