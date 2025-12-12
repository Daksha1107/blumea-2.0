'use client';

import React, { useState } from 'react';
import { User } from '@/types';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Edit2, History } from 'lucide-react';

interface UserTableProps {
  users: (User & { _id: { toString: () => string } })[];
  onUpdateRole: (userId: string, role: string) => Promise<void>;
  onUpdateStatus: (userId: string, status: 'active' | 'disabled') => Promise<void>;
  currentUserId?: string;
}

const roles = [
  { value: 'viewer', label: 'Viewer' },
  { value: 'contributor', label: 'Contributor' },
  { value: 'editor', label: 'Editor' },
  { value: 'seo', label: 'SEO' },
  { value: 'publisher', label: 'Publisher' },
  { value: 'admin', label: 'Admin' },
];

export function UserTable({ users, onUpdateRole, onUpdateStatus, currentUserId }: UserTableProps) {
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editingRole, setEditingRole] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState(false);

  const startEdit = (user: User & { _id: { toString: () => string } }) => {
    setEditingUserId(user._id.toString());
    setEditingRole(user.role);
  };

  const cancelEdit = () => {
    setEditingUserId(null);
    setEditingRole('');
  };

  const saveRole = async (userId: string) => {
    setIsUpdating(true);
    try {
      await onUpdateRole(userId, editingRole);
      setEditingUserId(null);
    } catch (error) {
      console.error('Failed to update role:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const toggleStatus = async (userId: string, currentStatus: 'active' | 'disabled') => {
    const newStatus = currentStatus === 'active' ? 'disabled' : 'active';
    try {
      await onUpdateStatus(userId, newStatus);
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  if (users.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No users found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="text-left p-3 font-medium">Name</th>
            <th className="text-left p-3 font-medium">Email</th>
            <th className="text-left p-3 font-medium">Role</th>
            <th className="text-left p-3 font-medium">Status</th>
            <th className="text-left p-3 font-medium">Last Login</th>
            <th className="text-left p-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            const userId = user._id.toString();
            const isEditing = editingUserId === userId;
            const isCurrentUser = userId === currentUserId;

            return (
              <tr key={userId} className="border-b hover:bg-muted/50">
                <td className="p-3">{user.name}</td>
                <td className="p-3 text-muted-foreground">{user.email}</td>
                <td className="p-3">
                  {isEditing ? (
                    <div className="flex gap-2 items-center">
                      <select
                        value={editingRole}
                        onChange={(e) => setEditingRole(e.target.value)}
                        className="h-8 rounded-md border border-input bg-background px-2 text-sm"
                        disabled={isUpdating}
                      >
                        {roles.map((r) => (
                          <option key={r.value} value={r.value}>
                            {r.label}
                          </option>
                        ))}
                      </select>
                      <Button
                        size="sm"
                        onClick={() => saveRole(userId)}
                        disabled={isUpdating}
                      >
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={cancelEdit}
                        disabled={isUpdating}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded-md bg-muted text-sm font-medium capitalize">
                      {user.role}
                    </span>
                  )}
                </td>
                <td className="p-3">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-md text-sm font-medium ${
                      user.status === 'active'
                        ? 'bg-green-500/10 text-green-600'
                        : 'bg-red-500/10 text-red-600'
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="p-3 text-muted-foreground text-sm">
                  {user.lastLogin
                    ? new Date(user.lastLogin).toLocaleDateString()
                    : 'Never'}
                </td>
                <td className="p-3">
                  <div className="flex gap-2">
                    {!isEditing && !isCurrentUser && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => startEdit(user)}
                          title="Edit Role"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleStatus(userId, user.status)}
                          title={user.status === 'active' ? 'Disable' : 'Enable'}
                        >
                          {user.status === 'active' ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>
                      </>
                    )}
                    {isCurrentUser && (
                      <span className="text-xs text-muted-foreground">You</span>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
