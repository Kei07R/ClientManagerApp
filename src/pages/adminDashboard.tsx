import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import CustomNavbar from "@/components/CustomNavbar";
import { UserCircle } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
}

const AdminDashboard = () => {
  const [clients, setClients] = useState<User[]>([]);
  const [managers, setManagers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  const [updateUser, setUpdateUser] = useState<{
    type: "client" | "manager";
    data: User | null;
  }>({ type: "client", data: null });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }

    const fetchDataWrapper = async () => {
      await fetchData(token);
    };

    fetchDataWrapper();
  }, []);

  const fetchData = async (token: string) => {
    try {
      const [clientsRes, managersRes] = await Promise.all([
        fetch("/api/admin/clients", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("/api/admin/managers", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const clientsData = await clientsRes.json();
      const managersData = await managersRes.json();

      if (!clientsRes.ok || !managersRes.ok) {
        setError(
          clientsData.message || managersData.message || "Failed to fetch data"
        );
      } else {
        setClients(clientsData.clients || []);
        setManagers(managersData.managers || []);
      }
    } catch {
      setError("An error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (type: "manager" | "client", id: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return;

    try {
      const res = await fetch(`/api/admin/${type}s/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (!res.ok) return alert(data.message || `Failed to delete ${type}`);

      if (type === "client") {
        setClients((prev) => prev.filter((c) => c.id !== id));
      } else {
        setManagers((prev) => prev.filter((m) => m.id !== id));
      }
    } catch {
      alert(`Error deleting ${type}`);
    }
  };

  const handleUpdate = async () => {
    const token = localStorage.getItem("token");
    if (!token || !updateUser.data) return;

    const { id, name, email, phone, password } = updateUser.data;

    try {
      const res = await fetch(`/api/admin/${updateUser.type}s/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, email, phone, password }),
      });

      const data = await res.json();
      if (!res.ok) return alert(data.message || "Failed to update");

      if (updateUser.type === "client") {
        setClients((prev) => prev.map((c) => (c.id === id ? data.client : c)));
      }

      setUpdateUser({ type: "client", data: null });
      (document.getElementById("update-user-modal") as HTMLInputElement).checked = false;
    } catch {
      alert("Update failed");
    }
  };

  const openUpdateModal = (type: "client", user: User) => {
    setUpdateUser({ type, data: user });
    (document.getElementById("update-user-modal") as HTMLInputElement).checked = true;
  };

  return (
    <div className="min-h-screen bg-base-100">
      <CustomNavbar />
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Admin Dashboard</h1>
        {loading && <p className="text-center">Loading data...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && !error && (
          <>
            {/* Managers Table */}
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-2">Managers</h2>
              <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                  <thead>
                    <tr>
                      <th></th>
                      <th>ID</th>
                      <th>Email</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {managers.map((m) => (
                      <tr key={m.id}>
                        <td>
                          <div className="avatar">
                            <div className="w-8 rounded-full bg-neutral-focus text-neutral-content">
                              <UserCircle className="w-full h-full p-1" />
                            </div>
                          </div>
                        </td>
                        <td>{m.id}</td>
                        <td>{m.email}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline btn-error"
                            onClick={() => handleDelete("manager", m.id)}
                          >
                            Delete
                          </button>
                          {/* No update button for managers */}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Clients Table */}
            <div>
              <h2 className="text-xl font-bold mb-2">Clients</h2>
              <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                  <thead>
                    <tr>
                      <th></th>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clients.map((c) => (
                      <tr key={c.id}>
                        <td>
                          <div className="avatar">
                            <div className="w-8 rounded-full bg-neutral-focus text-neutral-content">
                              <UserCircle className="w-full h-full p-1" />
                            </div>
                          </div>
                        </td>
                        <td>{c.id}</td>
                        <td>{c.name}</td>
                        <td>{c.email}</td>
                        <td>{c.phone}</td>
                        <td className="flex gap-2">
                          <button
                            className="btn btn-sm btn-outline btn-error"
                            onClick={() => handleDelete("client", c.id)}
                          >
                            Delete
                          </button>
                          <button
                            className="btn btn-sm btn-outline btn-info"
                            onClick={() => openUpdateModal("client", c)}
                          >
                            Update
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Update Modal */}
      <input type="checkbox" id="update-user-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <h2 className="text-xl font-bold mb-4">Update {updateUser.type}</h2>
          {updateUser.data && (
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Name"
                className="input input-bordered w-full"
                value={updateUser.data.name}
                onChange={(e) =>
                  setUpdateUser((prev) => ({
                    ...prev,
                    data: { ...prev.data!, name: e.target.value },
                  }))
                }
              />
              <input
                type="email"
                placeholder="Email"
                className="input input-bordered w-full"
                value={updateUser.data.email}
                onChange={(e) =>
                  setUpdateUser((prev) => ({
                    ...prev,
                    data: { ...prev.data!, email: e.target.value },
                  }))
                }
              />
              <input
                type="tel"
                placeholder="Phone"
                className="input input-bordered w-full"
                value={updateUser.data.phone}
                onChange={(e) =>
                  setUpdateUser((prev) => ({
                    ...prev,
                    data: { ...prev.data!, phone: e.target.value },
                  }))
                }
              />
              <input
                type="password"
                placeholder="New Password"
                className="input input-bordered w-full"
                onChange={(e) =>
                  setUpdateUser((prev) => ({
                    ...prev,
                    data: { ...prev.data!, password: e.target.value },
                  }))
                }
              />
            </div>
          )}
          <div className="modal-action">
            <label htmlFor="update-user-modal" className="btn btn-ghost">
              Cancel
            </label>
            <label
              htmlFor="update-user-modal"
              className="btn btn-primary"
              onClick={handleUpdate}
            >
              Save Changes
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
