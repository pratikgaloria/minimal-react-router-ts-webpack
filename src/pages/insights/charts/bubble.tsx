import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import HighcartsMore from "highcharts/highcharts-more";
HighcartsMore(Highcharts);

type BubbleProps = {
  series: Highcharts.SeriesBubbleOptions[];
  xAxisLabel?: string;
  yAxisLabel?: string;
  xPlotlines?: Highcharts.XAxisPlotLinesOptions[];
  yPlotlines?: Highcharts.YAxisPlotLinesOptions[];
};

export function Bubble({
  series,
  xAxisLabel,
  yAxisLabel,
  xPlotlines,
  yPlotlines,
}: BubbleProps) {
  const options = {
    chart: {
      type: "bubble",
      plotBorderWidth: 1,
      zooming: {
        type: "xy",
      },
    },
    title: {
      text: "Avg. Price vs. P/L vs. Qty"
    },
    legend: {
      enabled: false,
    },
    xAxis: {
      gridLineWidth: 1,
      title: {
        text: xAxisLabel,
      },
      plotLines: xPlotlines,
    },
    yAxis: {
      startOnTick: false,
      endOnTick: false,
      title: {
        text: yAxisLabel,
      },
      maxPadding: 0.2,
      plotLines: yPlotlines,
    },
    plotOptions: {
      series: {
        dataLabels: {
          enabled: true,
          format: "{point.name}",
        },
      },
    },
    series,
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
}
