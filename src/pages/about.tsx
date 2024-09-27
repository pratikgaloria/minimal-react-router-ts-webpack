import { useState } from "react";
import { Text } from "../components/atoms/typography/typography";
import { Tabs } from "../components/tabs";
import styles from "./about.module.scss";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import HighcartsMore from "highcharts/highcharts-more";
import useReturns from "../api/queries/useReturns";
HighcartsMore(Highcharts);

export default function About() {
  const [activeTab, setActiveTab] = useState(0);

  const { data: returns, error, isPending } = useReturns();

  if (isPending) {
    return "Loading...";
  }

  if (error) {
    return "Error!";
  }

  const options = {
    chart: {
      type: "bubble",
      plotBorderWidth: 1,
      zooming: {
        type: "xy",
      },
    },
    legend: {
      enabled: false,
    },

    xAxis: {
      gridLineWidth: 1,
      title: {
        text: "Average Price",
      },
      labels: {
        format: "{value}",
      },
    },

    yAxis: {
      startOnTick: false,
      endOnTick: false,
      title: {
        text: "P/L",
      },
      labels: {
        format: "{value} %",
      },
      maxPadding: 0.2,
      plotLines: [
        {
          color: "grey",
          dashStyle: "dot",
          width: 2,
          value: 0,
          label: {
            align: "right",
            style: {
              fontStyle: "italic",
            },
            text: "0%",
            x: -10,
          },
          zIndex: 3,
        },
      ],
    },

    tooltip: {
      useHTML: true,
      headerFormat: "<table>",
      pointFormat:
        '<tr><th colspan="2"><h3>{point.name}</h3></th></tr>' +
        "<tr><th>Average Price: </th><td>{point.x}</td></tr>" +
        "<tr><th>P/L: </th><td>{point.y}%</td></tr>" +
        "<tr><th>Returns: </th><td>{point.z}</td></tr>",
      footerFormat: "</table>",
      followPointer: true,
    },

    plotOptions: {
      series: {
        dataLabels: {
          enabled: true,
          format: "{point.name}",
        },
      },
    },

    series: [
      {
        data: returns.symbols.map((s) => ({
          x: s.averagePrice,
          y: s.totalReturnsPercent,
          z: s.totalReturns,
          name: s.symbol,
        })),
        // [
        //   { x: 95, y: 95, z: 13.8, name: "BE", country: "Belgium" },
        //   { x: 86.5, y: 102.9, z: 14.7, name: "DE", country: "Germany" },
        //   { x: 80.8, y: 91.5, z: 15.8, name: "FI", country: "Finland" },
        //   { x: 80.4, y: 102.5, z: 12, name: "NL", country: "Netherlands" },
        //   { x: 80.3, y: 86.1, z: 11.8, name: "SE", country: "Sweden" },
        //   { x: 78.4, y: 70.1, z: 16.6, name: "ES", country: "Spain" },
        //   { x: 74.2, y: 68.5, z: 14.5, name: "FR", country: "France" },
        //   { x: 73.5, y: 83.1, z: 10, name: "NO", country: "Norway" },
        //   { x: 71, y: 93.2, z: 24.7, name: "UK", country: "United Kingdom" },
        //   { x: 69.2, y: 57.6, z: 10.4, name: "IT", country: "Italy" },
        //   { x: 68.6, y: 20, z: 16, name: "RU", country: "Russia" },
        //   {
        //     x: 65.5,
        //     y: 126.4,
        //     z: 35.3,
        //     name: "US",
        //     country: "United States",
        //   },
        //   { x: 65.4, y: 50.8, z: 28.5, name: "HU", country: "Hungary" },
        //   { x: 63.4, y: 51.8, z: 15.4, name: "PT", country: "Portugal" },
        //   { x: 64, y: 82.9, z: 31.3, name: "NZ", country: "New Zealand" },
        // ],
        negativeColor: "red",
      },
    ],
  };

  const basket = {
    selectedItemCount: 0,
  };

  return (
    <div>
      <Text size="lg">About</Text>
      <h1 data-testid="basket-title">
        {"title"}{" "}
        {basket.selectedItemCount > 0 && `(${basket.selectedItemCount})`}
      </h1>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
}
