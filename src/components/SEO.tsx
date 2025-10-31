import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
  canonical?: string;
  noindex?: boolean;
}

const DEFAULT_TITLE = 'Super Pi - Financial Wellness Through Smart Equity Trading';
const DEFAULT_DESCRIPTION = 'Achieve financial wellness with Super Pi. Get instant equity trading notifications for India and US markets with AI-powered buy and sell signals.';
const DEFAULT_KEYWORDS = 'equity trading, stock signals, financial wellness, India stock market, US stock market, trading signals, buy sell signals';
const SITE_URL = window.location.origin;

export const SEO = ({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  ogImage = `${SITE_URL}/wellness-wheel-favicon.png`,
  ogType = 'website',
  canonical,
  noindex = false,
}: SEOProps) => {
  const fullTitle = title ? `${title} | Super Pi` : DEFAULT_TITLE;
  const canonicalUrl = canonical || window.location.href;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="Super Pi" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Additional SEO */}
      <meta name="author" content="Super Pi" />
      <meta name="language" content="English" />
    </Helmet>
  );
};
