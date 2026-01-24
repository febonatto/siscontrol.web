export function phoneMask(value: string | null): string {
  if (!value) {
    return '';
  }

  return value
    .replace(/^(\d{2})(\d)/, '($1) $2')
    .replace(/^\((\d{2})\)\s(\d{1})(\d)/, '($1) $2 $3')
    .replace(/^\((\d{2})\)\s(\d{1})\s(\d{4})(\d)/, '($1) $2 $3-$4');
}

export function zipCodeMask(value: string | null): string {
  if (!value) {
    return '';
  }

  return value.replace(/^(\d{5})(\d)/, '$1-$2');
}

export function cnpjMask(value: string | null): string {
  if (!value) {
    return '';
  }

  return value
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/^(\d{2})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3/$4')
    .replace(/^(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})(\d)/, '$1.$2.$3/$4-$5');
}
