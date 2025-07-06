'use client';

import { useState, useEffect, FormEvent } from 'react';

interface User {
  id: string;
  email: string;
  name?: string;
}

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      if (!res.ok) {
        throw new Error('Failed to fetch users');
      }
      const data: User[] = await res.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleAddUser = async (e: FormEvent) => {
    e.preventDefault();
    if (!newUserEmail.trim()) return;

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: newUserEmail, name: newUserName || null }),
      });
      if (!res.ok) {
        throw new Error('Failed to add user');
      }
      const addedUser: User = await res.json();
      setUsers((prevUsers) => [...prevUsers, addedUser]);
      setNewUserEmail('');
      setNewUserName('');
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setNewUserEmail(user.email);
    setNewUserName(user.name || '');
  };

  const handleUpdateUser = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingUser || !newUserEmail.trim()) return;

    try {
      const res = await fetch(`/api/users/${editingUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: newUserEmail, name: newUserName || null }),
      });
      if (!res.ok) {
        throw new Error('Failed to update user');
      }
      const updatedUser: User = await res.json();
      setUsers((prevUsers) =>
        prevUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user))
      );
      setEditingUser(null);
      setNewUserEmail('');
      setNewUserName('');
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      const res = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        throw new Error('Failed to delete user');
      }
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col items-center py-10">
      <h1 className="text-4xl font-bold text-blue-800 mb-8">User Management</h1>

      <form onSubmit={editingUser ? handleUpdateUser : handleAddUser} className="flex flex-col gap-4 mb-8 w-full max-w-md">
        <input
          type="email"
          value={newUserEmail}
          onChange={(e) => setNewUserEmail(e.target.value)}
          placeholder="User Email"
          className="p-3 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
          required
        />
        <input
          type="text"
          value={newUserName}
          onChange={(e) => setNewUserName(e.target.value)}
          placeholder="User Name (optional)"
          className="p-3 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
        />
        <button
          type="submit"
          className="px-5 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {editingUser ? 'Update User' : 'Add User'}
        </button>
        {editingUser && (
          <button
            type="button"
            onClick={() => {
              setEditingUser(null);
              setNewUserEmail('');
              setNewUserName('');
            }}
            className="px-5 py-3 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel Edit
          </button>
        )}
      </form>

      <ul className="w-full max-w-md bg-white shadow-lg rounded-lg p-4">
        {users.length === 0 ? (
          <p className="text-center text-gray-500">No users yet. Add one above!</p>
        ) : (
          users.map((user) => (
            <li
              key={user.id}
              className="flex items-center justify-between p-3 border-b border-blue-100 last:border-b-0"
            >
              <div className="flex flex-col">
                <span className="text-lg text-blue-700">{user.email}</span>
                {user.name && <span className="text-sm text-gray-500">{user.name}</span>}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditUser(user)}
                  className="px-3 py-1 rounded-md bg-yellow-400 text-white text-sm hover:bg-yellow-500"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteUser(user.id)}
                  className="px-3 py-1 bg-red-400 text-white rounded-md hover:bg-red-500 text-sm"
                >
                  Delete
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
