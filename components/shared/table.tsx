import type { ReactNode } from "react";

export type TableColumn<Row> = {
  key: keyof Row;
  header: string;
  render?: (value: Row[keyof Row], row: Row) => ReactNode;
};

type TableProps<Row extends Record<string, unknown>> = {
  columns: TableColumn<Row>[];
  rows: Row[];
  caption: string;
  emptyMessage?: string;
};

export function Table<Row extends Record<string, unknown>>({ columns, rows, caption, emptyMessage = "لا توجد بيانات لعرضها." }: TableProps<Row>) {
  return (
    <div className="table-wrap">
      <table className="data-table">
        <caption className="sr-only">{caption}</caption>
        <thead><tr>{columns.map((column) => <th key={String(column.key)} scope="col">{column.header}</th>)}</tr></thead>
        <tbody>
          {rows.length ? rows.map((row, index) => (
            <tr key={index}>{columns.map((column) => {
              const value = row[column.key];
              return <td key={String(column.key)}>{column.render ? column.render(value, row) : String(value ?? "—")}</td>;
            })}</tr>
          )) : <tr><td colSpan={columns.length} className="table-empty">{emptyMessage}</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
