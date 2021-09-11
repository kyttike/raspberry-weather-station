import React from 'react';
import Card from '../../ui/Card';
import { ApiData } from '../../types';
import { roundWithDecimalPlaces } from '../../utils';

type Props = {
  data: ApiData;
};

const CurrentWeather = ({ data: [fastData, slowData] }: Props) => {
  if (slowData.length === 0) {
    return null;
  }

  const data = [...slowData].reverse();
  const windData = [...fastData].reverse();

  const { bme680Temperature, bme680Pressure, bme680Humidity } = data[0];
  const temperature = roundWithDecimalPlaces(bme680Temperature, 1);
  const pressure = roundWithDecimalPlaces(bme680Pressure, 1);
  const humidity = roundWithDecimalPlaces(bme680Humidity, 1);

  let rain = 0;
  for (let i = 0; i < data.length; i++) {
    const datum = data[i];
    rain = rain + datum.rainfall;
  }
  rain = Math.round(rain * 10) / 10;

  let windSpeed = 0;
  for (let i = 0; i < Math.min(windData.length, 10); i++) {
    windSpeed += windData[i].windSpeed * 0.4;
  }
  windSpeed = Math.round(windSpeed * 10) / 10;

  return (
    <div className="flex">
      <Card>
        <p>Temperatuur: {temperature} °C</p>
        <p>Õhurõhk: {pressure} hPa</p>
        <p>Õhuniiskus: {humidity}%</p>
        <p>Tuule kiirus: {windSpeed} m/s</p>
        <p>24h sademed: {rain} mm</p>
      </Card>
    </div>
  );
};

export default CurrentWeather;
