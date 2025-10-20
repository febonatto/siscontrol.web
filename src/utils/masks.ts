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
  if (!value) return '';

  // Detecta se é negativo
  const isNegative = value.trim().startsWith('-');

  // Remove tudo que não é dígito
  const onlyDigitsValue = value.replace(/\D/g, '');

  // 🔹 Se o usuário apagou tudo, retorna vazio
  if (!onlyDigitsValue.length) return isNegative ? '-' : '';

  // Limita o tamanho e cria o número base
  const nextValue = onlyDigitsValue.substring(0, 10);

  // Converte pra float considerando 2 casas decimais
  const floatValue = onlyConvertion
    ? parseFloat(nextValue)
    : parseFloat(nextValue) / 100;

  // Aplica o sinal negativo se existir
  const finalValue = isNegative ? -floatValue : floatValue;

  return finalValue.toLocaleString('pt-BR', {
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
