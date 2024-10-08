import { useState } from "react";
import { Drawer } from "../../../components/drawer/drawer";
import { Text } from "../../../components/atoms/typography/typography";
import {
  FundamentalData,
  MiniChart,
  SymbolInfo,
  TechnicalAnalysis,
  Timeline,
} from "react-ts-tradingview-widgets";
import { TReturnsSymbol } from "../../../api/models/returns";
import { Tabs } from "../../../components/tabs";
import { Icon } from "../../../components/icons/icon";
import { Currency } from "../../../components/atoms/currency/currency";
import { Button } from "../../../components/atoms/button/button";
import styles from "./profile.module.scss";

type ProfileDrawerProps = {
  symbolData?: TReturnsSymbol;
  open: boolean;
  onClose: () => void;
  onNavigate: (direction: "left" | "right") => void;
};

export const ProfileDrawer = ({
  symbolData,
  open,
  onClose,
  onNavigate,
}: ProfileDrawerProps) => {
  const [tab, setTab] = useState(0);

  const isNegative = symbolData && symbolData.totalReturns < 0;

  return (
    <Drawer
      className={styles.wrapper}
      open={open}
      title={
        <div className={styles.header}>
          <div className={styles.title}>
            <img
              loading="lazy"
              src={
                "/public/images/logos/" +
                symbolData?.symbols.yahoo.toLocaleLowerCase() +
                ".svg"
              }
            />
            <Text size="xl">{symbolData?.symbols.yahoo}</Text>
          </div>
          <div className={styles.navigator}>
            <Button variant="onlyIcon" onClick={() => onNavigate("left")}>
              <Icon size="sm" icon="chevron-left" />
            </Button>
            <Button
              size="sm"
              variant="onlyIcon"
              onClick={() => onNavigate("right")}
            >
              <Icon size="sm" icon="chevron-right" />
            </Button>
          </div>
        </div>
      }
      onClose={onClose}
    >
      <Tabs className={styles.tabs} size="md" value={tab} onChange={setTab}>
        <Icon icon="chart-line" />
        <Icon icon="tachometer-alt" />
        <Icon icon="balance-scale" />
      </Tabs>
      {tab === 0 && symbolData && (
        <div className={styles.widgets}>
          <div className={styles.stats}>
            <div>
              <Text size="lg">Returns</Text>
              <Text
                size="lg"
                variant="thick"
                className={isNegative ? styles.negative : styles.positive}
              >
                <Currency currency={symbolData.currency}>
                  {symbolData.totalReturns}
                </Currency>
              </Text>
            </div>
            <div>
              <Text size="lg">P/L</Text>
              <Text
                size="lg"
                variant="thick"
                className={isNegative ? styles.negative : styles.positive}
              >
                {symbolData.totalReturnsPercent.toFixed(0)}%
              </Text>
            </div>

            <div>
              <Text size="lg">Invested Value</Text>
              <Text size="lg" variant="thick">
                <Currency currency={symbolData.currency}>
                  {symbolData.investedValue}
                </Currency>
              </Text>
            </div>
            <div>
              <Text size="lg">Current Value</Text>
              <Text size="lg" variant="thick">
                <Currency currency={symbolData.currency}>
                  {symbolData.currentValue}
                </Currency>
              </Text>
            </div>
            <div>
              <Text size="lg">Avg. Price</Text>
              <Text size="lg" variant="thick">
                <Currency currency={symbolData.currency}>
                  {symbolData.averagePrice}
                </Currency>
              </Text>
            </div>
            <div>
              <Text size="lg">Quantity</Text>
              <Text size="lg" variant="thick">
                {symbolData.quantity}
              </Text>
            </div>
          </div>
          <SymbolInfo symbol={symbolData.symbols.tradingView} autosize />
          <MiniChart
            symbol={symbolData.symbols.tradingView}
            chartOnly
            dateRange="12M"
            trendLineColor="#4f46e5"
            underLineColor="#4f46e533"
            width={412}
            height={312}
          />
        </div>
      )}
      {tab === 1 && symbolData && (
        <div className={styles.analysis}>
          <TechnicalAnalysis
            interval="1M"
            symbol={symbolData.symbols.tradingView}
            width={412}
            height={320}
          />
          <Timeline
            symbol={symbolData.symbols.tradingView}
            feedMode="symbol"
            width={412}
            height={370}
          />
        </div>
      )}
      {tab === 2 && symbolData && (
        <div className={styles.fundamentals}>
          <FundamentalData
            symbol={symbolData.symbols.tradingView}
            width="100%"
            height={710}
          />
        </div>
      )}
    </Drawer>
  );
};
