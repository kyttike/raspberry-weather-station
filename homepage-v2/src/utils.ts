export const roundWithDecimalPlaces = (
  input: number,
  numberOfDecimalPlaces: number,
) => {
  const factor = Math.pow(10, numberOfDecimalPlaces);
  return Math.round(input * factor) / factor;
};
