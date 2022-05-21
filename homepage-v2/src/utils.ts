export const roundWithDecimalPlaces = (
  input: number,
  numberOfDecimalPlaces: number,
) => {
  const factor = Math.pow(10, numberOfDecimalPlaces);
  return Math.round(input * factor) / factor;
};

const API_BASE_URL = () =>
  // import.meta.env.PROD ? `${location.origin}` : 'http://127.0.0.1:3000';
  import.meta.env.PROD ? `${location.origin}` : 'https://värska.ee/';

export const getApiUrl = (path: string) => API_BASE_URL() + path;
