import React, { useEffect, useRef } from 'react';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '../../lib/firebase';

interface CredentialResponse {
    credential: string;
    select_by?: string;
}

interface GoogleIdConfiguration {
    client_id: string;
    callback: (response: CredentialResponse) => void;
    auto_select?: boolean;
    cancel_on_tap_outside?: boolean;
    itp_support?: boolean;
    use_fedcm_for_prompt?: boolean;
    context?: 'signin' | 'signup' | 'use';
}

interface GsiButtonConfiguration {
    type?: 'standard' | 'icon';
    theme?: 'outline' | 'filled_blue' | 'filled_black';
    size?: 'large' | 'medium' | 'small';
    text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
    shape?: 'rectangular' | 'pill' | 'circle' | 'square';
    logo_alignment?: 'left' | 'center';
    width?: string | number;
}

declare global {
    interface Window {
        google?: {
            accounts: {
                id: {
                    initialize: (config: GoogleIdConfiguration) => void;
                    prompt: () => void;
                    renderButton: (parent: HTMLElement, options: GsiButtonConfiguration) => void;
                };
            };
        };
    }
}

const GSI_SCRIPT_ID = 'google-identity-services';
const GSI_SCRIPT_SRC = 'https://accounts.google.com/gsi/client';

const loadGsiScript = (): Promise<void> => {
    if (window.google?.accounts?.id) return Promise.resolve();

    const existing = document.getElementById(GSI_SCRIPT_ID) as HTMLScriptElement | null;
    if (existing) {
        return new Promise((resolve, reject) => {
            existing.addEventListener('load', () => resolve());
            existing.addEventListener('error', () => reject(new Error('Failed to load Google Identity Services')));
        });
    }

    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.id = GSI_SCRIPT_ID;
        script.src = GSI_SCRIPT_SRC;
        script.async = true;
        script.defer = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load Google Identity Services'));
        document.head.appendChild(script);
    });
};

interface GoogleOneTapProps {
    /** Called when Firebase sign-in via the Google credential fails. */
    onError?: (message: string) => void;
    /** Skip initializing/prompting (e.g. while auth state is still loading or a user is already signed in). */
    disabled?: boolean;
}

/**
 * Renders the standard Google Sign-In button and, alongside it, triggers the
 * One Tap prompt. Google requires a persistent button as a fallback because
 * One Tap can silently decline to display (per-browser cooldown after a
 * dismissal, unsupported browser, etc.) - see Google Identity Services docs.
 */
const GoogleOneTap: React.FC<GoogleOneTapProps> = ({ onError, disabled }) => {
    const buttonRef = useRef<HTMLDivElement>(null);
    const initialized = useRef(false);
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    useEffect(() => {
        if (!clientId || disabled) return;

        let cancelled = false;

        const handleCredential = async (response: CredentialResponse) => {
            try {
                const credential = GoogleAuthProvider.credential(response.credential);
                await signInWithCredential(auth, credential);
            } catch (err) {
                console.error('[GoogleOneTap] Sign-in failed:', err);
                onError?.('Google sign-in failed. Please try again or use email and password.');
            }
        };

        loadGsiScript()
            .then(() => {
                if (cancelled || !window.google?.accounts?.id) return;

                if (!initialized.current) {
                    window.google.accounts.id.initialize({
                        client_id: clientId,
                        callback: handleCredential,
                        auto_select: false,
                        cancel_on_tap_outside: true,
                        itp_support: true,
                        use_fedcm_for_prompt: true,
                    });
                    initialized.current = true;
                }

                if (buttonRef.current) {
                    buttonRef.current.innerHTML = '';
                    window.google.accounts.id.renderButton(buttonRef.current, {
                        type: 'standard',
                        theme: 'outline',
                        size: 'large',
                        text: 'signin_with',
                        shape: 'rectangular',
                        logo_alignment: 'left',
                        width: 320,
                    });
                }

                window.google.accounts.id.prompt();
            })
            .catch((err) => {
                console.error('[GoogleOneTap] Failed to load Google Identity Services:', err);
            });

        return () => {
            cancelled = true;
        };
    }, [clientId, disabled, onError]);

    if (!clientId) return null;

    return <div ref={buttonRef} className="flex justify-center" />;
};

export default GoogleOneTap;
