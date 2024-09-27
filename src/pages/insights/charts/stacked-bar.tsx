import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import HighcartsMore from "highcharts/highcharts-more";
HighcartsMore(Highcharts);

type StackedBarProps = {
  series: Highcharts.SeriesBarOptions[];
};

export function StackedBar({ series }: StackedBarProps) {
  const options = {
    chart: {
      type: "bar",
      height: 170,
    },
    title: {
      text: "P/L",
    },
    plotOptions: {
      bar: {
        headSize: 6,
        stacking: "normal",
        dataLabels: {
          enabled: true,
          y: 20,
          verticalAlign: "bottom",
          format: '{series.name}'
        },
        color: "rgb(1, 127, 250)",
        negativeColor: "rgb(255, 7, 77)",
        accessibility: {
          exposeAsGroupOnly: true,
        },
      },
    },
    tooltip: {
      format:
        '<span style="color:{point.color}">\u25CF</span> ' +
        "<b>{series.name}: {point.y} $</b>",
    },
    accessibility: {
      typeDescription:
        'Stacked bar "force" chart. Positive forces ' +
        "are shown on the right side and negative on the left.",
      series: {
        descriptionFormat:
          "Series {add series.index 1} of " +
          "{chart.series.length}, Name: {series.name}, " +
          "{#if (gt series.points.0.y 0)}accelerating" +
          "{else}decelerating{/if} value of {series.points.0.y}.",
      },
    },
    yAxis: {
      reversedStacks: false,
      opposite: true,
      labels: {
        enabled: false,
      },
      title: "",
      accessibility: {
        description: "",
      },
      stackLabels: {
        enabled: true,
        verticalAlign: "top",
        style: {
          fontSize: "1em",
        },
        format: "{#if isNegative}Loss{else}Profit{/if}: {total}",
      },
      startOnTick: false,
      endOnTick: false,
    },
    xAxis: {
      visible: false,
      title: "",
      accessibility: {
        description: "",
      },
    },
    legend: {
      enabled: false,
    },
    /*
NOTE: These data values are arbitrary, illustrative and does not reflect
the strength of actual forces in a Mars EDL sequence. They aim to broadly
demonstrate the key dynamics affecting the spacecraft during EDL.
*/
    series,
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
}
