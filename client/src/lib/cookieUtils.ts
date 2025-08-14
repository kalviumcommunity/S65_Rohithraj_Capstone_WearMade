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
