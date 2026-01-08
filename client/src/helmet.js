// useMetadata.js
import { Helmet } from 'react-helmet';
import {heads} from './heads';

const useMetadata = (pageKey) => {
  const pageMetadata = heads[pageKey] || {};

  return (
    <Helmet>
      <title>{pageMetadata.title || "Default Title"}</title>
      <meta name="description" content={pageMetadata.description || "Default description"} />

      {/* Open Graph tags */}
      <meta property="og:title" content={pageMetadata.ogTitle || pageMetadata.title || "Default OG Title"} />
      <meta property="og:description" content={pageMetadata.ogDescription || pageMetadata.description || "Default OG Description"} />
      <meta property="og:type" content={pageMetadata.ogType || "website"} />
      <meta property="og:url" content={pageMetadata.ogUrl || window.location.href} />
      <meta property="og:image" content={pageMetadata.ogImage || "default-image.jpg"} />
      <meta property="og:site_name" content={pageMetadata.ogSiteName || "Default Site Name"} />

      {/* Twitter card tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageMetadata.twitterTitle || pageMetadata.title || "Default Twitter Title"} />
      <meta name="twitter:description" content={pageMetadata.twitterDescription || pageMetadata.description || "Default Twitter Description"} />
      <meta name="twitter:image" content={pageMetadata.twitterImage || "default-image.jpg"} />

      {/* Canonical link */}
      <link rel="canonical" href={pageMetadata.canonicalUrl || window.location.href} />

      {/* Icons */}
      <link rel="apple-touch-icon" href={pageMetadata.appleTouchIcon || "/default-apple-touch-icon.png"} />
      <link rel="icon" href={pageMetadata.favicon || "/favicon.ico"} />
      <link rel="shortcut icon" href={pageMetadata.shortcutIcon || "/favicon.ico"} />
      <link rel="mask-icon" href={pageMetadata.maskIcon || "/mask-icon.svg"} color={pageMetadata.themeColor || "#000000"} />

      {/* Theme color */}
      <meta name="theme-color" content={pageMetadata.themeColor || "#ffffff"} />
    </Helmet>
  );
};

export default useMetadata;
