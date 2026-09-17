import "dotenv/config";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to get absolute path from project root
const resolve = (...args) => path.join(__dirname, '..', ...args);

// Configuration
const BASE_URL = 'https://www.wbify.com';
const OUTPUT_FILE = resolve('public', 'sitemap.xml');
const BLOG_DATA_FILE = resolve('data', 'blog-posts.json');

// Build date used as lastmod for static pages (YYYY-MM-DD)
const BUILD_DATE = new Date().toISOString().split('T')[0];

// Static Routes - Add all your main pages here.
// NOTE: keep this list in sync with the routes declared in App.tsx.
const staticRoutes = [
    { url: '/', changefreq: 'weekly', priority: 1.0, lastmod: BUILD_DATE },
    { url: '/services', changefreq: 'weekly', priority: 0.9, lastmod: BUILD_DATE },
    { url: '/shopify', changefreq: 'weekly', priority: 0.8, lastmod: BUILD_DATE },
    { url: '/web-dev', changefreq: 'weekly', priority: 0.8, lastmod: BUILD_DATE },
    { url: '/wordpress', changefreq: 'weekly', priority: 0.8, lastmod: BUILD_DATE },
    { url: '/graphics', changefreq: 'weekly', priority: 0.8, lastmod: BUILD_DATE },
    { url: '/ai-services', changefreq: 'weekly', priority: 0.8, lastmod: BUILD_DATE },
    { url: '/video-animation', changefreq: 'weekly', priority: 0.8, lastmod: BUILD_DATE },
    { url: '/pricing', changefreq: 'monthly', priority: 0.8, lastmod: BUILD_DATE },
    { url: '/portfolio', changefreq: 'weekly', priority: 0.8, lastmod: BUILD_DATE },
    { url: '/store', changefreq: 'weekly', priority: 0.7, lastmod: BUILD_DATE },
    { url: '/blog', changefreq: 'weekly', priority: 0.8, lastmod: BUILD_DATE },
    { url: '/tools', changefreq: 'monthly', priority: 0.7, lastmod: BUILD_DATE },
    { url: '/websites-for-sale', changefreq: 'weekly', priority: 0.8, lastmod: BUILD_DATE },
    { url: '/about', changefreq: 'monthly', priority: 0.7, lastmod: BUILD_DATE },
    { url: '/contact', changefreq: 'monthly', priority: 0.7, lastmod: BUILD_DATE },
    { url: '/inquiry', changefreq: 'monthly', priority: 0.6, lastmod: BUILD_DATE },
    { url: '/careers', changefreq: 'monthly', priority: 0.6, lastmod: BUILD_DATE },
    { url: '/privacy-policy', changefreq: 'monthly', priority: 0.5, lastmod: BUILD_DATE },
    { url: '/terms-and-conditions', changefreq: 'monthly', priority: 0.5, lastmod: BUILD_DATE },
];

// Live blog posts are managed by the admin dashboard and stored in Firestore
// (the `data/blog-posts.json` file is unrelated legacy/seed data and does not
// reflect what's actually published on the site).
async function fetchPublishedBlogUrlsFromFirestore() {
    const firebaseConfig = {
        apiKey: process.env.VITE_FIREBASE_API_KEY,
        authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.VITE_FIREBASE_PROJECT_ID,
        storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.VITE_FIREBASE_APP_ID,
    };

    if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
        console.warn('Firebase config not found in env — skipping Firestore blog fetch.');
        return null;
    }

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const snapshot = await getDocs(query(collection(db, 'blog_posts'), where('published', '==', true)));

    return snapshot.docs
        .map(docSnapshot => docSnapshot.data())
        .filter(post => post.slug)
        .map(post => ({
            url: `/blog/${post.slug}`,
            changefreq: 'monthly',
            priority: 0.7,
            lastmod: post.date || BUILD_DATE,
        }));
}

// Fallback used only if Firestore is unreachable at build time.
function getBlogUrlsFromLocalSeed() {
    if (!fs.existsSync(BLOG_DATA_FILE)) return [];
    const blogData = JSON.parse(fs.readFileSync(BLOG_DATA_FILE, 'utf-8'));
    return blogData.map(post => ({
        url: `/blog/${post.slug}`,
        changefreq: 'monthly',
        priority: 0.7,
        lastmod: post.date,
    }));
}

async function generateSitemap() {
    try {
        console.log('Starting sitemap generation...');

        let urls = [...staticRoutes];

        let blogUrls = null;
        try {
            blogUrls = await fetchPublishedBlogUrlsFromFirestore();
        } catch (error) {
            console.error('Failed to fetch blog posts from Firestore:', error.message);
        }

        if (blogUrls) {
            console.log(`Found ${blogUrls.length} published blog posts in Firestore.`);
        } else {
            console.warn('Falling back to local blog seed data for the sitemap.');
            blogUrls = getBlogUrlsFromLocalSeed();
            console.log(`Found ${blogUrls.length} blog posts in local seed file.`);
        }

        urls = [...urls, ...blogUrls];

        // Generate XML
        const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(route => `  <url>
    <loc>${BASE_URL}${route.url}</loc>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>${route.lastmod ? `\n    <lastmod>${route.lastmod}</lastmod>` : ''}
  </url>`).join('\n')}
</urlset>`;

        // Write to file
        fs.writeFileSync(OUTPUT_FILE, sitemapXml);
        console.log(`Sitemap generated successfully at ${OUTPUT_FILE} (${urls.length} URLs).`);

    } catch (error) {
        console.error('Error generating sitemap:', error);
        process.exit(1);
    }
}

generateSitemap();
