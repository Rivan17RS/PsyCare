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

      <div className="p-6 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-gray-800">
          Bienvenid@, {user.fullName}
        </h1>

        <p className="text-gray-500 mb-8">
          Gestiona tus citas psicológicas desde tu panel.
        </p>

        {/* User info card */}
        <div className="bg-white p-5 rounded-xl shadow mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Información de cuenta
          </h2>

          <p>
            <strong>Correo:</strong> {user.email}
          </p>

          <p>
            <strong>Clínica:</strong> {user.tenantId}
          </p>

          <p>
            <strong>Rol:</strong> {user.roles.join(", ")}
          </p>
        </div>

        {/* Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Reservar cita */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-xl font-semibold mb-3">
              Reservar cita
            </h3>

            <p className="text-gray-600 mb-4">
              Agenda una nueva sesión con nuestros psicólogos.
            </p>

            <a
              href="/appointments"
              className="inline-block bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Reservar ahora
            </a>
          </div>

          {/* Mis citas */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-xl font-semibold mb-3">
              Mis citas
            </h3>

            <p className="text-gray-600 mb-4">
              Consulta tus próximas sesiones agendadas.
            </p>

            <a
              href="/mis-citas"
              className="inline-block bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
            >
              Ver citas
            </a>
          </div>

          {/* Perfil */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-xl font-semibold mb-3">
              Mi perfil
            </h3>

            <p className="text-gray-600 mb-4">
              Edita tu información personal próximamente.
            </p>

            <button
              disabled
              className="bg-gray-400 text-white px-4 py-2 rounded-lg cursor-not-allowed"
            >
              Próximamente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}