import React, { useState } from "react";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    SortingState,
    ColumnFiltersState,
    useReactTable,
} from "@tanstack/react-table";
import { Search } from "lucide-react";

interface CustomTableProps<T> {
    data: T[];
    columns: ColumnDef<T, any>[];
    emptyMessage?: string;
    showGlobalFilter?: boolean;
}

export function CustomTable<T>({
    data,
    columns,
    emptyMessage = "No data available",
    showGlobalFilter = true,
}: CustomTableProps<T>) {

    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] =
        useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] =
        useState("");

    const table = useReactTable({
        data,
        columns,

        state: {
            sorting,
            columnFilters,
            globalFilter,
        },

        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,

        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),

        getFilteredRowModel: getFilteredRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues:
            getFacetedUniqueValues(),
    });

    return (
        <div className="w-full space-y-4">

            {/* Global Search */}
            {showGlobalFilter && (
                <div className="flex items-center justify-between px-6 py-4 border-b bg-white rounded-t-lg">

                    {/* Left side title (optional) */}
                    {/* <div className="text-sm font-medium text-gray-700">
                        Search Categories
                    </div> */}

                    {/* Right side search */}
                    <div className="relative w-80">

                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

                        <input
                            value={globalFilter ?? ""}
                            onChange={(e) =>
                                setGlobalFilter(e.target.value)
                            }
                            placeholder="Search ..."
                            className="
          w-full
          pl-10 pr-4 py-2.5
          rounded-md
          border border-gray-300
          bg-white
          text-sm
          shadow-sm
          focus:outline-none
          focus:ring-2
          focus:ring-[#D73D32]
          focus:border-[#D73D32]
          transition-all
        "
                        />

                    </div>

                </div>
            )}
            {/* Table */}
            <div className="w-full overflow-x-auto border rounded-lg">

                <table className="w-full min-w-[700px]">

                    {/* Header */}
                    <thead className="bg-[#EFEFEF]">

                        {table.getHeaderGroups().map(
                            (headerGroup) => (
                                <tr key={headerGroup.id}>

                                    {headerGroup.headers.map(
                                        (header) => {

                                            const canSort =
                                                header.column.getCanSort();

                                            return (
                                                <th
                                                    key={header.id}
                                                    onClick={
                                                        canSort
                                                            ? header.column.getToggleSortingHandler()
                                                            : undefined
                                                    }
                                                    className={`px-6 py-4 text-left text-sm font-semibold whitespace-nowrap ${canSort
                                                        ? "cursor-pointer select-none"
                                                        : ""
                                                        }`}
                                                >

                                                    <div className="flex items-center gap-2">

                                                        {flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext()
                                                        )}

                                                        {/* Sort Indicator */}
                                                        {{
                                                            asc: "↑",
                                                            desc: "↓",
                                                        }[
                                                            header.column.getIsSorted() as string
                                                        ] ?? null}

                                                    </div>

                                                </th>
                                            );
                                        }
                                    )}

                                </tr>
                            )
                        )}

                    </thead>

                    {/* Body */}
                    <tbody className="divide-y">

                        {table.getRowModel().rows.length ===
                            0 ? (

                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="text-center py-8 text-gray-500"
                                >
                                    {emptyMessage}
                                </td>
                            </tr>

                        ) : (

                            table
                                .getRowModel()
                                .rows.map((row) => (

                                    <tr
                                        key={row.id}
                                        className="hover:bg-gray-50"
                                    >

                                        {row
                                            .getVisibleCells()
                                            .map((cell) => (

                                                <td
                                                    key={cell.id}
                                                    className="px-6 py-4 whitespace-nowrap"
                                                >

                                                    {flexRender(
                                                        cell.column.columnDef.cell,
                                                        cell.getContext()
                                                    )}

                                                </td>

                                            ))}

                                    </tr>

                                ))

                        )}

                    </tbody>

                </table>

            </div>

        </div>
    );
}