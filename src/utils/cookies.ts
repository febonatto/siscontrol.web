interface SetCookieProps {
  key: string;
  value: string;
  durationInMinutes: number;
}

export const getCookie = (key: string) => {
  return document.cookie.split('; ').find((cookie) => {
    const currentItem = cookie.split('=');
    const [storedKey, storedValue] = [currentItem[0], currentItem[1]];

    return storedKey === key ? decodeURIComponent(storedValue) : null;
  });
};

export const setCookie = ({
  key,
  value,
  durationInMinutes,
}: SetCookieProps) => {
  const now = new Date();
  now.setTime(now.getTime() + durationInMinutes * 60 * 1000);

  document.cookie = `${key}=${value}; expires=${now.toUTCString()}; path=/`;
};

export const removeCookie = (key: string) => {
  setCookie({ key, value: '', durationInMinutes: 0 });
};
