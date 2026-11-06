import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { ApiError } from '@/types/api';
import { Loader2 } from 'lucide-react';

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
  // GSI loaded indicator
  const [, setIsGsiLoaded] = useState(false);

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '1081977717462-paycore-google-oauth.apps.googleusercontent.com';

  const handleCredentialResponse = useCallback(
    async (response: GoogleCredentialResponse) => {
      if (!response.credential) {
        onError?.('Google authentication failed: No credential received from Google.');
        return;
      }

      setIsAuthenticating(true);
      try {
        const authData = await loginWithGoogle(response.credential);

        if (onSuccess) {
          onSuccess();
          return;
        }

        const roles = authData.user.roles || [];
        if (roles.includes('ROLE_ADMIN')) {
          navigate('/admin/dashboard', { replace: true });
        } else {
          navigate('/merchant/dashboard', { replace: true });
        }
      } catch (err: unknown) {
        const apiErr = err as ApiError;
        const msg = apiErr.message || 'Google authentication could not be completed. Please try again.';
        onError?.(msg);
      } finally {
        setIsAuthenticating(false);
      }
    },
    [loginWithGoogle, navigate, onSuccess, onError]
  );

  useEffect(() => {
    // Check if Google GSI script is loaded
    const checkGsi = () => {
      if (window.google?.accounts?.id) {
        setIsGsiLoaded(true);
        try {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: handleCredentialResponse,
            cancel_on_tap_outside: true,
          });

          // Render hidden or visible Google button inside container if desired
          if (googleBtnContainerRef.current) {
            window.google.accounts.id.renderButton(googleBtnContainerRef.current, {
              type: 'standard',
              theme: 'outline',
              size: 'large',
              text: 'continue_with',
              shape: 'rectangular',
              width: 320,
              logo_alignment: 'left',
            });
          }
        } catch (e) {
          console.warn('Google GSI initialization warning:', e);
        }
      }
    };

    checkGsi();
    const timer = setInterval(() => {
      if (window.google?.accounts?.id) {
        checkGsi();
        clearInterval(timer);
      }
    }, 300);

    return () => clearInterval(timer);
  }, [clientId, handleCredentialResponse]);

  const handleCustomButtonClick = () => {
    if (disabled || isAuthenticating) return;

    if (window.google?.accounts?.id) {
      // Trigger Google account selector prompt
      try {
        window.google.accounts.id.prompt((notification) => {
          // If prompt was dismissed or failed to display, trigger child button click if present
          if (notification && googleBtnContainerRef.current) {
            const innerBtn = googleBtnContainerRef.current.querySelector('div[role="button"]') as HTMLElement;
            if (innerBtn) innerBtn.click();
          }
        });
      } catch {
        if (googleBtnContainerRef.current) {
          const innerBtn = googleBtnContainerRef.current.querySelector('div[role="button"]') as HTMLElement;
          if (innerBtn) innerBtn.click();
        }
      }
    } else {
      onError?.('Google Sign-In is initializing or blocked by an ad-blocker. Please check your browser extensions.');
    }
  };

  return (
    <div className="w-full relative">
      {/* Fallback hidden Google render container */}
      <div ref={googleBtnContainerRef} className="hidden" aria-hidden="true" />

      <button
        type="button"
        onClick={handleCustomButtonClick}
        disabled={disabled || isAuthenticating}
        className={`w-full flex items-center justify-center space-x-3 py-2.5 px-4 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-all shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      >
        {isAuthenticating ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
            <span>Authenticating with Google...</span>
          </>
        ) : (
          <>
            {/* Official Google 'G' Vector Icon */}
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
    </div>
  );
};
