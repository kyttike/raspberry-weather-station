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

  console.log([fastData, slowData]);

  const { bme680Temperature, bme680Pressure, bme680Gas, bme680Humidity } =
    slowData[0];
  const temperature = roundWithDecimalPlaces(bme680Temperature, 1);
  const pressure = roundWithDecimalPlaces(bme680Pressure, 1);
  const humidity = roundWithDecimalPlaces(bme680Humidity, 1);
  const gas = roundWithDecimalPlaces(bme680Gas, 1);

  return (
    <div className="flex">
      <Card>
        <p>Temperatuur: {temperature} °C</p>
        <p>Õhurõhk: {pressure} hPa  </p>
        <p>Õhuniiskus: {humidity}%</p>
        <p>Gaasinäitaja: {gas}</p>
      </Card>
    </div>
  );
};

export default CurrentWeather;
