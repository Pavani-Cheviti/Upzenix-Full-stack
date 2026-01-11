import React, { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table';
import { ChevronUp, ChevronDown, Edit, Trash2, Plus, X, Save, Download, FileText } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useAudit } from '../contexts/AuditContext';
import Papa from 'papaparse';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const initialData = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Admin',
    status: 'Active',
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'User',
    status: 'Active',
  },
  {
    id: 3,
    name: 'Bob Johnson',
    email: 'bob@example.com',
    role: 'Moderator',
    status: 'Inactive',
  },
  {
    id: 4,
    name: 'Alice Brown',
    email: 'alice@example.com',
    role: 'User',
    status: 'Active',
  },
  {
    id: 5,
    name: 'Charlie Wilson',
    email: 'charlie@example.com',
    role: 'User',
    status: 'Active',
  },
];

const Tables = () => {
  const { permissions } = useAuth();
  const { logAction } = useAudit();
  const [data, setData] = useState(initialData);
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'User',
    status: 'Active',
  });

  const handleAdd = () => {
    if (!permissions.canEditUsers) return;
    setIsAdding(true);
    setFormData({ name: '', email: '', role: 'User', status: 'Active' });
    logAction('USER_ADD_INITIATED', 'Started adding new user');
  };

  const handleEdit = (user) => {
    if (!permissions.canEditUsers) return;
    setEditingId(user.id);
    setFormData({ ...user });
    logAction('USER_EDIT_INITIATED', `Started editing user ${user.name} (${user.id})`);
  };

  const handleSave = () => {
    if (isAdding) {
      const newUser = {
        ...formData,
        id: Math.max(...data.map(u => u.id)) + 1,
      };
      setData([...data, newUser]);
      setIsAdding(false);
      logAction('USER_CREATED', `Created new user: ${newUser.name} (${newUser.email})`);
    } else {
      setData(data.map(user =>
        user.id === editingId ? { ...formData, id: editingId } : user
      ));
      setEditingId(null);
      logAction('USER_UPDATED', `Updated user ${formData.name} (${editingId})`);
    }
    setFormData({ name: '', email: '', role: 'User', status: 'Active' });
  };

  const handleDelete = (id) => {
    if (!permissions.canDeleteUsers) return;
    if (window.confirm('Are you sure you want to delete this user?')) {
      const userToDelete = data.find(user => user.id === id);
      setData(data.filter(user => user.id !== id));
      logAction('USER_DELETED', `Deleted user: ${userToDelete.name} (${userToDelete.email})`);
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ name: '', email: '', role: 'User', status: 'Active' });
  };

  const exportToCSV = () => {
    if (!permissions.canExportData) return;
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'users.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    logAction('DATA_EXPORTED', 'Exported users data to CSV');
  };

  const exportToPDF = () => {
    if (!permissions.canExportData) return;
    const doc = new jsPDF();
    doc.autoTable({
      head: [['ID', 'Name', 'Email', 'Role', 'Status']],
      body: data.map(user => [user.id, user.name, user.email, user.role, user.status]),
    });
    doc.save('users.pdf');
    logAction('DATA_EXPORTED', 'Exported users data to PDF');
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        cell: ({ row }) => row.original.id === 'new' ? 'New' : row.original.id,
      },
      {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => {
          const isEditing = editingId === row.original.id || (isAdding && row.original.id === 'new');
          return isEditing ? (
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          ) : (
            row.original.name
          );
        },
      },
      {
        accessorKey: 'email',
        header: 'Email',
        cell: ({ row }) => {
          const isEditing = editingId === row.original.id || (isAdding && row.original.id === 'new');
          return isEditing ? (
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          ) : (
            row.original.email
          );
        },
      },
      {
        accessorKey: 'role',
        header: 'Role',
        cell: ({ row }) => {
          const isEditing = editingId === row.original.id || (isAdding && row.original.id === 'new');
          return isEditing ? (
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="Admin">Admin</option>
              <option value="Moderator">Moderator</option>
              <option value="User">User</option>
            </select>
          ) : (
            row.original.role
          );
        },
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
          const isEditing = editingId === row.original.id || (isAdding && row.original.id === 'new');
          if (isEditing) {
            return (
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            );
          }
          return (
            <span
              className={`px-2 py-1 text-xs rounded-full ${
                row.original.status === 'Active'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
              }`}
            >
              {row.original.status}
            </span>
          );
        },
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
          const isEditing = editingId === row.original.id || (isAdding && row.original.id === 'new');
          if (isEditing) {
            return (
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  className="p-1 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                  title="Save"
                >
                  <Save className="w-4 h-4" />
                </button>
                <button
                  onClick={handleCancel}
                  className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                  title="Cancel"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            );
          }
          return (
            <div className="flex space-x-2">
              {permissions.canEditUsers && (
                <button
                  onClick={() => handleEdit(row.original)}
                  className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  title="Edit"
                >
                  <Edit className="w-4 h-4" />
                </button>
              )}
              {permissions.canDeleteUsers && (
                <button
                  onClick={() => handleDelete(row.original.id)}
                  className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          );
        },
      },
    ],
    [editingId, isAdding, formData, permissions]
  );

  const tableData = useMemo(() => {
    return isAdding ? [...data, { id: 'new', ...formData }] : data;
  }, [data, isAdding, formData]);

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      globalFilter,
    },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Users Management</h1>
        <div className="flex space-x-4">
          {permissions.canExportData && (
            <>
              <button
                onClick={exportToCSV}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>CSV</span>
              </button>
              <button
                onClick={exportToPDF}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <FileText className="w-4 h-4" />
                <span>PDF</span>
              </button>
            </>
          )}
          {permissions.canEditUsers && (
            <button
              onClick={handleAdd}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add User</span>
            </button>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <input
            value={globalFilter ?? ''}
            onChange={(event) => setGlobalFilter(String(event.target.value))}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 w-full max-w-sm"
            placeholder="Search users..."
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="flex items-center space-x-1">
                        <span>
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                        </span>
                        {{
                          asc: <ChevronUp className="w-4 h-4" />,
                          desc: <ChevronDown className="w-4 h-4" />,
                        }[header.column.getIsSorted()] ?? null}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
            {Math.min(
              (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
              table.getFilteredRowModel().rows.length
            )}{' '}
            of {table.getFilteredRowModel().rows.length} results
          </div>
          <div className="flex space-x-2">
            <button
              className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </button>
            <button
              className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tables;