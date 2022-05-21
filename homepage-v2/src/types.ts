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
  createdAt: string;
};

export type GreenhouseData = {
  sht20Temperature: number;
  sht20Humidity: number;
  doorSensor: boolean;
  createdAt: string;
}
