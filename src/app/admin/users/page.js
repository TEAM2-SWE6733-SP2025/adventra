"use client";

import { useEffect, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import Card from "@/app/components/Card";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [globalFilter, setGlobalFilter] = useState(""); // State for global search

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/admin/users");
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await response.json();
        setUsers(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to load users.");
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Define table columns
  const columns = [
    {
      accessorKey: "name", // Accessor for the "name" field
      header: "Name",
    },
    {
      accessorKey: "email", // Accessor for the "email" field
      header: "Email",
    },
    {
      accessorFn: (row) => (row.isAdmin ? "Admin" : "User"), // Custom accessor for role
      id: "role", // Unique ID for the column
      header: "Role",
    },
  ];

  // React Table setup
  const table = useReactTable({
    data: users,
    columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  if (loading) {
    return <p className="text-gray-300">Loading users...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="min-h-screen p-6">
      <Card>
        <h2 className="text-3xl font-bold mb-6">Users</h2>
        <p className="mb-6 text-gray-400">
          Manage all users in the application.
        </p>

        {/* Search Input */}
        <div className="mb-4">
          <input
            type="text"
            value={globalFilter || ""}
            onChange={(e) => setGlobalFilter(e.target.value || undefined)} // Set global filter
            placeholder="Search by name or email"
            className="w-full p-2 border border-gray-700 rounded bg-gray-800 text-white"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-800 text-white border border-gray-700 rounded-lg">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr
                  key={headerGroup.id} // Add key for header group
                  className="bg-gray-700 text-gray-300"
                >
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id} // Add key for each column
                      className="py-2 px-4 text-left"
                    >
                      {header.isPlaceholder
                        ? null
                        : header.renderHeader
                          ? header.renderHeader()
                          : header.column.columnDef.header}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id} // Add key for each row
                    className="border-t border-gray-700"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id} // Add key for each cell
                        className="py-2 px-4"
                      >
                        {cell.renderCell
                          ? cell.renderCell()
                          : cell.column.columnDef.cell
                            ? cell.column.columnDef.cell(cell.getContext())
                            : cell.getValue()}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="py-4 px-4 text-center text-gray-400"
                  >
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
