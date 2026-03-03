// import React, { useState } from "react";
// import {
//   ColumnDef,
//   flexRender,
//   getCoreRowModel,
//   getFilteredRowModel,
//   getSortedRowModel,
//   getFacetedRowModel,
//   getFacetedUniqueValues,
//   getExpandedRowModel,
//   SortingState,
//   ColumnFiltersState,
//   ExpandedState,
//   useReactTable,
// } from "@tanstack/react-table";
// import { Search } from "lucide-react";

// interface CustomTableProps<T> {
//   data: T[];
//   columns: ColumnDef<T, any>[];
//   emptyMessage?: string;
//   showGlobalFilter?: boolean;

//   // NEW FEATURES
//   onRowClick?: (rowData: T) => void;
//   renderSubComponent?: (rowData: T) => React.ReactNode;
// }

// export function CustomTable<T>({
//   data,
//   columns,
//   emptyMessage = "No data available",
//   showGlobalFilter = true,
//   onRowClick,
//   renderSubComponent,
// }: CustomTableProps<T>) {
//   const [sorting, setSorting] = useState<SortingState>([]);
//   const [columnFilters, setColumnFilters] =
//     useState<ColumnFiltersState>([]);
//   const [globalFilter, setGlobalFilter] =
//     useState("");
//   const [expanded, setExpanded] =
//     useState<ExpandedState>({});

//   const table = useReactTable({
//     data,
//     columns,

//     state: {
//       sorting,
//       columnFilters,
//       globalFilter,
//       expanded,
//     },

//     onSortingChange: setSorting,
//     onColumnFiltersChange: setColumnFilters,
//     onGlobalFilterChange: setGlobalFilter,
//     onExpandedChange: setExpanded,

//     getCoreRowModel: getCoreRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     getFacetedRowModel: getFacetedRowModel(),
//     getFacetedUniqueValues:
//       getFacetedUniqueValues(),
//     getExpandedRowModel: getExpandedRowModel(),
//   });

//   return (
//     <div className="w-full space-y-4">

//       {/* Global Search */}
//       {showGlobalFilter && (
//         <div className="flex items-center justify-end px-6 py-4 border-b bg-white rounded-t-lg">

//           <div className="relative w-80">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

//             <input
//               value={globalFilter ?? ""}
//               onChange={(e) =>
//                 setGlobalFilter(e.target.value)
//               }
//               placeholder="Search ..."
//               className="
//                 w-full
//                 pl-10 pr-4 py-2.5
//                 rounded-md
//                 border border-gray-300
//                 bg-white
//                 text-sm
//                 shadow-sm
//                 focus:outline-none
//                 focus:ring-2
//                 focus:ring-[#D73D32]
//                 focus:border-[#D73D32]
//                 transition-all
//               "
//             />
//           </div>

//         </div>
//       )}

//       {/* Table */}
//       <div className="w-full overflow-x-auto border rounded-lg">
//         <table className="w-full min-w-[700px]">

//           {/* Header */}
//           <thead className="bg-[#EFEFEF]">
//             {table.getHeaderGroups().map(
//               (headerGroup) => (
//                 <tr key={headerGroup.id}>
//                   {headerGroup.headers.map(
//                     (header) => {

//                       const canSort =
//                         header.column.getCanSort();

//                       return (
//                         <th
//                           key={header.id}
//                           onClick={
//                             canSort
//                               ? header.column.getToggleSortingHandler()
//                               : undefined
//                           }
//                           className={`px-6 py-4 text-left text-sm font-semibold whitespace-nowrap ${
//                             canSort
//                               ? "cursor-pointer select-none"
//                               : ""
//                           }`}
//                         >
//                           <div className="flex items-center gap-2">
//                             {flexRender(
//                               header.column.columnDef.header,
//                               header.getContext()
//                             )}

//                             {{
//                               asc: "↑",
//                               desc: "↓",
//                             }[
//                               header.column.getIsSorted() as string
//                             ] ?? null}
//                           </div>
//                         </th>
//                       );
//                     }
//                   )}
//                 </tr>
//               )
//             )}
//           </thead>

//           {/* Body */}
//           <tbody className="divide-y">
//             {table.getRowModel().rows.length === 0 ? (
//               <tr>
//                 <td
//                   colSpan={columns.length}
//                   className="text-center py-8 text-gray-500"
//                 >
//                   {emptyMessage}
//                 </td>
//               </tr>
//             ) : (
//               table.getRowModel().rows.map((row) => (
//                 <React.Fragment key={row.id}>

//                   {/* Main Row */}
//                   <tr
//                     className="hover:bg-gray-50 cursor-pointer transition"
//                     onClick={() => {
//                       row.toggleExpanded();
//                       onRowClick?.(row.original);
//                     }}
//                   >
//                     {row.getVisibleCells().map(
//                       (cell) => (
//                         <td
//                           key={cell.id}
//                           className="px-6 py-4 whitespace-nowrap"
//                         >
//                           {flexRender(
//                             cell.column.columnDef.cell,
//                             cell.getContext()
//                           )}
//                         </td>
//                       )
//                     )}
//                   </tr>

//                   {/* Expanded Row */}
//                   {row.getIsExpanded() &&
//                     renderSubComponent && (
//                       <tr>
//                         <td
//                           colSpan={
//                             row.getVisibleCells().length
//                           }
//                           className="bg-gray-50 px-6 py-4"
//                         >
//                           {renderSubComponent(
//                             row.original
//                           )}
//                         </td>
//                       </tr>
//                     )}

//                 </React.Fragment>
//               ))
//             )}
//           </tbody>

//         </table>
//       </div>

//     </div>
//   );
// }


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
} from "@tanstack/react-table";
import { Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface CustomTableProps<T> {
  data: T[];
  columns: ColumnDef<T, any>[];
  emptyMessage?: string;
  showGlobalFilter?: boolean;
  onRowClick?: (rowData: T) => void;
  renderSubComponent?: (rowData: T) => React.ReactNode;
}

export function CustomTable<T>({
  data,
  columns,
  emptyMessage = "No data available",
  showGlobalFilter = true,
  onRowClick,
  renderSubComponent,
}: CustomTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [expanded, setExpanded] = useState<ExpandedState>({});
  
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      expanded,
      pagination,
    },
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

  return (
    <div className="w-full space-y-6 bg-white rounded-2xl shadow-xl border border-gray-200">
      
      {/* Global Search */}
      {showGlobalFilter && (
        <div className="px-6 py-6 border-b border-gray-100 bg-gray-50 rounded-t-2xl">
          <div className="relative w-full max-w-lg">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search all columns..."
              className="
                w-full pl-14 pr-5 py-3.5 text-base
                rounded-xl border-2 border-gray-200
                bg-white font-semibold
                shadow-sm
                focus:outline-none focus:ring-3 focus:ring-primary/20 focus:border-primary
                transition-all duration-200 placeholder-gray-500
              "
            />
          </div>
        </div>
      )}

      {/* Responsive Table Container */}
      <div className="overflow-hidden rounded-b-2xl">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            
            {/* Enhanced Header - Larger Font */}
            <thead className="bg-gray-50">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const canSort = header.column.getCanSort();
                    return (
                      <th
                        key={header.id}
                        onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                        className={`
                          px-6 py-5 text-left text-base font-bold text-gray-900 whitespace-nowrap
                          ${canSort ? "cursor-pointer hover:bg-gray-100 hover:shadow-sm transition-all" : ""}
                          border-b-2 border-gray-200
                        `}
                      >
                        <div className="flex items-center gap-2">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: <span className="text-primary text-lg font-black">↑</span>,
                            desc: <span className="text-primary text-lg font-black">↓</span>,
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>

            {/* Enhanced Body - Larger Font & Better Spacing */}
            <tbody className="divide-y divide-gray-100 bg-white">
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td 
                    colSpan={columns.length} 
                    className="text-center py-20 text-gray-500"
                  >
                    <div className="space-y-4">
                      <div className="w-20 h-20 mx-auto bg-gray-100 rounded-2xl flex items-center justify-center">
                        <Search className="w-10 h-10 text-gray-400" />
                      </div>
                      <p className="text-2xl font-bold text-gray-400">{emptyMessage}</p>
                    </div>
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <React.Fragment key={row.id}>
                    <tr
                      className={`
                        hover:bg-gray-50/70 transition-all duration-200 border-b border-gray-50
                        ${onRowClick ? 'cursor-pointer hover:shadow-sm' : ''}
                      `}
                      onClick={() => {
                        row.toggleExpanded();
                        onRowClick?.(row.original);
                      }}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className="px-6 py-5 text-base font-semibold text-gray-900 min-w-[150px] max-w-[250px]"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>

                    {row.getIsExpanded() && renderSubComponent && (
                      <tr>
                        <td
                          colSpan={row.getVisibleCells().length}
                          className="bg-primary/5 px-6 py-6 border-t-2 border-primary/20"
                        >
                          {renderSubComponent(row.original)}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enhanced Pagination */}
      <div className="px-6 py-6 border-t-2 border-gray-100 bg-gray-50 rounded-b-2xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Page Info */}
          <div className="text-base font-semibold text-gray-800">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            <span className="ml-4 text-sm text-gray-600">
              ({table.getFilteredRowModel().rows.length} total rows)
            </span>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              className="
                p-3 rounded-xl text-gray-500 hover:text-primary hover:bg-primary/10
                disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200
                border border-gray-200 hover:border-primary/50 hover:shadow-md
                flex-shrink-0
              "
            >
              <ChevronsLeft className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="
                p-3 rounded-xl text-gray-500 hover:text-primary hover:bg-primary/10
                disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200
                border border-gray-200 hover:border-primary/50 hover:shadow-md
              "
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="
                p-3 rounded-xl text-gray-500 hover:text-primary hover:bg-primary/10
                disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200
                border border-gray-200 hover:border-primary/50 hover:shadow-md
              "
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <button
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              className="
                p-3 rounded-xl text-gray-500 hover:text-primary hover:bg-primary/10
                disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200
                border border-gray-200 hover:border-primary/50 hover:shadow-md
              "
            >
              <ChevronsRight className="w-5 h-5" />
            </button>

            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
              className="
                px-4 py-2.5 text-base font-semibold
                border-2 border-gray-200 rounded-xl
                focus:outline-none focus:ring-3 focus:ring-primary/20 focus:border-primary
                bg-white shadow-md hover:shadow-lg transition-all duration-200
              "
            >
              {[10, 25, 50, 100].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
