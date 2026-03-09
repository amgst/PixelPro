import { doc, getDoc, setDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';

export interface SiteSettings {
    siteName: string;
    adminEmail: string;
    logoUrl?: string;
    faviconUrl?: string;
    googleAnalyticsId?: string;
    googleTagManagerId?: string;
    googleSiteVerification?: string;
    socialUrls?: {
        facebook?: string;
        twitter?: string;
        instagram?: string;
        linkedin?: string;
    };
}

const SETTINGS_COLLECTION = 'settings';
const GENERAL_SETTINGS_DOC = 'general';
const DEFAULT_LOGO_URL = 'https://nbyomoqura0jkgxd.public.blob.vercel-storage.com/vgp%20logo%20horizontal.png';
const DEFAULT_GA4_ID = 'G-EB1Z519BGJ';
const LOCAL_SETTINGS_PATH = '/site-settings.json';

const getDefaultSettings = (): SiteSettings => ({
    siteName: 'Wbify',
    adminEmail: 'ahmed@vancegraphix.com.au',
    logoUrl: DEFAULT_LOGO_URL,
    googleAnalyticsId: DEFAULT_GA4_ID
});

const getLocalSiteName = async (): Promise<string> => {
    try {
        const response = await fetch(LOCAL_SETTINGS_PATH, { cache: 'no-store' });
        if (!response.ok) {
            return getDefaultSettings().siteName;
        }

        const data = (await response.json()) as Partial<SiteSettings>;
        return typeof data.siteName === 'string' && data.siteName.trim()
            ? data.siteName.trim()
            : getDefaultSettings().siteName;
    } catch {
        return getDefaultSettings().siteName;
    }
};

export const getSiteSettings = async (): Promise<SiteSettings> => {
    const localSiteName = await getLocalSiteName();
    const docRef = doc(db, SETTINGS_COLLECTION, GENERAL_SETTINGS_DOC);
    try {
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return {
                ...getDefaultSettings(),
                ...(docSnap.data() as SiteSettings),
                siteName: localSiteName
            };
        }
    } catch {
        // Fall back to local settings if Firebase is unavailable.
    }

    return {
        ...getDefaultSettings(),
        siteName: localSiteName
    };
};

export const updateSiteSettings = async (settings: Partial<SiteSettings>): Promise<void> => {
    const docRef = doc(db, SETTINGS_COLLECTION, GENERAL_SETTINGS_DOC);
    const { siteName: _siteName, ...settingsWithoutSiteName } = settings;
    
    // Check if doc exists first
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
        await updateDoc(docRef, settingsWithoutSiteName);
    } else {
        // Create if doesn't exist (merging with defaults)
        await setDoc(docRef, {
            ...getDefaultSettings(),
            ...settingsWithoutSiteName
        });
    }
};

export const subscribeToSiteSettings = (callback: (settings: SiteSettings) => void) => {
    const docRef = doc(db, SETTINGS_COLLECTION, GENERAL_SETTINGS_DOC);
    let unsubscribeFirestore = () => {};

    void getLocalSiteName().then((localSiteName) => {
        unsubscribeFirestore = onSnapshot(
            docRef,
            (doc) => {
                if (doc.exists()) {
                    callback({
                        ...getDefaultSettings(),
                        ...(doc.data() as SiteSettings),
                        siteName: localSiteName
                    });
                } else {
                    callback({
                        ...getDefaultSettings(),
                        siteName: localSiteName
                    });
                }
            },
            () => {
                callback({
                    ...getDefaultSettings(),
                    siteName: localSiteName
                });
            }
        );
    });

    return () => unsubscribeFirestore();
};
