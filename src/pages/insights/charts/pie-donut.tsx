import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import HighcartsSunburst from "highcharts/modules/sunburst";
HighcartsSunburst(Highcharts);

type PieDonutProps = {
  data: any[];
};

export function PieDonut({ data }: PieDonutProps) {
  const options = {
    chart: {
      height: "800px",
    },
    colors: ["transparent"].concat(Highcharts.getOptions().colors as string[]),
    title: {
      text: "Investments",
    },
    series: [
      {
        type: "sunburst",
        data,
        name: "Root",
        allowDrillToNode: true,
        borderRadius: 3,
        cursor: "pointer",
        dataLabels: {
          format: "{point.name}",
          filter: {
            property: "innerArcLength",
            operator: ">",
            value: 16,
          },
        },
        levels: [
          {
            level: 1,
            levelIsConstant: false,
            dataLabels: {
              filter: {
                property: "outerArcLength",
                operator: ">",
                value: 64,
              },
            },
          },
          {
            level: 2,
            colorByPoint: true,
          },
          {
            level: 3,
            colorVariation: {
              key: "brightness",
              to: -0.5,
            },
          },
          {
            level: 4,
            colorVariation: {
              key: "brightness",
              to: 0.5,
            },
          },
        ],
      },
    ],

    tooltip: {
      headerFormat: "",
      pointFormat: "<b>{point.name}</b>: {point.value}",
    },
  };

  return <HighchartsReact highcharts={Highcharts} options={options} />;
}
