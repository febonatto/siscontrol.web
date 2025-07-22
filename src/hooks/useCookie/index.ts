import { useCallback, useState } from 'react';
import { UpdateCookieParams, UseCookieProps } from './types';
import { getCookie, removeCookie, setCookie } from '@/utils/cookies';

export const useCookie = ({ key, initialValue = '' }: UseCookieProps) => {
  const [cookieValue, setCookieValue] = useState<string | null>(
    getCookie(key) || initialValue,
  );

  const updateCookie = useCallback(
    ({ value, durationInMinutes }: UpdateCookieParams) => {
      setCookie({ key, value, durationInMinutes });
      setCookieValue(value);
    },
    [key],
  );

  const deleteCookie = useCallback(() => {
    removeCookie(key);
    setCookieValue(null);
  }, [key]);

  return { cookie: cookieValue, updateCookie, deleteCookie };
};
