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
  const router = useRouter();

  useEffect(() => {
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

    fetchClients();
  }, [router]);

  return (
    <div className="min-h-screen bg-base-100">
      <CustomNavbar />

      <div className="p-6">
        <div className="flex justify-between">
          <h1 className="text-2xl font-semibold mb-6 text-center">
            Client Dashboard
          </h1>
          <button className="btn btn-primary btn-sm"> Add Client </button>
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
                {clients.map((client, index) => (
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
    </div>
  );
};

export default ClientDashboard;
