import React from "react";
import {
  useReactTable,
  createColumnHelper,
  getCoreRowModel,
  flexRender,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table";
import classnames from "classnames";
import { Text } from "../../components/atoms/typography/typography";
import styles from "./investments.module.scss";
import { Currency } from "../../components/atoms/currency/currency";
import { Icon } from "../../components/icons/icon";
import { Button } from "../../components/atoms/button/button";
import { SearchBar } from "../../components/forms/search-bar";
import { TReturnsSymbol } from "../../api/models/returns";

const columnHelper = createColumnHelper<TReturnsSymbol>();

type InvestmentGridProps = {
  returns: TReturnsSymbol[];
  onSelect: (symbol: TReturnsSymbol) => void;
};

export function InvestmentsGrid({ returns, onSelect }: InvestmentGridProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const columns = [
    columnHelper.accessor("symbols.yahoo", {
      header: "Symbol",
      cell: (info) => (
        <div className={styles.symbol}>
          <img
            loading="lazy"
            src={
              "/public/images/logos/" +
              info.getValue().toLocaleLowerCase() +
              ".svg"
            }
          />
          <Text>{info.getValue()}</Text>
        </div>
      ),
    }),
    columnHelper.accessor("displayName", {
      header: "",
      cell: (info) => (
        <div className={styles.symbol}>
          <Text>{info.getValue()}</Text>
        </div>
      ),
      enableColumnFilter: false,
    }),
    columnHelper.accessor("oneDayReturnsPercent", {
      cell: (info) => (
        <span
          className={
            Number(info.getValue()) < 0 ? styles.negative : styles.positive
          }
        >
          {info.getValue().toFixed(1) + "%"}
        </span>
      ),
      header: "Today",
      enableColumnFilter: false,
    }),
    columnHelper.accessor("oneDayReturns", {
      cell: (info) => (
        <span
          className={
            Number(info.getValue()) < 0 ? styles.negative : styles.positive
          }
        >
          <Currency currency={info.row.original.currency}>
            {info.getValue()}
          </Currency>
        </span>
      ),
      header: "",
      enableColumnFilter: false,
    }),
    columnHelper.accessor("quantity", {
      cell: (info) => info.getValue().toFixed(1),
      header: "Qty.",
      enableColumnFilter: false,
    }),
    columnHelper.accessor("investedValue", {
      cell: (info) => (
        <Currency currency={info.row.original.currency}>
          {info.getValue()}
        </Currency>
      ),
      header: "Invested value",
      enableColumnFilter: false,
    }),
    columnHelper.accessor("currentValue", {
      cell: (info) => (
        <Currency currency={info.row.original.currency}>
          {info.getValue()}
        </Currency>
      ),
      header: "Current value",
      enableColumnFilter: false,
    }),
    columnHelper.accessor("totalReturns", {
      cell: (info) => (
        <Currency currency={info.row.original.currency}>
          {info.getValue()}
        </Currency>
      ),
      header: "Returns",
      enableColumnFilter: false,
    }),
    columnHelper.accessor("totalReturnsPercent", {
      cell: (info) => info.getValue().toFixed(0) + "%",
      header: "P/L",
      enableColumnFilter: false,
    }),
    columnHelper.accessor("id", {
      header: "",
      cell: (info) => (
        <Button
          size="sm"
          variant="onlyIcon"
          onClick={() => {
            onSelect(info.row.original);
          }}
        >
          <Icon size="xs" icon="ellipsis-h"></Icon>
        </Button>
      ),
      enableColumnFilter: false,
    }),
  ];

  const table = useReactTable({
    data: returns || [],
    columns,
    filterFns: {},
    state: {
      columnFilters,
      sorting,
    },
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <table>
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <th
                  key={header.id}
                  colSpan={header.colSpan}
                  className={
                    !["symbol", "_id"].includes(header.id)
                      ? styles.numberValue
                      : ""
                  }
                >
                  {header.isPlaceholder ? null : (
                    <div
                      className={classnames(
                        header.column.getCanSort() &&
                          "cursor-pointer select-none",
                        header.column.getCanFilter() && styles["with-filter"]
                      )}
                      title={
                        header.column.getCanSort()
                          ? header.column.getNextSortingOrder() === "asc"
                            ? "Sort ascending"
                            : header.column.getNextSortingOrder() === "desc"
                            ? "Sort descending"
                            : "Clear sort"
                          : undefined
                      }
                    >
                      <div onClick={header.column.getToggleSortingHandler()}>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: <Icon size="xs" icon="sort-up" />,
                          desc: <Icon size="xs" icon="sort-down" />,
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                      {header.column.getCanFilter() && (
                        <SearchBar
                          value={header.column.getFilterValue() as string}
                          onChange={header.column.setFilterValue}
                        />
                      )}
                    </div>
                  )}
                </th>
              );
            })}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td
                key={cell.id}
                className={
                  cell.column.id !== "symbol" ? styles.numberValue : ""
                }
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
