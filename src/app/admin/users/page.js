"use client";

import { useEffect, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import Card from "@/app/components/Card";
import Button from "@/app/components/Button";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [globalFilter, setGlobalFilter] = useState("");
  const [editingUser, setEditingUser] = useState(null);

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

  const handleEditUser = (user) => {
    setEditingUser(user);
  };

  const handleSaveUser = async () => {
    try {
      const response = await fetch(`/api/admin/users/${editingUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingUser),
      });
      if (!response.ok) {
        throw new Error("Failed to save user");
      }
      const updatedUser = await response.json();
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === updatedUser.id ? updatedUser : user,
        ),
      );
      setEditingUser(null);
    } catch (err) {
      console.error("Error saving user:", err);
      alert("Failed to save user.");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete user");
      }
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Failed to delete user.");
    }
  };

  const columns = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) =>
        editingUser?.id === row.original.id ? (
          <input
            type="text"
            value={editingUser.name}
            onChange={(e) =>
              setEditingUser((prev) => ({ ...prev, name: e.target.value }))
            }
            className="w-full p-1 border border-gray-700 rounded bg-gray-800 text-white"
          />
        ) : (
          row.original.name
        ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) =>
        editingUser?.id === row.original.id ? (
          <input
            type="email"
            value={editingUser.email}
            onChange={(e) =>
              setEditingUser((prev) => ({ ...prev, email: e.target.value }))
            }
            className="w-full p-1 border border-gray-700 rounded bg-gray-800 text-white"
          />
        ) : (
          row.original.email
        ),
    },
    {
      accessorFn: (row) => (row.isAdmin ? "Admin" : "User"),
      id: "role",
      header: "Role",
      cell: ({ row }) =>
        editingUser?.id === row.original.id ? (
          <select
            value={editingUser.isAdmin ? "Admin" : "User"}
            onChange={(e) =>
              setEditingUser((prev) => ({
                ...prev,
                isAdmin: e.target.value === "Admin",
              }))
            }
            className="w-full p-1 border border-gray-700 rounded bg-gray-800 text-white"
          >
            <option value="User">User</option>
            <option value="Admin">Admin</option>
          </select>
        ) : row.original.isAdmin ? (
          "Admin"
        ) : (
          "User"
        ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          {editingUser?.id === row.original.id ? (
            <>
              <Button onClick={handleSaveUser} className="bg-green-500">
                Save
              </Button>
              <Button
                onClick={() => setEditingUser(null)}
                className="bg-gray-500"
              >
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={() => handleEditUser(row.original)}
                className="bg-blue-500"
              >
                Edit
              </Button>
              <Button
                onClick={() => handleDeleteUser(row.original.id)}
                className="bg-red-500"
              >
                Delete
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

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

        <div className="mb-4">
          <input
            type="text"
            value={globalFilter || ""}
            onChange={(e) => setGlobalFilter(e.target.value || undefined)}
            placeholder="Search by name or email"
            className="w-full p-2 border border-gray-700 rounded bg-gray-800 text-white"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-800 text-white border border-gray-700 rounded-lg">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="bg-gray-700 text-gray-300">
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="py-2 px-4 text-left">
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
                    key={row.id}
                    className="border-t border-gray-700 hover:bg-gray-700"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="py-2 px-4">
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
