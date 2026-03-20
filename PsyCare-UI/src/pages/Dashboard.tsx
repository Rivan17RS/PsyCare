import { useEffect, useState } from "react";
import apiClient from "../api/apiClient";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await apiClient.get("/auth/me");
      setUser(res.data);
    };

    fetchUser();
  }, []);

  if (!user) return <p className="p-4">Loading...</p>;

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />

      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

        <div className="bg-white p-4 rounded-xl shadow">
          <p><strong>Name:</strong> {user.fullName}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Tenant:</strong> {user.tenantId}</p>
          <p><strong>Roles:</strong> {user.roles.join(", ")}</p>
        </div>
      </div>
    </div>
  );
}