import React from 'react';
import CurrentWeather from './CurrentWeather';
import WeatherGraph from './WeatherGraph';

const Overview = () => {
  return (
    <>
      <CurrentWeather />
      <WeatherGraph />
    </>
  );
};

export default Overview;
