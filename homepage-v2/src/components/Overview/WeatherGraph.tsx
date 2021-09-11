import React, { useMemo } from 'react';
import Card from '../../ui/Card';
import { ApiData, SlowData } from '../../types';
import { AxisOptions, Chart } from 'react-charts';

type Props = {
  data: ApiData;
};

const WeatherGraph = ({ data: [_, slowData] }: Props) => {
  const primaryAxis = useMemo(
    (): AxisOptions<SlowData> => ({
      getValue: (datum) => new Date(datum.createdAt),
    }),
    [slowData],
  );

  const secondaryAxes = useMemo(
    (): AxisOptions<SlowData>[] => [
      {
        getValue: (datum) => datum.bme680Temperature,
      },
    ],
    [slowData],
  );

  if (slowData.length === 0) {
    return <Card>...</Card>;
  }

  let filteredData = slowData.filter((_, i) => i % 15 === 0);

  return (
    <Card>
      <div className="h-48">

      <Chart
        options={{
          data: [
            {
              label: 'Temperature',
              data: filteredData,
            },
          ],
          primaryAxis,
          secondaryAxes,
        }}
      />
      </div>
    </Card>
  );
};

export default WeatherGraph;
