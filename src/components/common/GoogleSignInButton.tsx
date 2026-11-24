import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { ApiError } from '@/types/api';
import { Loader2, AlertCircle } from 'lucide-react';

interface GoogleSignInButtonProps {
  onSuccess?: () => void;
  onError?: (errorMessage: string) => void;
  className?: string;
  disabled?: boolean;
}

export const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
  onSuccess,
  onError,
  className = '',
  disabled = false,
}) => {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const googleBtnContainerRef = useRef<HTMLDivElement>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [gsiRendered, setGsiRendered] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);

  // Read Google Web Client ID from environment or fallback to registered development client
  const clientId =
    import.meta.env.VITE_GOOGLE_CLIENT_ID ||
    '1081977717462-paycore-google-oauth.apps.googleusercontent.com';

  const isConfiguredClient =
    Boolean(clientId) && !clientId.includes('paycore-google-oauth');

  const handleCredentialResponse = useCallback(
    async (response: GoogleCredentialResponse) => {
      if (!response || !response.credential) {
        const errMsg = 'Google authentication was cancelled or returned an empty credential.';
        onError?.(errMsg);
        return;
      }

      setIsAuthenticating(true);
      try {
        const authData = await loginWithGoogle(response.credential);

        if (onSuccess) {
          onSuccess();
          return;
        }

        const roles = authData.user?.roles || [];
        if (roles.includes('ROLE_ADMIN')) {
          navigate('/admin/dashboard', { replace: true });
        } else {
          navigate('/merchant/dashboard', { replace: true });
        }
      } catch (err: unknown) {
        const apiErr = err as ApiError;
        const msg = apiErr.message || 'Google authentication could not be completed. Please check your credentials.';
        onError?.(msg);
      } finally {
        setIsAuthenticating(false);
      }
    },
    [loginWithGoogle, navigate, onSuccess, onError]
  );

  useEffect(() => {
    let isMounted = true;

    const setupGoogleGsi = () => {
      if (typeof window === 'undefined' || !window.google?.accounts?.id) {
        return false;
      }

      try {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (resp: GoogleCredentialResponse) => {
            if (isMounted) {
              handleCredentialResponse(resp);
            }
          },
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        if (googleBtnContainerRef.current) {
          googleBtnContainerRef.current.innerHTML = '';
          window.google.accounts.id.renderButton(googleBtnContainerRef.current, {
            type: 'standard',
            theme: 'outline',
            size: 'large',
            text: 'continue_with',
            shape: 'rectangular',
            width: 320,
            logo_alignment: 'left',
          });
          setGsiRendered(true);
        }
        return true;
      } catch (err) {
        console.warn('Google Identity Services initialization warning:', err);
        return false;
      }
    };

    if (!setupGoogleGsi()) {
      // Poll briefly if script is still loading async from index.html
      const interval = setInterval(() => {
        if (setupGoogleGsi()) {
          clearInterval(interval);
        }
      }, 250);

      const timeout = setTimeout(() => {
        clearInterval(interval);
      }, 4000);

      return () => {
        isMounted = false;
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }

    return () => {
      isMounted = false;
    };
  }, [clientId, handleCredentialResponse]);

  const handleManualFallbackClick = async () => {
    if (disabled || isAuthenticating) return;

    if (isConfiguredClient && window.google?.accounts?.id) {
      try {
        window.google.accounts.id.prompt((notification: unknown) => {
          const notif = notification as { isNotDisplayed?: () => boolean; isSkippedMoment?: () => boolean } | null | undefined;
          if (notif?.isNotDisplayed?.() || notif?.isSkippedMoment?.()) {
            setInitError(
              'Google account selector was not shown by the browser. Verify popups and third-party cookies are allowed for localhost.'
            );
          }
        });
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Google sign-in error';
        onError?.(msg);
      }
    } else {
      setInitError(
        'Google Sign-In requires an active Google Cloud OAuth 2.0 Web Client ID. Please sign in using your email and password below, or configure VITE_GOOGLE_CLIENT_ID.'
      );
      onError?.(
        'Google Sign-In is not configured with a live Google Cloud Client ID. Please use your email and password to sign in.'
      );
    }
  };

  return (
    <div className={`w-full flex flex-col items-center ${className}`}>
      {initError && (
        <div className="w-full mb-3 p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-[11px] flex items-start space-x-2">
          <AlertCircle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
          <span>{initError}</span>
        </div>
      )}

      {/* Official Google GSI Render Container (Visible, fully interactive) */}
      <div
        ref={googleBtnContainerRef}
        className={`w-full flex justify-center min-h-[44px] ${gsiRendered ? 'block' : 'hidden'}`}
        aria-label="Continue with Google"
      />

      {/* Fallback button shown if GSI hasn't completed DOM rendering */}
      {!gsiRendered && (
        <button
          type="button"
          onClick={handleManualFallbackClick}
          disabled={disabled || isAuthenticating}
          className="w-full flex items-center justify-center space-x-3 py-2.5 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-2xs hover:shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAuthenticating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
              <span>Authenticating with Google...</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </>
          )}
        </button>
      )}
    </div>
  );
};
