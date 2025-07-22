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

export function coinMask(
  value: string | null,
  onlyConvertion?: boolean,
): string {
  if (!value) {
    return '';
  }

  const valueAsNumber = Number(value);
  const isInteger = Number.isInteger(valueAsNumber);

  const onlyDigitsValue = value.replace(/\D/g, '');
  const shouldTransformEmpty = /^0+$/.test(onlyDigitsValue);

  if (!onlyDigitsValue || shouldTransformEmpty) {
    return '';
  }

  const nextValue = onlyDigitsValue.substring(0, 10);
  const floatValue =
    isInteger && onlyConvertion
      ? parseFloat(nextValue)
      : parseFloat(nextValue) / 100;

  return floatValue.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
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
