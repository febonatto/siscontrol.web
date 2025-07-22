export interface UseCookieProps {
  key: string;
  initialValue?: string;
}

export interface UpdateCookieParams {
  value: string;
  durationInMinutes: number;
}
