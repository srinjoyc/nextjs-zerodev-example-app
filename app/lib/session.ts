export interface ProviderSession {
  provider: string;
  providerHref: string;
  address: string;
  displayName: string;
}

const KEY = "wallet_demo_session";

export function getSession(): ProviderSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as ProviderSession) : null;
  } catch {
    return null;
  }
}

export function setSession(session: ProviderSession): void {
  localStorage.setItem(KEY, JSON.stringify(session));
}

export function clearSession(): void {
  localStorage.removeItem(KEY);
}
