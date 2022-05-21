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
  sht20: {
    humidity?: number;
    temperature?: number;
  };
  door: number;
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
  sht20Humidity?: number;
  sht20Temperature?: number;
  doorSensor?: number;
  bme680Temperature?: number;
  bme680Pressure?: number;
  bme680Humidity?: number;
  bme680Gas?: number;
  rainfall?: number;
}

export type ApiData = [FastRaspberryDBEntry[], SlowRaspberryDBEntry[]];
