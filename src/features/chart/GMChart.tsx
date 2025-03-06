import { AgChartOptions } from 'ag-charts-community';
import { ChartData } from '../../types';
import { AgCharts } from 'ag-charts-react';

interface GMChartProps {
  data: ChartData[];
}

const GMChart = ({ data }: GMChartProps) => {
  const options: AgChartOptions = {
    data: data,
    series: [
      {
        type: 'bar',
        xKey: 'week',
        yKey: 'gmDollars',
        yName: 'GM Dollars',
        axis: {
          position: 'left',
          title: {
            text: 'GM Dollars',
          },
          label: {
            formatter: (params) => `$${params.value.toFixed(2)}`,
          },
        },
        tooltip: {
          renderer: ({ datum }) => ({
            content: `$${datum.gmDollars.toFixed(2)}`,
          }),
        },
      },
      {
        type: 'line',
        xKey: 'week',
        yKey: 'gmPercent',
        yName: 'GM %',
        axis: {
          position: 'right',
          title: {
            text: 'GM %',
          },
          label: {
            formatter: (params) => `${(params.value * 100).toFixed(1)}%`,
          },
        },
        tooltip: {
          renderer: ({ datum }) => ({
            content: `${(datum.gmPercent * 100).toFixed(1)}%`,
          }),
        },
      },
    ],
    axes: [
      {
        type: 'category',
        position: 'bottom',
        title: {
          text: 'Week',
        },
      },
    ],
    legend: {
      enabled: true,
      position: 'bottom',
    },
    container: undefined,
    autoSize: true,
  };

  return (
    <div style={{ height: '400px', width: '100%' }}>
      <AgCharts options={options} />
    </div>
  );
};

export default GMChart;