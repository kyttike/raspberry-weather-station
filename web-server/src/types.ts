export interface FastRaspberrySensorData {
  windDirection?: number;
  stateful: {
    windSpeed?: number;
  };
}

export interface SlowRaspberrySensorData {
  bme680: {
    humidity?: number;
    pressure?: number;
    temperature?: number;
    gas?: number;
  };
  stateful: {
    rain?: number;
  };
}

export interface FastRaspberryDBEntry {
  windDirection?: number;
  windSpeed?: number;
  createdAt: string;
}

export interface SlowRaspberryDBEntry {
  bme680Temperature?: number;
  bme680Pressure?: number;
  bme680Humidity?: number;
  bme680Gas?: number;
  rainfall?: number;
}