import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import CustomNavbar from "@/components/CustomNavbar";
import { UserCircle } from "lucide-react";

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  managerId: string;
}

const ClientDashboard = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [formError, setFormError] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }

    try {
      const res = await fetch("/api/client", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to fetch clients");
      } else {
        setClients(data.managerClients);
      }
    } catch {
      setError("An error occurred while fetching clients");
    } finally {
      setLoading(false);
    }
  };

  const handleAddClient = async () => {
    setFormError("");
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }

    try {
      const res = await fetch("/api/client", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setFormError(data.message || "Failed to add client");
      } else {
        setClients((prev) => [...prev, data.client]);
        setShowModal(false);
        setFormData({ name: "", email: "", phone: "", password: "" });
      }
    } catch {
      setFormError("An error occurred while adding the client");
    }
  };

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    if (!confirm("Are you sure you want to delete this client?")) return;

    try {
      const res = await fetch(`/api/client/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        setClients((prev) => prev.filter((c) => c.id !== id));
      } else {
        alert(data.message || "Failed to delete client");
      }
    } catch (error) {
      alert("Error deleting client");
      console.log(error);
    }
  };

  const [updateClient, setUpdateClient] = useState<Client | null>(null);

  const openUpdateModal = (client: Client) => {
    setUpdateClient(client);
    (
      document.getElementById("update-client-modal") as HTMLInputElement
    ).checked = true;
  };

  const handleUpdate = async () => {
    if (!updateClient) return;
    const token = localStorage.getItem("token");
    if (!token) return;

    const { name, email, phone, password } = updateClient;

    try {
      const res = await fetch(`/api/client/${updateClient.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, email, phone, password }),
      });

      const data = await res.json();
      if (res.ok) {
        setClients((prev) =>
          prev.map((c) => (c.id === updateClient.id ? data.client : c))
        );
        setUpdateClient(null);
      } else {
        alert(data.message || "Failed to update client");
      }
    } catch (err) {
      alert("Error updating client");
    }
  };

  return (
    <div className="min-h-screen bg-base-100">
      <CustomNavbar />

      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Client Dashboard</h1>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setShowModal(true)}
          >
            Add Client
          </button>
        </div>

        {loading && <p className="text-center">Loading clients...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th></th>
                  <th>Client ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Manager ID</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => (
                  <tr key={client.id}>
                    <td>
                      <div className="avatar">
                        <div className="w-8 rounded-full bg-neutral-focus text-neutral-content">
                          <UserCircle className="w-full h-full p-1" />
                        </div>
                      </div>
                    </td>
                    <td>{client.id}</td>
                    <td>{client.name}</td>
                    <td>{client.email}</td>
                    <td>{client.phone}</td>
                    <td>{client.managerId}</td>
                    <td className="flex gap-2">
                      <button
                        className="btn btn-sm btn-outline btn-error"
                        onClick={() => handleDelete(client.id)}
                      >
                        Delete
                      </button>
                      <button
                        className="btn btn-sm btn-outline btn-info"
                        onClick={() => openUpdateModal(client)}
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Client Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-base-200 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Add New Client</h2>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Name"
                className="input input-bordered w-full"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              <input
                type="email"
                placeholder="Email"
                className="input input-bordered w-full"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
              <input
                type="tel"
                placeholder="Phone"
                className="input input-bordered w-full"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
              <input
                type="password"
                placeholder="Password"
                className="input input-bordered w-full"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />

              {formError && <p className="text-red-500 text-sm">{formError}</p>}

              <div className="flex justify-end gap-2 pt-4">
                <button
                  className="btn btn-ghost"
                  onClick={() => {
                    setShowModal(false);
                    setFormError("");
                  }}
                >
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleAddClient}>
                  Add Client
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Update Client Modal */}
      <input
        type="checkbox"
        id="update-client-modal"
        className="modal-toggle"
      />
      <div className="modal">
        <div className="modal-box">
          <h2 className="text-xl font-bold mb-4">Update Client</h2>

          {updateClient && (
            <div className="space-y-3">
              <input
                type="text"
                className="input input-bordered w-full"
                placeholder="Name"
                value={updateClient.name}
                onChange={(e) =>
                  setUpdateClient({ ...updateClient, name: e.target.value })
                }
              />
              <input
                type="email"
                className="input input-bordered w-full"
                placeholder="Email"
                value={updateClient.email}
                onChange={(e) =>
                  setUpdateClient({ ...updateClient, email: e.target.value })
                }
              />
              <input
                type="tel"
                className="input input-bordered w-full"
                placeholder="Phone"
                value={updateClient.phone}
                onChange={(e) =>
                  setUpdateClient({ ...updateClient, phone: e.target.value })
                }
              />
              <input
                type="password"
                className="input input-bordered w-full"
                placeholder="New Password"
                onChange={(e) =>
                  setUpdateClient({ ...updateClient, password: e.target.value })
                }
              />
            </div>
          )}

          <div className="modal-action">
            <label htmlFor="update-client-modal" className="btn btn-ghost">
              Cancel
            </label>
            <label
              htmlFor="update-client-modal"
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

export default ClientDashboard;
