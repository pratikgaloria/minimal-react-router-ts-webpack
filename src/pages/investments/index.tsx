import React, { useState } from "react";
import { TReturnsSymbol } from "../../api/models/returns";
import { Pills } from "../../components/atoms/pills/pills";
import { Header } from "../../components/header/header";
import { ProfileDrawer } from "./drawers/profile";
import { InvestmentsGrid } from "./grid";
import styles from "./investments.module.scss";
import useReturns from "../../api/queries/useReturns";

const enum Flow {
  Idle,
  Adding,
  Updating,
}

export default function Investments() {
  const [flow, setFlow] = useState<Flow>(Flow.Idle);
  const [selectedChannel, setChannel] = useState<"trading212" | "india">(
    "trading212"
  );
  const [selectedType, setSelectedType] = useState<"stock" | "etf">("stock");
  const [selectedSymbol, setSelectedSymbol] = useState<TReturnsSymbol>();
  const { data: returns } = useReturns();

  const handleSelect = (symbol: TReturnsSymbol) => {
    setSelectedSymbol(symbol);
    setFlow(Flow.Updating);
  };

  const handleNavigate = (direction: "left" | "right") => {
    if (!returns || !selectedSymbol) return;

    const currentIndex = returns.channels[selectedChannel].symbols.findIndex(
      (s) => s.symbols.yahoo === selectedSymbol.symbols.yahoo
    );
    const nextIndex =
      direction === "left" ? currentIndex - 1 : currentIndex + 1;

    let navigateToIndex = nextIndex;
    if (nextIndex < 0) {
      navigateToIndex = returns.channels[selectedChannel].symbols.length - 1;
    } else if (nextIndex === returns.channels[selectedChannel].symbols.length) {
      navigateToIndex = 0;
    }
    setSelectedSymbol(
      returns.channels[selectedChannel].symbols[navigateToIndex]
    );
  };

  const filteredReturns =
    returns?.channels[selectedChannel].symbols.filter(
      (symbol) => symbol.type === selectedType
    ) || [];

  return (
    <div className={styles.wrapper}>
      <ProfileDrawer
        symbolData={selectedSymbol}
        open={flow === Flow.Updating}
        onClose={() => setFlow(Flow.Idle)}
        onNavigate={handleNavigate}
      />
      <Header label="Investments" />
      <Pills
        items={[
          { id: "trading212", label: "Global", logo: "market-global" },
          { id: "india", label: "India", logo: "market-india" },
        ]}
        selectedItem={selectedChannel}
        onSelect={(id) => setChannel(id as "trading212" | "india")}
      />
      <Pills
        items={[
          { id: "stock", label: "Stock" },
          { id: "etf", label: "ETF" },
        ]}
        size="sm"
        selectedItem={selectedType}
        onSelect={(type) => setSelectedType(type as "stock" | "etf")}
      />
      {returns && (
        <InvestmentsGrid returns={filteredReturns} onSelect={handleSelect} />
      )}
    </div>
  );
}
