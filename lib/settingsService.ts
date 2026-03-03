export interface SiteSettings {
    siteName: string;
    adminEmail: string;
    logoUrl?: string;
    faviconUrl?: string;
    socialUrls?: {
        facebook?: string;
        twitter?: string;
        instagram?: string;
        linkedin?: string;
    };
}

export const STATIC_SITE_SETTINGS: SiteSettings = {
    siteName: 'wbify',
    adminEmail: 'admin@wbify.com',
    logoUrl: '',
    faviconUrl: '',
    socialUrls: {
        facebook: '',
        twitter: '',
        instagram: '',
        linkedin: ''
    }
};

export const getSiteSettings = async (): Promise<SiteSettings> => {
    return STATIC_SITE_SETTINGS;
};

export const updateSiteSettings = async (_settings: Partial<SiteSettings>): Promise<void> => {
    // Site settings are now static and no longer editable from the admin.
    return Promise.resolve();
};

export const subscribeToSiteSettings = (callback: (settings: SiteSettings) => void) => {
    callback(STATIC_SITE_SETTINGS);
    return () => {};
};
