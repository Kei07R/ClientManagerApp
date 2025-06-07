import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { UserCircle } from "lucide-react";
import CustomFooter from "@/components/CustomFooter";
import CustomNavbar from "@/components/CustomNavbar";
import { jwtDecode } from "jwt-decode";

interface ProfileData {
  id: string;
  email: string;
  role: string;
  clients: number;
}

const Profile = () => {
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  interface TokenPayload {
    id: string;
    role: string;
  }

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        const res = await fetch("/api/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.message || "Failed to fetch profile");
        } else {
          setProfile(data.data);
        }
      } catch {
        setError("Something went wrong while fetching your profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleViewClients = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const decoded = jwtDecode<TokenPayload>(token);
      if (decoded.role === "ADMIN") {
        router.push("/adminDashboard");
      } else if (decoded.role === "MANAGER") {
        router.push("/clientDashboard");
      } else {
        router.push("/login");
      }
    } catch (err) {
      console.error("Invalid token:", err);
      router.push("/login");
    }
  };

  if (loading)
    return <div className="flex justify-center mt-10">Loading...</div>;

  if (error)
    return (
      <div className="flex justify-center mt-10 text-red-500">
        Error: {error}
      </div>
    );

  return (
    <div className="flex flex-col min-h-screen bg-base-100">
      <CustomNavbar />

      <main className="flex flex-col items-center justify-center flex-grow px-4 py-8">
        <div className="bg-white dark:bg-base-200 rounded-2xl shadow-lg p-6 sm:p-8 w-full max-w-md">
          <div className="flex flex-col items-center text-center">
            <div className="avatar mb-4">
              <div className="w-24 rounded-full bg-neutral-focus text-neutral-content">
                <UserCircle className="w-full h-full p-2" />
              </div>
            </div>
            <h2 className="text-2xl font-semibold">{profile?.email}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {profile?.role}
            </p>

            <div className="divider my-4" />

            <div className="w-full space-y-3">
              <div className="flex justify-between bg-base-100 p-3 rounded-lg shadow-sm">
                <span className="font-medium">User ID:</span>
                <span className="text-sm break-all">{profile?.id}</span>
              </div>
              <div className="flex justify-between bg-base-100 p-3 rounded-lg shadow-sm">
                <span className="font-medium">Role:</span>
                <span className="text-sm">{profile?.role}</span>
              </div>
              <div className="flex justify-between bg-base-100 p-3 rounded-lg shadow-sm">
                <span className="font-medium">Clients Assigned:</span>
                <span className="text-sm">{profile?.clients}</span>
              </div>
            </div>

            <button
              className="btn btn-primary mt-6 w-full"
              onClick={handleViewClients}
            >
              View Clients
            </button>
          </div>
        </div>
      </main>

      <footer className="bg-neutral text-neutral-content w-full p-4">
        <CustomFooter />
      </footer>
    </div>
  );
};

export default Profile;
