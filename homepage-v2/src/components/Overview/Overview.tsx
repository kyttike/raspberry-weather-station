import React, { useEffect, useState } from 'react';
import CurrentWeather from './CurrentWeather';
import { ApiData } from '../../types';
import WeatherGraph from './WeatherGraph';
import Card from '../../ui/Card';
import ToggleButton from '../../ui/ToggleButton';
import { getApiUrl } from '../../utils';
import Greenhouse from '../Greenhouse/Greenhouse';

const Overview = () => {
  const [data, setData] = useState<ApiData>([[], []]);
  const [tab, setTab] = useState<'current' | 'forecast' | 'greenhouse'>(
    'current',
  );
  const [showGreenhouse, setShowGreenhouse] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const apiData = await fetch(getApiUrl('/api/data')).then((res) =>
        res.json(),
      );
      setData(apiData);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (typeof url.searchParams.get('kasvuhoone') === 'string') {
      setShowGreenhouse(true);
    }
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
            {showGreenhouse && (
              <ToggleButton
                onClick={() => setTab('greenhouse')}
                isActive={tab === 'greenhouse'}
              >
                Kasvuhoone
              </ToggleButton>
            )}
          </div>
        </div>
        {tab === 'current' && (
          <div className={'flex justify-center'}>
            <div className={'max-w-screen-lg w-full'}>
              <WeatherGraph data={data} />
            </div>
          </div>
        )}
        {tab === 'forecast' && (
          <div
            className={
              'flex md:justify-center overflow-x-scroll md:overflow-auto'
            }
          >
            <div style={{ minWidth: '700px' }}>
              <img src="https://www.yr.no/en/content/2-587739/meteogram.svg" />
            </div>
          </div>
        )}
        {tab === 'greenhouse' && <Greenhouse />}
      </Card>
    </>
  );
};

export default Overview;
