// ADR-0064: the JWT is stored client-side in a non-httpOnly cookie (not
// localStorage) so it's readable both by browser JS (to attach the
// Authorization header) and by Next.js Server Components/proxy.ts (via
// `next/headers` cookies()/`request.cookies`, since those run server-side and
// can't reach localStorage). This is a deliberate tradeoff against the
// original httpOnly cookie's XSS protection — see ADR-0064 for the reasoning.
export const SESSION_TOKEN_COOKIE = "session_token";
const MAX_AGE_SECONDS = 30 * 24 * 60 * 60; // matches the JWT's own expiry (ADR-0054)
const SESSION_TOKEN_CHANGE_EVENT = "exam-taker:session-token-change";

export function getSessionToken(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${SESSION_TOKEN_COOKIE}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export function setSessionToken(token: string): void {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${SESSION_TOKEN_COOKIE}=${encodeURIComponent(token)}; Path=/; Max-Age=${MAX_AGE_SECONDS}; SameSite=Lax${secure}`;
  window.dispatchEvent(new Event(SESSION_TOKEN_CHANGE_EVENT));
}

export function clearSessionToken(): void {
  document.cookie = `${SESSION_TOKEN_COOKIE}=; Path=/; Max-Age=0`;
  window.dispatchEvent(new Event(SESSION_TOKEN_CHANGE_EVENT));
}

export function subscribeSessionToken(listener: () => void): () => void {
  window.addEventListener(SESSION_TOKEN_CHANGE_EVENT, listener);
  window.addEventListener("storage", listener);
  return () => {
    window.removeEventListener(SESSION_TOKEN_CHANGE_EVENT, listener);
    window.removeEventListener("storage", listener);
  };
}
