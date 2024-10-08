import React, { useState } from "react";
import { TReturnsSymbol } from "../../api/models/returns";
import { Button } from "../../components/atoms/button/button";
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
  const [selectedSymbol, setSelectedSymbol] = useState<TReturnsSymbol>();
  const { data: returns } = useReturns();

  const handleSelect = (symbol: TReturnsSymbol) => {
    setSelectedSymbol(symbol);
    setFlow(Flow.Updating);
  };

  const handleNavigate = (direction: "left" | "right") => {
    if (!returns || !selectedSymbol) return;

    const currentIndex = returns.channels['trading212'].symbols.findIndex(
      (s) => s.symbols.yahoo === selectedSymbol.symbols.yahoo
    );
    const nextIndex =
      direction === "left" ? currentIndex - 1 : currentIndex + 1;

    let navigateToIndex = nextIndex;
    if (nextIndex < 0) {
      navigateToIndex = returns.channels['trading212'].symbols.length - 1;
    } else if (nextIndex === returns.channels['trading212'].symbols.length) {
      navigateToIndex = 0;
    }
    setSelectedSymbol(returns.channels['trading212'].symbols[navigateToIndex]);
  };

  return (
    <div className={styles.wrapper}>
      <ProfileDrawer
        symbolData={selectedSymbol}
        open={flow === Flow.Updating}
        onClose={() => setFlow(Flow.Idle)}
        onNavigate={handleNavigate}
      />
      <Header label="Investments" />
      {returns && <InvestmentsGrid returns={returns} onSelect={handleSelect} />}
    </div>
  );
}
