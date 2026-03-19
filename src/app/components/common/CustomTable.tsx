import React, { useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getExpandedRowModel,
  getPaginationRowModel,
  SortingState,
  ColumnFiltersState,
  ExpandedState,
  PaginationState,
  useReactTable,
  Row,
} from "@tanstack/react-table";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface CustomTableProps<T> {
  data: T[];
  columns: ColumnDef<T, any>[];
  emptyMessage?: string;
  showGlobalFilter?: boolean;
  onRowClick?: (rowData: T) => void;
  renderSubComponent?: (rowData: T) => React.ReactNode;
  title?: string;
  subtitle?: string;
  onBack?: () => void;
  backLabel?: string;
}

export function CustomTable<T>({
  data,
  columns,
  emptyMessage = "No results found",
  showGlobalFilter = true,
  onRowClick,
  renderSubComponent,
  title,
  subtitle,
  onBack,
  backLabel = "Back",
}: CustomTableProps<T>) {
  const [sorting, setSorting]             = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter]   = useState("");
  const [expanded, setExpanded]           = useState<ExpandedState>({});
  const [pagination, setPagination]       = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnFilters, globalFilter, expanded, pagination },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onExpandedChange: setExpanded,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getExpandedRowModel: getExpandedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const totalRows  = table.getFilteredRowModel().rows.length;
  const curPage    = table.getState().pagination.pageIndex + 1;
  const totalPages = table.getPageCount() || 1;
  const pSize      = table.getState().pagination.pageSize;
  const startRow   = totalRows === 0 ? 0 : Math.min((curPage - 1) * pSize + 1, totalRows);
  const endRow     = Math.min(curPage * pSize, totalRows);
  const hasFilter  = globalFilter.trim().length > 0;

  return (
    <div className="w-full">

      {/* ── Page Header ── */}
      {(onBack || title) && (
        <div className="flex items-center gap-3 mb-5 flex-wrap">
          {onBack && (
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-700 transition-colors"
            >
              <ArrowLeft size={13} strokeWidth={2} />
              {backLabel}
            </button>
          )}
          {title && (
            <div className="min-w-0 flex-1">
              <h2 className="text-xl font-semibold text-gray-900 tracking-tight break-words">
                {title}
              </h2>
              {subtitle && (
                <p className="mt-0.5 text-sm text-gray-500 break-words">{subtitle}</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── Shell ── */}
      <div className="w-full bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">

        {/* ── Toolbar ── */}
        {showGlobalFilter && (
          <div className="flex flex-wrap items-center gap-2 px-4 py-3 bg-gray-50 border-b border-gray-200">
            <div className="relative flex-1 min-w-0" style={{ maxWidth: 300 }}>
              <Search
                size={14}
                strokeWidth={2}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
              <input
                value={globalFilter ?? ""}
                onChange={(e) => setGlobalFilter(e.target.value)}
                placeholder="Search…"
                className="w-full pl-8 pr-8 py-2 text-sm text-gray-900 bg-white border border-gray-200 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
              />
              {hasFilter && (
                <button
                  onClick={() => setGlobalFilter("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center w-4 h-4 rounded-full bg-gray-200 text-gray-500 hover:bg-gray-300 transition-colors"
                >
                  <X size={9} strokeWidth={2.5} />
                </button>
              )}
            </div>
            {hasFilter && (
              <span className="shrink-0 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-full">
                {totalRows} result{totalRows !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        )}

        {/* ── Desktop Table — hidden on mobile ── */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse">
            <thead>
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id} className="border-b border-gray-200 bg-gray-50">
                  {hg.headers.map((header) => {
                    const canSort = header.column.getCanSort();
                    const sorted  = header.column.getIsSorted();
                    return (
                      <th
                        key={header.id}
                        onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                        className={[
                          "px-4 py-2.5 text-left text-xs font-semibold tracking-wide uppercase whitespace-nowrap select-none",
                          sorted ? "text-blue-600" : "text-gray-400",
                          canSort ? "cursor-pointer hover:text-gray-700 hover:bg-gray-100 transition-colors" : "",
                        ].join(" ")}
                      >
                        <div className="flex items-center gap-1">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {canSort && (
                            <span className={sorted ? "opacity-100" : "opacity-30"}>
                              {sorted === "asc"  ? <ArrowUp   size={10} strokeWidth={2.5} className="text-blue-600" /> :
                               sorted === "desc" ? <ArrowDown size={10} strokeWidth={2.5} className="text-blue-600" /> :
                                                   <ArrowUpDown size={10} strokeWidth={2} />}
                            </span>
                          )}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-gray-100">
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="py-16 px-4 text-center">
                    <EmptyState message={emptyMessage} hasFilter={hasFilter} />
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row, idx) => {
                  const isExpanded = row.getIsExpanded();
                  const clickable  = !!(onRowClick || renderSubComponent);
                  return (
                    <React.Fragment key={row.id}>
                      <tr
                        onClick={() => {
                          if (renderSubComponent) row.toggleExpanded();
                          onRowClick?.(row.original);
                        }}
                        className={[
                          "transition-colors",
                          clickable ? "cursor-pointer" : "",
                          isExpanded
                            ? "bg-blue-50"
                            : idx % 2 === 0
                            ? "bg-white hover:bg-gray-50"
                            : "bg-gray-50/40 hover:bg-gray-100/60",
                        ].join(" ")}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <td
                            key={cell.id}
                            className="px-4 py-3 text-sm text-gray-700 max-w-[220px] truncate"
                          >
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        ))}
                      </tr>
                      {isExpanded && renderSubComponent && (
                        <tr>
                          <td
                            colSpan={row.getVisibleCells().length}
                            className="px-4 py-3 bg-blue-50 border-t border-blue-100"
                          >
                            {renderSubComponent(row.original)}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ── Mobile Cards — hidden on sm+ ── */}
        <div className="flex sm:hidden flex-col gap-2 p-3">
          {table.getRowModel().rows.length === 0 ? (
            <div className="py-12 text-center">
              <EmptyState message={emptyMessage} hasFilter={hasFilter} />
            </div>
          ) : (
            table.getRowModel().rows.map((row) => (
              <MobileCard
                key={row.id}
                row={row}
                onRowClick={onRowClick}
                renderSubComponent={renderSubComponent}
              />
            ))
          )}
        </div>

        {/* ── Footer / Pagination ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-2.5 border-t border-gray-200 bg-gray-50">
          <p className="text-xs text-gray-400 text-center sm:text-left tabular-nums">
            {totalRows === 0 ? (
              "No results"
            ) : (
              <>
                <span className="font-medium text-gray-600">{startRow}–{endRow}</span>
                {" "}of {totalRows}
              </>
            )}
          </p>

          <div className="flex items-center justify-center gap-1 flex-wrap">
            <NavBtn onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()} title="First">
              <ChevronsLeft size={13} strokeWidth={2} />
            </NavBtn>
            <NavBtn onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} title="Previous">
              <ChevronLeft size={13} strokeWidth={2} />
            </NavBtn>

            {/* Desktop pills */}
            <div className="hidden sm:flex items-center gap-1">
              {getPageNumbers(curPage, totalPages).map((p, i) =>
                p === "…" ? (
                  <span key={`e${i}`} className="text-xs text-gray-300 px-1">…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => table.setPageIndex((p as number) - 1)}
                    className={[
                      "min-w-[28px] h-7 px-1.5 rounded text-xs font-medium transition-all",
                      p === curPage
                        ? "bg-blue-50 border border-blue-200 text-blue-600 font-semibold"
                        : "text-gray-500 hover:bg-gray-100 hover:text-gray-800 border border-transparent",
                    ].join(" ")}
                  >
                    {p}
                  </button>
                )
              )}
            </div>

            {/* Mobile: X / Y */}
            <span className="flex sm:hidden text-xs text-gray-500 tabular-nums px-2">
              {curPage} / {totalPages}
            </span>

            <NavBtn onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} title="Next">
              <ChevronRight size={13} strokeWidth={2} />
            </NavBtn>
            <NavBtn onClick={() => table.setPageIndex(totalPages - 1)} disabled={!table.getCanNextPage()} title="Last">
              <ChevronsRight size={13} strokeWidth={2} />
            </NavBtn>

            {/* Page size — desktop only */}
            <div className="relative hidden sm:block ml-2">
              <select
                value={pSize}
                onChange={(e) => { table.setPageSize(Number(e.target.value)); table.setPageIndex(0); }}
                className="appearance-none pl-2.5 pr-6 py-1.5 text-xs font-medium text-gray-500 bg-white border border-gray-200 rounded cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
              >
                {[10, 25, 50, 100].map((s) => (
                  <option key={s} value={s}>{s} / page</option>
                ))}
              </select>
              <ChevronDown
                size={10}
                strokeWidth={2}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Mobile Card
   Layout:
   • Header: label (tiny caps) + value (full width, wraps naturally)
   • Every column = its own full-width row, label on top, value below
   • No grid, no truncation on values — everything readable
   • Sub-component: separate section, click-propagation stopped
───────────────────────────────────────── */
function MobileCard<T>({
  row,
  onRowClick,
  renderSubComponent,
}: {
  row: Row<T>;
  onRowClick?: (d: T) => void;
  renderSubComponent?: (d: T) => React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const cells = row.getVisibleCells();
  const isClickable = !!(onRowClick || renderSubComponent);
  const hasExpand = !!renderSubComponent;

  const getLabel = (cell: typeof cells[number]): string => {
    const h = cell.column.columnDef.header;
    if (typeof h === "string") return h;
    return cell.column.id.replace(/([A-Z])/g, " $1").replace(/_/g, " ").trim();
  };

  return (
    <div
      className={[
        "bg-white border rounded-xl overflow-hidden transition-all",
        open ? "border-blue-200" : "border-gray-200",
      ].join(" ")}
    >
      {/* ── Clickable top area ── */}
      <div
        onClick={() => {
          if (renderSubComponent) setOpen((v) => !v);
          onRowClick?.(row.original);
        }}
        className={[
          "px-4 pt-3 pb-3 transition-colors",
          isClickable ? "cursor-pointer" : "",
          open ? "bg-blue-50/60" : "hover:bg-gray-50/70",
        ].join(" ")}
      >
        {/* Expand toggle row */}
        {hasExpand && (
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
              {open ? "Hide details" : "Show details"}
            </span>
            <span className={open ? "text-blue-500" : "text-gray-300"}>
              {open
                ? <ChevronUp size={15} strokeWidth={2} />
                : <ChevronDown size={15} strokeWidth={2} />}
            </span>
          </div>
        )}

        {/* All columns — stacked full width */}
        <div className="flex flex-col gap-3">
          {cells.map((cell) => (
            <div key={cell.id} className="w-full min-w-0">
              {/* Label */}
              <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-0.5 leading-none">
                {getLabel(cell)}
              </p>
              {/* Value — wraps freely, no truncation */}
              <div className="text-sm font-medium text-gray-800 leading-snug break-words w-full">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Expanded sub-component ── */}
      {open && renderSubComponent && (
        <div
          className="border-t border-blue-100 bg-gray-50 px-4 py-3"
          onClick={(e) => e.stopPropagation()}
        >
          {renderSubComponent(row.original)}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   Empty State
───────────────────────────────────────── */
function EmptyState({ message, hasFilter }: { message: string; hasFilter: boolean }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center">
        <Search size={18} strokeWidth={1.5} className="text-gray-400" />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{message}</p>
        {hasFilter && (
          <p className="text-xs text-gray-400 mt-1">Try adjusting your search</p>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Nav Button
───────────────────────────────────────── */
function NavBtn({
  onClick,
  disabled,
  title,
  children,
}: {
  onClick: () => void;
  disabled: boolean;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className="flex items-center justify-center w-7 h-7 rounded border border-gray-200 bg-white text-gray-400 hover:bg-gray-50 hover:text-blue-600 hover:border-blue-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-400 disabled:hover:border-gray-200 transition-all"
    >
      {children}
    </button>
  );
}

/* ─────────────────────────────────────────
   Smart page numbers
───────────────────────────────────────── */
function getPageNumbers(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4)         return [1, 2, 3, 4, 5, "…", total];
  if (current >= total - 3) return [1, "…", total - 4, total - 3, total - 2, total - 1, total];
  return [1, "…", current - 1, current, current + 1, "…", total];
}