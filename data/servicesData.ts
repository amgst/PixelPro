import { 
  Palette, 
  Monitor, 
  Megaphone, 
  Video, 
  Briefcase,
  Printer,
  Globe,
  Layout,
  ShoppingBag,
  ShieldCheck,
  Server,
  PenTool
} from 'lucide-react';
import { ServiceCategory } from '../types';

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: 'graphic-design-print',
    title: 'Graphic Design & Print Services',
    description: 'Complete branding, print materials, signage, and merchandise.',
    icon: Palette,
    services: [
      {
        id: 'logo-brand-identity',
        title: 'Logo & Brand Identity',
        description: 'Logo design and complete brand identity packages.',
        longDescription: 'We create unique, memorable logos and comprehensive branding kits that define your business identity.',
        features: ['Custom Logo Design', 'Brand Guidelines', 'Color Palette', 'Typography Selection'],
        pricing: { basic: '$250', standard: '$550', premium: '$950' },
        deliveryTime: '5-7 Days',
        galleryFolderId: '1WytrbAtcAe2mqwNFS4yBLJ9reybnuePM' // Example ID (Reuse Graphic Design folder)
      },
      {
        id: 'business-stationery',
        title: 'Business Stationery',
        description: 'Business cards, letterheads, and office stationery.',
        longDescription: 'Professional stationery design and printing for business cards, letterheads, envelopes, and compliments slips.',
        features: ['Business Card Design', 'Letterhead', 'Email Signature', 'Print-Ready Files'],
        pricing: { basic: '$100', standard: '$180', premium: '$300' },
        deliveryTime: '3 Days',
        // galleryFolderId: 'YOUR_FOLDER_ID_HERE'
      },
      {
        id: 'flyers-leaflets',
        title: 'Flyers & Leaflets',
        description: 'Design and printing for flyers and leaflets.',
        longDescription: 'High-impact marketing materials for letterbox drops, events, and in-store promotions.',
        features: ['Single/Double Sided', 'High-Res Print Files', 'A4/A5/DL Sizes', 'Unlimited Revisions'],
        pricing: { basic: '$90', standard: '$160', premium: '$250' },
        deliveryTime: '3 Days',
        // galleryFolderId: 'YOUR_FOLDER_ID_HERE'
      },
      {
        id: 'brochures-catalogs',
        title: 'Brochures & Catalogs',
        description: 'Multi-page booklets, corporate profiles, and catalogs.',
        longDescription: 'Structured layouts for brochures and catalogs that showcase your products effectively.',
        features: ['Bi-Fold/Tri-Fold', 'Booklet Layout', 'Photo Editing', 'Print & Digital PDF'],
        pricing: { basic: '$200', standard: '$400', premium: '$800+' },
        deliveryTime: '7-14 Days',
        // galleryFolderId: 'YOUR_FOLDER_ID_HERE'
      },
      {
        id: 'posters-signage',
        title: 'Posters & Signage',
        description: 'Large format banners, shopfronts, and A-frames.',
        longDescription: 'Large-scale print design for shopfronts, pull-up banners, A-frames, billboards, and exhibition displays.',
        features: ['Vector Scalability', 'Large Format Ready', 'Shopfront Graphics', 'Pull-up Banners'],
        pricing: { basic: '$120', standard: '$220', premium: '$400' },
        deliveryTime: '4 Days',
        // galleryFolderId: 'YOUR_FOLDER_ID_HERE'
      },
      {
        id: 'packaging-merch',
        title: 'Packaging & Merchandise',
        description: 'Labels, promotional items, T-shirts, and wraps.',
        longDescription: 'Custom designs for product packaging, labels, and promotional merchandise like T-shirts, caps, and DVD wraps.',
        features: ['Dieline Creation', '3D Mockup', 'Print-Ready Art', 'Label Design'],
        pricing: { basic: '$150', standard: '$300', premium: '$600' },
        deliveryTime: '7 Days',
        // galleryFolderId: 'YOUR_FOLDER_ID_HERE'
      },
      {
        id: 'print-publishing',
        title: 'Menus & Publishing',
        description: 'Restaurant menus, magazines, calendars, and folders.',
        longDescription: 'Specialized layouts for hospitality menus, corporate presentation folders, magazines, and calendars.',
        features: ['Menu Layout', 'Magazine Spreads', 'Presentation Folders', 'Source Files'],
        pricing: { basic: '$100', standard: '$200', premium: '$400' },
        deliveryTime: '5 Days',
        // galleryFolderId: 'YOUR_FOLDER_ID_HERE'
      }
    ]
  },
  {
    id: 'web-digital-services',
    title: 'Web / Digital Services',
    description: 'Websites, e-commerce, SEO, and digital marketing.',
    icon: Monitor,
    services: [
      {
        id: 'web-design-dev',
        title: 'Web Design & Development',
        description: 'CMS-based, HTML/CSS, and responsive sites.',
        longDescription: 'Complete web design and development services including custom HTML/CSS and CMS platforms like WordPress.',
        features: ['Custom UI/UX', 'Mobile Responsive', 'CMS Integration', 'Contact Forms'],
        pricing: { basic: '$800', standard: '$1800', premium: '$3500' },
        deliveryTime: '14-21 Days',
        // galleryFolderId: 'YOUR_FOLDER_ID_HERE'
      },
      {
        id: 'ecommerce-stores',
        title: 'E-commerce / Online Stores',
        description: 'Shop setup, customization, and payment integration.',
        longDescription: 'Full e-commerce solutions including shop setup, product population, payment gateway integration, and shipping configuration.',
        features: ['Shopify/WooCommerce', 'Payment Setup', 'Product Upload', 'Sales Dashboard'],
        pricing: { basic: '$1500', standard: '$2800', premium: '$5000' },
        deliveryTime: '21-30 Days',
        // galleryFolderId: 'YOUR_FOLDER_ID_HERE'
      },
      {
        id: 'web-maintenance',
        title: 'Website Maintenance',
        description: 'Updates, security, backups, and optimization.',
        longDescription: 'Ongoing website care including software updates, security patches, regular backups, and performance optimization.',
        features: ['Weekly Backups', 'Security Monitoring', 'Plugin Updates', 'Uptime Checks'],
        pricing: { basic: '$50/mo', standard: '$100/mo', premium: '$200/mo' },
        deliveryTime: 'Monthly'
      },
      {
        id: 'seo-services',
        title: 'SEO Services',
        description: 'Search Engine Optimization to increase visibility.',
        longDescription: 'Improve your google ranking with technical SEO, keyword research, on-page optimization, and local SEO strategies.',
        features: ['Keyword Research', 'On-Page SEO', 'Google My Business', 'Performance Report'],
        pricing: { basic: '$400/mo', standard: '$800/mo', premium: '$1500/mo' },
        deliveryTime: 'Monthly'
      },
      {
        id: 'hosting-domains',
        title: 'Web Hosting & Domains',
        description: 'Secure hosting and domain name registration.',
        longDescription: 'Reliable web hosting services and domain name management to keep your site online and secure.',
        features: ['SSL Certificate', 'Domain Setup', 'Email Hosting', '99.9% Uptime'],
        pricing: { basic: '$15/mo', standard: '$30/mo', premium: '$60/mo' },
        deliveryTime: '24 Hours'
      },
      {
        id: 'social-media',
        title: 'Social Media Marketing',
        description: 'Management and content for social platforms.',
        longDescription: 'Strategic social media management to grow your audience on platforms like Facebook, Instagram, and LinkedIn.',
        features: ['Content Calendar', 'Graphic Design', 'Caption Writing', 'Scheduling'],
        pricing: { basic: '$500/mo', standard: '$900/mo', premium: '$1600/mo' },
        deliveryTime: 'Monthly',
        // galleryFolderId: 'YOUR_FOLDER_ID_HERE'
      },
      {
        id: 'email-marketing',
        title: 'Email Marketing',
        description: 'Newsletters and automated email campaigns.',
        longDescription: 'Direct marketing services including newsletter design, list management, and automated email flows.',
        features: ['Template Design', 'Copywriting', 'List Management', 'Automation Setup'],
        pricing: { basic: '$200', standard: '$400', premium: '$800' },
        deliveryTime: '5 Days'
      },
      {
        id: 'web-addons',
        title: 'Web Add-ons',
        description: 'Graphics, banners, custom design, and enhancements.',
        longDescription: 'Small scale web updates including banners, sidebar graphics, pop-ups, and functionality enhancements.',
        features: ['Web Banners', 'Bug Fixes', 'Speed Tweaks', 'Custom CSS'],
        pricing: { basic: '$50', standard: '$100', premium: '$200' },
        deliveryTime: '2 Days'
      }
    ]
  },
  {
    id: 'video-animation',
    title: 'Video & Animation',
    description: 'Explainer videos, logo animation, and marketing.',
    icon: Video,
    services: [
      {
        id: 'video-marketing',
        title: 'Marketing & Explainer Videos',
        description: 'Engaging videos for marketing and product explanation.',
        longDescription: 'Professional video production for marketing campaigns, including animated explainer videos and promotional shorts.',
        features: ['Scriptwriting', 'Animation', 'Voiceover', 'Background Music'],
        pricing: { basic: '$300', standard: '$600', premium: '$1200' },
        deliveryTime: '7-10 Days',
        // galleryFolderId: 'YOUR_FOLDER_ID_HERE'
      },
      {
        id: 'logo-animation',
        title: 'Logo Animation',
        description: 'Custom animated logos for intros and outros.',
        longDescription: 'Bring your brand to life with a dynamic logo animation suitable for video intros, websites, and social media.',
        features: ['Sound Design', '4K Output', 'Transparent Background', 'Loopable'],
        pricing: { basic: '$100', standard: '$200', premium: '$350' },
        deliveryTime: '3 Days',
        // galleryFolderId: 'YOUR_FOLDER_ID_HERE'
      }
    ]
  }
];