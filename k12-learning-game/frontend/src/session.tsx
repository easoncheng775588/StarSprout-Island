import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

const SESSION_STORAGE_KEY = 'k12-learning-game-session';

export interface SessionChildSummary {
  id: number;
  nickname: string;
  streakDays: number;
  totalStars: number;
  title: string;
  stageLabel?: string;
  avatarColor?: string;
}

interface SessionState {
  parentAccountId: number;
  parentDisplayName: string;
  childProfileId: number;
  childNickname: string;
  children: SessionChildSummary[];
}

interface SessionContextValue {
  isAuthenticated: boolean;
  session: SessionState | null;
  login: (nextSession: SessionState) => void;
  logout: () => void;
}

const SessionContext = createContext<SessionContextValue>({
  isAuthenticated: false,
  session: null,
  login: () => {},
  logout: () => {}
});

function readSessionState() {
  if (typeof window === 'undefined') {
    return null;
  }

  const rawValue = window.localStorage.getItem(SESSION_STORAGE_KEY);
  if (!rawValue) {
    return null;
  }

  if (rawValue === 'active') {
    return {
      parentAccountId: 1,
      parentDisplayName: '星星妈妈',
      childProfileId: 1,
      childNickname: '小星星',
      children: []
    };
  }

  try {
    const parsed = JSON.parse(rawValue) as Partial<SessionState>;
    if (
      typeof parsed.parentAccountId === 'number'
      && typeof parsed.parentDisplayName === 'string'
      && typeof parsed.childProfileId === 'number'
      && typeof parsed.childNickname === 'string'
      && Array.isArray(parsed.children)
    ) {
      return {
        parentAccountId: parsed.parentAccountId,
        parentDisplayName: parsed.parentDisplayName,
        childProfileId: parsed.childProfileId,
        childNickname: parsed.childNickname,
        children: parsed.children as SessionChildSummary[]
      };
    }

    if (typeof parsed.childProfileId === 'number' && typeof parsed.childNickname === 'string') {
      return {
        parentAccountId: 1,
        parentDisplayName: '星星妈妈',
        childProfileId: parsed.childProfileId,
        childNickname: parsed.childNickname,
        children: []
      };
    }
  } catch {
    return null;
  }

  return null;
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<SessionState | null>(readSessionState);

  const login = useCallback((nextSession: SessionState) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(nextSession));
    }

    setSession(nextSession);
  }, []);

  const logout = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(SESSION_STORAGE_KEY);
    }

    setSession(null);
  }, []);

  const value = useMemo(
    () => ({
      isAuthenticated: session !== null,
      session,
      login,
      logout
    }),
    [session, login, logout]
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  return useContext(SessionContext);
}
