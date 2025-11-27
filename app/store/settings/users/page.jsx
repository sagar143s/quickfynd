"use client";
import { useState } from "react";
import { useAuth } from "@/lib/useAuth";
import Link from "next/link";
import axios from "axios";

// Dummy users for UI demo
const dummyUsers = [
  { id: 1, email: "user1@example.com", role: "admin" },
  { id: 2, email: "user2@example.com", role: "user" },
];

export default function ManageStoreUsers() {
  const { user, getToken } = useAuth();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [inviting, setInviting] = useState(false);
  const [users, setUsers] = useState(dummyUsers); // Replace with real fetch

  const handleInvite = async (e) => {
    e.preventDefault();
    setInviting(true);
    setMessage("");
    try {
      const token = await getToken();
      // TODO: Call backend to invite user, e.g.:
      // await axios.post('/api/store/users/invite', { email }, { headers: { Authorization: `Bearer ${token}` } });
      setUsers([...users, { id: Date.now(), email, role: "user" }]);
      setMessage("Invitation sent!");
      setEmail("");
    } catch (err) {
      setMessage(err?.response?.data?.error || err.message);
    }
    setInviting(false);
  };

  const handleDelete = async (id) => {
    // TODO: Call backend to delete user, e.g.:
    // const token = await getToken();
    // await axios.delete(`/api/store/users/${id}`, { headers: { Authorization: `Bearer ${token}` } });
    setUsers(users.filter(u => u.id !== id));
  };

  const handleMakeAdmin = async (id) => {
    // TODO: Call backend to update user role, e.g.:
    // const token = await getToken();
    // await axios.post(`/api/store/users/make-admin`, { id }, { headers: { Authorization: `Bearer ${token}` } });
    setUsers(users.map(u => u.id === id ? { ...u, role: "admin" } : u));
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-56 bg-slate-50 border-r flex flex-col gap-2 p-6">
        <Link href="/store/settings" className="mb-2 px-4 py-2 rounded bg-slate-200 text-slate-700 text-center hover:bg-slate-300 transition">Settings</Link>
        <Link href="/store/settings/users" className="px-4 py-2 rounded bg-blue-600 text-white text-center hover:bg-blue-700 transition">Manage Users</Link>
      </div>
      <div className="flex-1 flex flex-col items-center justify-start mt-10">
        <div className="max-w-xl w-full p-6 bg-white rounded shadow">
          <h2 className="text-2xl font-bold mb-4">Manage Store Users</h2>
          <form onSubmit={handleInvite} className="flex flex-col gap-4 mb-6">
            <label className="flex flex-col gap-1">
              Invite User by Email
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="border p-2 rounded" required />
            </label>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={inviting}>
              {inviting ? "Inviting..." : "Send Invite"}
            </button>
            {message && <div className="text-green-600 mt-2">{message}</div>}
          </form>
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-2">Current Users</h3>
            <ul className="divide-y">
              {users.map(u => (
                <li key={u.id} className="flex items-center justify-between py-2">
                  <span>{u.email} <span className="ml-2 text-xs text-slate-500">({u.role})</span></span>
                  <div className="flex gap-2">
                    {u.role !== "admin" && (
                      <button onClick={() => handleMakeAdmin(u.id)} className="px-2 py-1 bg-green-500 text-white rounded text-xs">Make Admin</button>
                    )}
                    <button onClick={() => handleDelete(u.id)} className="px-2 py-1 bg-red-500 text-white rounded text-xs">Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
