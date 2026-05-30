import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

interface SEOProps {
    title: string;
    description: string;
    canonical?: string;
    image?: string;
    type?: 'website' | 'article';
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    tags?: string[];
    noindex?: boolean;
    structuredData?: object;
}

const SEO: React.FC<SEOProps> = ({
    title,
    description,
    canonical,
    // NOTE: /og-image.jpg does not exist in /public yet. Falling back to the
    // existing favicon so social cards aren't fully broken. A proper 1200x630
    // og-image.jpg should be added by the site owner (see report).
    image = 'https://www.wbify.com/favicon.png', // Default OG image (placeholder)
    type = 'website',
    publishedTime,
    modifiedTime,
    author,
    tags,
    noindex = false,
    structuredData
}) => {
    const location = useLocation();
    const fullTitle = title.toLowerCase().includes('wbify') ? title : `${title} | wbify Creative Studio`;
    const siteUrl = 'https://www.wbify.com';
    // Canonical is effectively required: default to the current path so a page
    // can never silently ship without one.
    const canonicalPath = canonical ?? location.pathname;
    const fullCanonical = `${siteUrl}${canonicalPath}`;
    const fullImage = image.startsWith('http') ? image : `${siteUrl}${image}`;

    // Default structured data for Organization
    const defaultStructuredData = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'wbify Creative Studio',
        url: siteUrl,
        // NOTE: /logo.png does not exist in /public. Using favicon.png as a
        // placeholder. A square brand logo (logo.png) should be added (see report).
        logo: `${siteUrl}/favicon.png`,
        description: 'Professional web development, design, and digital marketing services',
        sameAs: [
            // TODO: Populate with real social profile URLs once available.
            // Social links are currently admin-configured at runtime (Footer.tsx
            // uses settings.socialUrls) and are not known at build time, so no
            // URLs are hardcoded here to avoid inventing profiles.
        ],
        contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'Customer Service',
            email: 'info@wbify.com'
        }
    };

    const structuredDataToRender = structuredData || defaultStructuredData;

    return (
        <Helmet>
            {/* Basic Meta Tags */}
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            <link rel="canonical" href={fullCanonical} />
            {noindex && <meta name="robots" content="noindex, nofollow" />}
            {!noindex && <meta name="robots" content="index, follow" />}

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={fullCanonical} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={fullImage} />
            <meta property="og:site_name" content="wbify Creative Studio" />

            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={fullCanonical} />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={fullImage} />

            {/* Article specific meta tags */}
            {type === 'article' && (
                <>
                    {publishedTime && <meta property="article:published_time" content={publishedTime} />}
                    {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
                    {author && <meta property="article:author" content={author} />}
                    {tags && tags.map((tag, index) => (
                        <meta key={index} property="article:tag" content={tag} />
                    ))}
                </>
            )}

            {/* Structured Data (JSON-LD) */}
            <script type="application/ld+json">
                {JSON.stringify(structuredDataToRender)}
            </script>
        </Helmet>
    );
};

export default SEO;


