// Utility functions for cookie-based authentication checking

/**
 * Get a cookie value by name
 * @param name - The name of the cookie
 * @returns The cookie value or null if not found
 */
export const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  
  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(';').shift();
    return cookieValue || null;
  }
  
  return null;
};

/**
 * Check if user is authenticated by verifying the presence of a valid token cookie
 * @returns true if token cookie exists, false otherwise
 */
export const isAuthenticatedViaCookie = (): boolean => {
  const token = getCookie('token');
  return !!token && token.trim() !== '';
};

/**
 * Check if a JWT token is expired (basic check without verification)
 * @param token - The JWT token string
 * @returns true if token appears expired, false otherwise
 */
export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch {
    return true; // If we can't parse it, consider it expired
  }
};

/**
 * Get authentication status with more detailed checking
 * @returns object with isAuthenticated boolean and additional info
 */
export const getAuthStatus = () => {
  const token = getCookie('token');
  
  if (!token || token.trim() === '') {
    return { isAuthenticated: false, reason: 'no_token' };
  }
  
  if (isTokenExpired(token)) {
    return { isAuthenticated: false, reason: 'token_expired' };
  }
  
  return { isAuthenticated: true, reason: 'valid_token' };
};

// Event-driven cookie change detection
type CookieChangeCallback = (isAuthenticated: boolean) => void;
let cookieChangeCallbacks: CookieChangeCallback[] = [];
let lastAuthState: boolean | null = null;

/**
 * Subscribe to authentication state changes
 * @param callback - Function to call when auth state changes
 * @returns Unsubscribe function
 */
export const subscribeToAuthChanges = (callback: CookieChangeCallback) => {
  cookieChangeCallbacks.push(callback);
  
  // Return unsubscribe function
  return () => {
    cookieChangeCallbacks = cookieChangeCallbacks.filter(cb => cb !== callback);
  };
};

/**
 * Check for auth changes and notify subscribers
 */
const checkAuthChanges = () => {
  const currentAuthState = isAuthenticatedViaCookie();
  
  if (lastAuthState !== currentAuthState) {
    lastAuthState = currentAuthState;
    cookieChangeCallbacks.forEach(callback => callback(currentAuthState));
  }
};

/**
 * Setup event-driven cookie monitoring
 */
export const setupCookieMonitoring = () => {
  if (typeof window === 'undefined') return () => {};
  
  // Initial check
  lastAuthState = isAuthenticatedViaCookie();
  
  // Check on window focus (user might have logged out in another tab)
  const handleFocus = () => checkAuthChanges();
  
  // Check on page visibility change
  const handleVisibilityChange = () => {
    if (!document.hidden) {
      checkAuthChanges();
    }
  };
  
  // Setup storage event listener for cross-tab communication
  const handleStorageChange = (e: StorageEvent) => {
    if (e.key === 'auth_change') {
      checkAuthChanges();
    }
  };
  
  // Add event listeners
  window.addEventListener('focus', handleFocus);
  document.addEventListener('visibilitychange', handleVisibilityChange);
  window.addEventListener('storage', handleStorageChange);
  
  // Return cleanup function
  return () => {
    window.removeEventListener('focus', handleFocus);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    window.removeEventListener('storage', handleStorageChange);
    cookieChangeCallbacks = [];
  };
};

/**
 * Trigger auth change notification across tabs
 */
export const notifyAuthChange = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    // Use localStorage to communicate across tabs
    localStorage.setItem('auth_change', Date.now().toString());
    localStorage.removeItem('auth_change');
  }
  
  // Check immediately in current tab
  checkAuthChanges();
};
