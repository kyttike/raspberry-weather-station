import React, { useEffect, useState } from 'react';
import { getApiUrl } from '../../utils';
import Highcharts from 'highcharts';
import { GreenhouseData } from '../../types';
import HighchartsReact from 'highcharts-react-official';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThermometerHalf, faTint } from '@fortawesome/free-solid-svg-icons';

const round = (input: number) => Math.round(input * 10) / 10;

const smoothLine = (data: any[]) => {
  let i = data.length,
    sum,
    value;

  while (i--) {
    data[i].value = value = data[i].y;
    sum = (data[i - 1] || data[i]).y + value + (data[i + 1] || data[i]).y;
    data[i].y = Math.max(value - 0.5, Math.min(sum / 3, value + 0.5));
  }

  return data;
};

const Greenhouse = () => {
  const [data, setData] = useState<GreenhouseData[] | null>(null);
  const [options, setOptions] = useState<Highcharts.Options>({});

  useEffect(() => {
    const fetchData = async () => {
      const apiData = await fetch(getApiUrl('/api/greenhouse')).then((res) =>
        res.json(),
      );
      setData(apiData);
      console.log(apiData);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!data) {
      return;
    }

    setOptions({
      xAxis: [
        {
          type: 'datetime',
          tickInterval: 2 * 36e5,
          minorTickInterval: 36e5,
          tickLength: 0,
          gridLineWidth: 1,
          gridLineColor: 'rgba(128, 128, 128, 0.1)',
          startOnTick: false,
          endOnTick: false,
          minPadding: 0,
          maxPadding: 0,
          offset: 30,
          showLastLabel: true,
          labels: {
            format: '{value:%H}',
          },
          crosshair: true,
        },
        {
          linkedTo: 0,
          type: 'datetime',
          tickInterval: 24 * 3600 * 1000,
          labels: {
            format:
              '{value:<span style="font-size: 12px; font-weight: bold">%A</span>, %e. %B}',
            align: 'left',
            x: 3,
            y: -5,
          },
          opposite: true,
          tickLength: 20,
          gridLineWidth: 1,
        },
      ],

      yAxis: [
        {
          title: {
            text: 'Temperatuur',
          },
          labels: {
            format: '{value}°',
            style: {
              fontSize: '10px',
            },
            x: -3,
          },
          plotLines: [
            {
              value: 0,
              color: '#BBBBBB',
              width: 1,
              zIndex: 2,
            },
          ],
          maxPadding: 0.3,
          minRange: 8,
          tickInterval: 1,
          gridLineColor: 'rgba(128, 128, 128, 0.1)',
        },
        {
          title: {
            text: 'Niiskus',
          },
          labels: {
            format: '{value}%',
            style: {
              fontSize: '10px',
            },
            x: -3,
          },
          plotLines: [
            {
              value: 0,
              color: '#BBBBBB',
              width: 1,
              zIndex: 2,
            },
          ],
          maxPadding: 0.3,
          minRange: 8,
          tickInterval: 1,
          gridLineColor: 'rgba(128, 128, 128, 0.1)',
          opposite: true,
        },
      ],

      tooltip: {
        shared: true,
      },

      legend: {
        enabled: false,
      },

      plotOptions: {
        series: {
          pointPlacement: 'on',
        },
      },

      title: {
        text: '',
      },

      time: {
        useUTC: false,
      },

      series: [
        {
          name: 'Temperatuur',
          type: 'spline',
          data: smoothLine(
            data.map((datum) => ({
              x: new Date(datum.createdAt),
              y: round(datum.sht20Temperature),
            })),
          ),
          marker: {
            enabled: false,
            states: {
              hover: {
                enabled: true,
              },
            },
          },
          tooltip: {
            pointFormat:
              '<span style="color:{point.color}">\u25CF</span> ' +
              '{series.name}: <b>{point.value}°C</b><br/>',
          },
          zIndex: 1,
          color: '#FF3333',
          negativeColor: '#48AFE8',
          turboThreshold: 1500,
        },
        {
          name: 'Niiskus',
          type: 'spline',
          data: smoothLine(
            data.map((datum) => ({
              x: new Date(datum.createdAt),
              y: round(datum.sht20Humidity),
            })),
          ),
          marker: {
            enabled: false,
            states: {
              hover: {
                enabled: true,
              },
            },
          },
          tooltip: {
            pointFormat:
              '<span style="color:{point.color}">\u25CF</span> ' +
              '{series.name}: <b>{point.value}°%</b><br/>',
          },
          zIndex: 0,
          color: '#cab5ff',
          turboThreshold: 1500,
          dashStyle: 'ShortDot',
          yAxis: 1,
        },
      ],
    });
  }, [data]);

  if (!data || !options.series) {
    return <div className="h-48">Laeb...</div>;
  }

  const lastDataPoint = data[data.length - 1];

  return (
    <div>
      <div>
        <p>
          <span className={'inline-block w-6 mr-1'}>
            <FontAwesomeIcon
              className={'float-right'}
              icon={faThermometerHalf}
            />
          </span>
          <span>{round(lastDataPoint.sht20Temperature)}°</span>
        </p>
        <p>
          <span className={'inline-block w-6 mr-1'}>
            <FontAwesomeIcon className={'float-right'} icon={faTint} />
          </span>
          {round(lastDataPoint.sht20Humidity)}%
        </p>
        <p>{lastDataPoint.doorSensor ? 'Uks on lahti' : 'Uks on kinni'}</p>
      </div>
      <HighchartsReact highcharts={Highcharts} options={options} />;
    </div>
  );
};

export default Greenhouse;
