export interface Product {
    id: string;
    name: string;
    sku?: string;
    category: string;
    image: string;
    price: number;
    shortDescription: string;
    description: string;
    tags?: string[];
    /** External page where the product is bought or downloaded (marketplace, app store, etc.). */
    productUrl?: string;
    status?: 'active' | 'archived';
    createdAt?: any;
}

export type ShopCategoryId =
    | 'wordpress-themes'
    | 'wordpress-plugins'
    | 'shopify-themes'
    | 'shopify-apps'
    | 'others';

export interface ShopCategory {
    id: ShopCategoryId;
    label: string;
    description: string;
}

export const SHOP_CATEGORIES: ShopCategory[] = [
    {
        id: 'wordpress-themes',
        label: 'WordPress Themes',
        description: 'Fast, responsive WordPress themes ready to launch your site.',
    },
    {
        id: 'wordpress-plugins',
        label: 'WordPress Plugins',
        description: 'Plugins that add features and automation to WordPress.',
    },
    {
        id: 'shopify-themes',
        label: 'Shopify Themes',
        description: 'Conversion-focused Shopify themes for modern stores.',
    },
    {
        id: 'shopify-apps',
        label: 'Shopify Apps',
        description: 'Apps and plugins that extend what your Shopify store can do.',
    },
    {
        id: 'others',
        label: 'Others',
        description: 'Templates, tools and other digital products.',
    },
];

const CATEGORY_IDS = new Set<string>(SHOP_CATEGORIES.map(c => c.id));

/**
 * Maps a stored product category to a shop category id.
 * Accepts the ids above as well as free-text labels saved before the shop
 * had fixed categories (e.g. "WP Theme", "Shopify Plugin"). Anything that
 * does not match falls into "others".
 */
export const getShopCategoryId = (category?: string): ShopCategoryId => {
    const raw = (category || '').trim().toLowerCase();
    if (CATEGORY_IDS.has(raw)) return raw as ShopCategoryId;

    const isWordPress = /\b(wordpress|wp)\b/.test(raw);
    const isShopify = raw.includes('shopify');
    const isTheme = raw.includes('theme');
    const isPlugin = /plugin|app|extension/.test(raw);

    if (isWordPress && isTheme) return 'wordpress-themes';
    if (isWordPress && isPlugin) return 'wordpress-plugins';
    if (isShopify && isTheme) return 'shopify-themes';
    if (isShopify && isPlugin) return 'shopify-apps';
    return 'others';
};

export const getShopCategory = (category?: string): ShopCategory => {
    const id = getShopCategoryId(category);
    return SHOP_CATEGORIES.find(c => c.id === id)!;
};

/**
 * Cleans up an external product link. Adds https:// when no scheme is given
 * and rejects anything that is not http(s) (e.g. javascript: links).
 * Returns '' for empty or unsafe values.
 */
export const normalizeProductUrl = (url?: string): string => {
    const trimmed = (url || '').trim();
    if (!trimmed) return '';
    const withScheme = /^[a-z][a-z0-9+.-]*:/i.test(trimmed) ? trimmed : `https://${trimmed.replace(/^\/+/, '')}`;
    try {
        const parsed = new URL(withScheme);
        return parsed.protocol === 'http:' || parsed.protocol === 'https:' ? parsed.toString() : '';
    } catch {
        return '';
    }
};
