import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  keywords?: string[];
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
}

export function SEO({
  title = 'AkiliMed - Modern Healthcare Management Platform',
  description = 'Streamline healthcare operations with AkiliMed\'s comprehensive medical platform for clinics and hospitals.',
  image = '/og-image.jpeg',
  url = window.location.href,
  type = 'website',
  keywords = ['healthcare', 'medical software', 'clinic management', 'hospital management'],
  author = 'AkiliMed',
  publishedTime,
  modifiedTime,
  section = 'Healthcare Technology',
  tags = ['medical', 'software', 'healthcare']
}: SEOProps) {
  const siteTitle = title.includes('AkiliMed') ? title : `${title} | AkiliMed`;
  
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <meta name="author" content={author} />
      
      {/* Open Graph */}
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="AkiliMed" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Additional Meta Tags */}
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {section && <meta property="article:section" content={section} />}
      {tags.length > 0 && tags.map((tag, index) => (
        <meta key={index} property="article:tag" content={tag} />
      ))}
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
      
      {/* Structured Data for Medical Content */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": type === 'article' ? 'NewsArticle' : 'WebPage',
          "headline": siteTitle,
          "description": description,
          "image": image,
          "datePublished": publishedTime,
          "dateModified": modifiedTime,
          "author": {
            "@type": "Organization",
            "name": author
          },
          "publisher": {
            "@type": "Organization",
            "name": "AkiliMed",
            "logo": {
              "@type": "ImageObject",
              "url": "https://akili-med.netlify.app/logo.png"
            }
          }
        })}
      </script>
    </Helmet>
  );
}