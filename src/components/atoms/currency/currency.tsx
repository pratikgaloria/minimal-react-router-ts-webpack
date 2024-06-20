type CurrencyProps = {
  currency: string;
  children: number;
  toFixed?: number;
};

export function Currency({
  currency,
  children,
  toFixed,
}: React.PropsWithChildren<CurrencyProps>) {
  return Intl.NumberFormat("de-DE", { style: "currency", currency }).format(
    toFixed ? Number(children.toFixed(toFixed)) : children
  );
}
