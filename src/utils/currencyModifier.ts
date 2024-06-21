export const roundNumber = function roundNumber(value: number, decimal: number) {
  const ePlusAny: any = 'e+';
  const eMinusAny: any = 'e-';
  return +(Math.round(value + ePlusAny + decimal) + eMinusAny + decimal);
};

export const numberToCurrency = function numberToCurrency(value: number): string {
  const rounded = roundNumber(value, 2);
  const strValue = rounded.toString();
  if (strValue.includes('.')) {
    const splitStr = strValue.split('.');
    let decimal = splitStr[1];
    if (decimal.length === 1) {
      decimal = `${decimal}0`;
    }
    return `${splitStr[0]}${decimal}`;
  } else {
    return `${value * 100}`;
  }
};

export const currencyToNumber = function currencyToNumber(currencyValue: string): number {
  return parseInt(currencyValue, 10) / 100;
};
