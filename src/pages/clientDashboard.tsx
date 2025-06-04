import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import CustomNavbar from "@/components/CustomNavbar";
import { UserCircle } from "lucide-react";

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
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

  return (
    <div className="min-h-screen bg-base-100">
      <CustomNavbar />

      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Client Dashboard</h1>
          <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>
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
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <input
                type="email"
                placeholder="Email"
                className="input input-bordered w-full"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <input
                type="tel"
                placeholder="Phone"
                className="input input-bordered w-full"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
              <input
                type="password"
                placeholder="Password"
                className="input input-bordered w-full"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
    </div>
  );
};

export default ClientDashboard;
