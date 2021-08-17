export type ApiData = [FastData[], SlowData[]];

export type FastData = {
  windSpeed: number;
  windDirection: number;
};

export type SlowData = {
  bme680Gas: number;
  bme680Humidity: number;
  bme680Pressure: number;
  bme680Temperature: number;
  rainfall: number;
};
