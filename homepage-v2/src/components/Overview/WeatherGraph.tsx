import React, { useEffect, useState } from 'react';
import { ApiData, FastData, SlowData } from '../../types';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';

type Props = {
  data: ApiData;
};

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

const combineData = (fastData: FastData[], slowData: SlowData[]) => {
  return slowData.map((datum, i) => {
    const date = new Date(datum.createdAt);
    date.setMilliseconds(0);
    date.setSeconds(0);
    return {
      ...fastData[i],
      ...datum,
      date: date.valueOf(),
    };
  });
};

type Datum = ReturnType<typeof combineData>[0];

const WeatherGraph = ({ data: [fastData, slowData], data }: Props) => {
  const [options, setOptions] = useState<Highcharts.Options>({});

  useEffect(() => {
    const combinedData = combineData(fastData, slowData);

    const rainData = Object.values(
      combinedData.reduce(
        (
          acc: Record<
            string,
            {
              sum: number;
              date: number;
            }
          >,
          curr,
        ) => {
          let date = new Date(curr.date);
          const datumHourSegmentKey = `${date.getUTCDay()}-${date.getHours()}`;
          if (!acc[datumHourSegmentKey]) {
            date.setMinutes(0);
            acc[datumHourSegmentKey] = {
              sum: 0,
              date: date.valueOf(),
            };
          }

          acc[datumHourSegmentKey].sum += curr.rainfall;
          return acc;
        },
        {},
      ),
    ).map(({ sum, date }) => ({ x: date, y: Math.round(sum * 10) / 10 }));
    rainData.sort((a, b) => a.x - b.x);

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
            text: null, // Temperature
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
            text: null, // Precipitation
          },
          labels: {
            enabled: false,
          },
          gridLineWidth: 0,
          tickLength: 0,
          minRange: 10,
          min: 0,
        },
        {
          allowDecimals: false,
          title: {
            text: 'hPa',
            offset: 0,
            align: 'high',
            rotation: 0,
            style: {
              fontSize: '10px',
            },
            textAlign: 'left',
            x: 3,
          },
          labels: {
            style: {
              fontSize: '8px',
            },
            y: 2,
            x: 3,
          },
          gridLineWidth: 0,
          opposite: true,
          showLastLabel: false,
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
            combinedData
              .reduce(
                (
                  [filteredData, lastHourSegment],
                  datum: Datum,
                ): [Datum[], string] => {
                  const date = new Date(datum.date);
                  const datumHourSegmentKey = `${date.getUTCDay()}-${date.getHours()}`;
                  if (lastHourSegment !== datumHourSegmentKey) {
                    filteredData.push(datum);
                    return [filteredData, datumHourSegmentKey];
                  }

                  return [filteredData, lastHourSegment];
                },
                [[] as Datum[], '' as string] as const,
              )[0]
              .map((x) => {
                const date = new Date(x.date);
                date.setMinutes(0);
                return {
                  x: date.valueOf(),
                  y: Math.round(x.bme680Temperature * 10) / 10,
                };
              }),
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
          name: 'Sademed',
          type: 'column',
          data: rainData,
          color: '#68CFE8',
          yAxis: 1,
          groupPadding: 0,
          pointPadding: 0,
          grouping: false,
          dataLabels: {
            enabled: true,
            formatter: function () {
              // @ts-ignore
              if (this.y > 0) {
                return this.y;
              }
            },
            style: {
              fontSize: '8px',
              color: 'gray',
            },
          },
          tooltip: {
            valueSuffix: 'mm  ',
          },
        },
        {
          name: 'Õhurõhk',
          type: 'spline',
          data: combinedData
            .reduce(
              (
                [filteredData, lastHourSegment],
                datum: Datum,
              ): [Datum[], string] => {
                const date = new Date(datum.date);
                const datumHourSegmentKey = `${date.getUTCDay()}-${date.getHours()}`;
                if (lastHourSegment !== datumHourSegmentKey) {
                  filteredData.push(datum);
                  return [filteredData, datumHourSegmentKey];
                }

                return [filteredData, lastHourSegment];
              },
              [[] as Datum[], '' as string] as const,
            )[0]
            .map((x) => {
              const date = new Date(x.date);
              date.setMinutes(0);
              return {
                x: date.valueOf(),
                y: Math.round(x.bme680Pressure * 10) / 10,
              };
            }),
          // @ts-ignore
          color: Highcharts.getOptions().colors[2],
          marker: {
            enabled: false,
          },
          shadow: false,
          tooltip: {
            valueSuffix: 'hPa',
          },
          // @ts-ignore
          dashStyle: 'shortdot',
          yAxis: 2,
        },
      ],
    });
  }, [data]);
  if (!slowData.length) {
    return <div className="h-48">Laeb...</div>;
  }
  if (!options.series) {
    return null;
  }
  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default WeatherGraph;
