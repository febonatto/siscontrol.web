export function transformCurrency(value?: string | null): string {
  return value ? parseFloat(value).toFixed(2) : '';
}
