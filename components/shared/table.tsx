import React from "react";

export function TableContainer({
  children,
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`w-full overflow-x-auto rounded-xl border border-brand-secondary/20 bg-white/70 backdrop-blur-md shadow-sm ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  );
}

export function Table({
  children,
  className = "",
  ...props
}: React.TableHTMLAttributes<HTMLTableElement>) {
  return (
    <table
      className={`w-full text-start border-collapse text-sm text-brand-dark ${className}`.trim()}
      {...props}
    >
      {children}
    </table>
  );
}

export function TableHeader({
  children,
  className = "",
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      className={`bg-brand-primary/5 border-b border-brand-secondary/20 text-brand-dark font-medium ${className}`.trim()}
      {...props}
    >
      {children}
    </thead>
  );
}

export function TableBody({
  children,
  className = "",
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody
      className={`divide-y divide-brand-secondary/15 bg-transparent ${className}`.trim()}
      {...props}
    >
      {children}
    </tbody>
  );
}

export function TableRow({
  children,
  className = "",
  ...props
}: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={`transition-colors hover:bg-brand-secondary/5 ${className}`.trim()}
      {...props}
    >
      {children}
    </tr>
  );
}

export function TableHead({
  children,
  className = "",
  ...props
}: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={`px-4 py-3 text-start font-semibold text-xs text-brand-primary tracking-wider uppercase select-none ${className}`.trim()}
      {...props}
    >
      {children}
    </th>
  );
}

export function TableCell({
  children,
  className = "",
  ...props
}: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      className={`px-4 py-3 text-start align-middle text-sm ${className}`.trim()}
      {...props}
    >
      {children}
    </td>
  );
}

export function TableCaption({
  children,
  className = "",
  ...props
}: React.HTMLAttributes<HTMLTableCaptionElement>) {
  return (
    <caption
      className={`mt-2 text-xs text-brand-secondary text-center ${className}`.trim()}
      {...props}
    >
      {children}
    </caption>
  );
}

