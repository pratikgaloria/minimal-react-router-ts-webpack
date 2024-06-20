import React, { useState } from "react";
import { TReturnsSymbol } from "../../api/models/returns";
import { Button } from "../../components/atoms/button/button";
import { Header } from "../../components/header/header";
import { ProfileDrawer } from "./drawers/profile";
import { AddNewInvestmentDrawer } from "./drawers/add-new";
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

    const currentIndex = returns.symbols.findIndex(
      (s) => s.symbol === selectedSymbol.symbol
    );
    const nextIndex =
      direction === "left" ? currentIndex - 1 : currentIndex + 1;

    let navigateToIndex = nextIndex;
    if (nextIndex < 0) {
      navigateToIndex = returns.symbols.length - 1;
    } else if (nextIndex === returns.symbols.length) {
      navigateToIndex = 0;
    }
    setSelectedSymbol(returns.symbols[navigateToIndex]);
  };

  return (
    <div className={styles.wrapper}>
      <AddNewInvestmentDrawer
        open={flow === Flow.Adding}
        onClose={() => setFlow(Flow.Idle)}
      />
      <ProfileDrawer
        symbolData={selectedSymbol}
        open={flow === Flow.Updating}
        onClose={() => setFlow(Flow.Idle)}
        onNavigate={handleNavigate}
      />
      <Header label="Investments">
        <Button onClick={() => setFlow(Flow.Adding)}>Add New</Button>
      </Header>
      {returns && <InvestmentsGrid returns={returns} onSelect={handleSelect} />}
    </div>
  );
}
