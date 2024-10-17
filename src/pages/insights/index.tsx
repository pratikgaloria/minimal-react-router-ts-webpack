import { useMemo, useState } from "react";
import Highcharts from "highcharts";
import HighcartsMore from "highcharts/highcharts-more";
import useReturns from "../../api/queries/useReturns";
import { Bubble } from "./charts/bubble";
import { StackedBar } from "./charts/stacked-bar";
import useInstruments from "../../api/queries/useInstruments";
import { PieDonut } from "./charts/pie-donut";
import { Pills } from "../../components/atoms/pills/pills";
HighcartsMore(Highcharts);

export default function Insights() {
  const [selectedChannel, setChannel] = useState<
    "trading212" | "india" | "crypto"
  >("trading212");
  const [selectedType, setSelectedType] = useState<"stock" | "etf" | "crypto">(
    "stock"
  );

  const { data: returns, error, isPending } = useReturns();
  const { data: instruments } = useInstruments();

  const filteredReturns = useMemo(
    () =>
      returns?.channels[selectedChannel].symbols.filter(
        (symbol) => symbol.type === selectedType
      ) ?? [],
    [returns, selectedChannel, selectedType]
  );

  const bubbleChartSeries: Highcharts.SeriesBubbleOptions = useMemo(
    () => ({
      type: "bubble",
      data: filteredReturns.map((s) => ({
        x: s.averagePrice,
        y: s.totalReturnsPercent,
        z: s.totalReturns,
        name: s.symbols.yahoo,
      })),
      negativeColor: "red",
    }),
    [returns, selectedChannel, selectedType]
  );

  const plSeries: Highcharts.SeriesBarOptions[] = useMemo(
    () =>
      filteredReturns
        .sort((a, b) => a.totalReturns - b.totalReturns)
        .map((s) => ({
          type: "bar",
          name: s.symbols.yahoo,
          data: [Number(s.totalReturns.toFixed(2))],
          currency: s.currency,
        })) ?? [],
    [returns, selectedChannel, selectedType]
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
            filteredReturns
              .find((s) => s.symbols.yahoo === symbol)
              ?.investedValue.toFixed(2)
          ),
        });
      });
    }

    return data;
  }, [returns, instruments, selectedChannel, selectedType]);

  if (isPending) {
    return "Loading...";
  }

  if (error) {
    return "Error!";
  }

  return (
    <div>
      <Pills
        items={[
          { id: "trading212", label: "Global", logo: "market-global" },
          { id: "india", label: "India", logo: "market-india" },
          { id: "crypto", label: "Crypto", logo: "market-crypto" },
        ]}
        selectedItem={selectedChannel}
        onSelect={(id) => {
          setChannel(id as "trading212" | "india");
          if (id === "crypto") {
            setSelectedType("crypto");
          } else {
            setSelectedType("stock");
          }
        }}
      />
      {selectedChannel !== "crypto" && (
        <Pills
          items={[
            { id: "stock", label: "Stock" },
            { id: "etf", label: "ETF" },
          ]}
          size="sm"
          selectedItem={selectedType}
          onSelect={(type) => setSelectedType(type as "stock" | "etf")}
        />
      )}

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
