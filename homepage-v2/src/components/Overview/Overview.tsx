import React, { useEffect, useState } from 'react';
import CurrentWeather from './CurrentWeather';
import WeatherGraph from './WeatherGraph';
import { ApiData } from '../../types';
import TestGraph from './TestGraph';

const Overview = () => {
  const [data, setData] = useState<ApiData>([[], []]);

  useEffect(() => {
    const fetchData = async () => {
      const apiData = await fetch('api/data').then(
        (res) => res.json(),
      );
      setData(apiData);
    };
    fetchData();
  }, []);

  return (
    <>
      <CurrentWeather data={data} />
      <WeatherGraph data={data}/>
      <TestGraph data={data}/>
    </>
  );
};

export default Overview;
