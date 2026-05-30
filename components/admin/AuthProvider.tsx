import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    /**
     * True only when the signed-in user is authorized to access the admin.
     * Authorization is granted via a Firebase custom claim (`admin === true`)
     * or, as a pragmatic fallback, an email allowlist (VITE_ADMIN_EMAILS).
     * The custom claim is the long-term enforcement mechanism and is what the
     * Firestore/Storage security rules require.
     */
    isAdmin: boolean;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Comma-separated email allowlist fallback (e.g. "a@x.com,b@y.com").
const getAdminEmailAllowlist = (): string[] =>
    (import.meta.env.VITE_ADMIN_EMAILS || '')
        .split(',')
        .map((email: string) => email.trim().toLowerCase())
        .filter((email: string) => email.length > 0);

const resolveIsAdmin = async (user: User): Promise<boolean> => {
    // Preferred: Firebase custom claim set via the Admin SDK.
    try {
        const tokenResult = await user.getIdTokenResult();
        if (tokenResult.claims.admin === true) {
            return true;
        }
    } catch (error) {
        console.error('[AuthProvider] Failed to read ID token claims:', error);
    }

    // Fallback: configurable email allowlist so the admin works before claims
    // are provisioned. Remove once custom claims are fully rolled out.
    const allowlist = getAdminEmailAllowlist();
    const email = user.email?.toLowerCase();
    return !!email && allowlist.includes(email);
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                const authorized = await resolveIsAdmin(currentUser);
                setUser(currentUser);
                setIsAdmin(authorized);
            } else {
                setUser(null);
                setIsAdmin(false);
            }
            setLoading(false);
        }, (error) => {
            console.error("[AuthProvider] Auth state change error:", error);
            setUser(null);
            setIsAdmin(false);
            setLoading(false);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    const logout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("[AuthProvider] Logout error:", error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, isAdmin, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
