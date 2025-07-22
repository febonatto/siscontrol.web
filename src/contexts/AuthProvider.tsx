import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useState,
} from 'react';
import { jwtDecode } from 'jwt-decode';
import { useCookie } from '@/hooks/useCookie';
import { JWTToken } from '@/types';
import { COOKIE_KEYS } from '@/configs/app';
import { useQueryClient } from '@tanstack/react-query';

interface AuthProviderValue {
  auth: JWTToken | null;
  signIn: (accessToken: string) => void;
  signOut: () => void;
}

export const AuthContext = createContext<AuthProviderValue>(
  {} as AuthProviderValue,
);

const isTokenExpired = (exp: number) => {
  const currentTimestamp = Math.floor(Date.now() / 1000);
  return exp < currentTimestamp;
};

export const AuthProvider = ({ children }: PropsWithChildren<unknown>) => {
  const queryClient = useQueryClient();

  const { cookie, updateCookie, deleteCookie } = useCookie({
    key: COOKIE_KEYS.USER_TOKEN,
  });

  const [auth, setAuth] = useState(() => {
    const decodedToken = cookie ? (jwtDecode(cookie) as JWTToken) : null;

    if (!decodedToken) {
      return null;
    }

    if (isTokenExpired(decodedToken.exp)) {
      deleteCookie();
      return null;
    }

    return decodedToken;
  });

  const signIn = useCallback(
    (accessToken: string) => {
      updateCookie({ value: accessToken, durationInMinutes: 10080 });
      setAuth(jwtDecode(accessToken));
    },
    [updateCookie],
  );

  const signOut = useCallback(() => {
    deleteCookie();
    setAuth(null);
    queryClient.invalidateQueries();
  }, [deleteCookie]);

  return (
    <AuthContext.Provider value={{ auth, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within a AuthProvider');
  }

  return context;
};
