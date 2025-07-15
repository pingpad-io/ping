export function formatNumber(num: number | null | undefined): string {
  if (num === null || num === undefined || isNaN(num)) {
    return '0';
  }

  const absNum = Math.abs(num);
  const sign = num < 0 ? '-' : '';

  if (absNum < 1000) {
    return sign + Math.floor(absNum).toString();
  }

  if (absNum < 1000000) {
    const thousands = absNum / 1000;
    return sign + thousands.toFixed(1).replace(/\.0$/, '') + 'k';
  }

  const millions = absNum / 1000000;
  return sign + millions.toFixed(1).replace(/\.0$/, '') + 'M';
}