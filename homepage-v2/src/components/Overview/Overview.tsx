import React, { useEffect, useState } from 'react';
import CurrentWeather from './CurrentWeather';
import { ApiData } from '../../types';
import WeatherGraph from './WeatherGraph';
import Card from '../../ui/Card';
import ToggleButton from '../../ui/ToggleButton';

const Overview = () => {
  const [data, setData] = useState<ApiData>([[], []]);
  const [tab, setTab] = useState<'current' | 'forecast'>('current');

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
      <Card>
        <div className={'flex justify-center'}>
          <div
            className={'inline border-4 border-gray-100 rounded-lg bg-gray-100'}
          >
            <ToggleButton
              onClick={() => setTab('current')}
              isActive={tab === 'current'}
            >
              Reaalajas
            </ToggleButton>
            <ToggleButton
              onClick={() => setTab('forecast')}
              isActive={tab === 'forecast'}
            >
              Ennustus
            </ToggleButton>
          </div>
        </div>
        {tab === 'current' && <WeatherGraph data={data} />}
      </Card>
    </>
  );
};

export default Overview;
