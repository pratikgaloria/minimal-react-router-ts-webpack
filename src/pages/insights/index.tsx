import { useMemo } from "react";
import Highcharts from "highcharts";
import HighcartsMore from "highcharts/highcharts-more";
import useReturns from "../../api/queries/useReturns";
import { Bubble } from "./charts/bubble";
import { StackedBar } from "./charts/stacked-bar";
import useInstruments from "../../api/queries/useInstruments";
import { PieDonut } from "./charts/pie-donut";
HighcartsMore(Highcharts);

export default function Insights() {
  const { data: returns, error, isPending } = useReturns();
  const { data: instruments } = useInstruments();

  const bubbleChartSeries: Highcharts.SeriesBubbleOptions = useMemo(
    () => ({
      type: "bubble",
      data: returns?.symbols
        .map((s) => ({
          x: s.averagePrice,
          y: s.totalReturnsPercent,
          z: s.totalReturns,
          name: s.symbol,
        })),
      negativeColor: "red",
    }),
    [returns]
  );

  const plSeries: Highcharts.SeriesBarOptions[] = useMemo(
    () =>
      returns?.symbols
        .sort((a, b) => a.totalReturns - b.totalReturns)
        .map((s) => ({
          type: "bar",
          name: s.symbol,
          data: [Number(s.totalReturns.toFixed(2))],
          currency: s.currency,
        })) ?? [],
    [returns]
  );

  const investmentSeries = useMemo(() => {
    const data = [];
    data.push({
      id: "investments",
      name: "Investments",
      parent: "",
    });

    if (instruments) {
      const sectors = new Set();
      const industries = new Set();

      Object.entries(instruments).forEach(([symbol, meta]) => {
        if (!sectors.has(meta.sector)) {
          data.push({
            id: meta.sector,
            name: meta.sector,
            parent: "investments",
          });
          sectors.add(meta.sector);
        }

        if (!industries.has(meta.industry)) {
          data.push({
            id: meta.industry,
            name: meta.industry,
            parent: meta.sector,
          });
          industries.add(meta.industry);
        }

        data.push({
          id: symbol,
          name: symbol,
          parent: meta.industry,
          value: Number(
            returns?.symbols
              .find((s) => s.symbol === symbol)
              ?.investmentValue.toFixed(2)
          ),
        });
      });
    }

    return data;
  }, [returns, instruments]);

  if (isPending) {
    return "Loading...";
  }

  if (error) {
    return "Error!";
  }

  return (
    <div>
      <Bubble
        series={[bubbleChartSeries]}
        xAxisLabel="Average Price (USD)"
        yAxisLabel="P/L"
        xPlotlines={[
          {
            color: "grey",
            dashStyle: "Dot",
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
        ]}
      />
      <StackedBar series={plSeries} />
      <PieDonut data={investmentSeries} />
    </div>
  );
}
