import { useEffect, useState } from "react";

import Layout from "../../../components/layout/Layout";

import apiClient from "../../../api/apiClient";

type User = {
  fullName: string;
  email: string;
  tenantId: string;
  roles: string[];
};

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(
    null
  );

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        // First try localStorage
        const storedUser =
          localStorage.getItem("user");

        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }

        // Refresh from backend
        const res = await apiClient.get(
          "/auth/me"
        );

        setUser(res.data);

        localStorage.setItem(
          "user",
          JSON.stringify(res.data)
        );
      } catch (error) {
        console.error(
          "Error loading user:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="p-6">
          <p className="text-gray-500">
            Cargando panel...
          </p>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="p-6">
          <p className="text-red-500">
            No se pudo cargar el usuario.
          </p>
        </div>
      </Layout>
    );
  }

  const roles = user.roles || [];

  const isPsychologist =
    roles.includes("Psychologist");

  const isClinicAdmin =
    roles.includes("ClinicAdmin");

  const isPatient =
    roles.includes("Patient");

  return (
    <Layout>
      <div className="p-6 max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-gray-800">
            Bienvenid@, {user.fullName}
          </h1>

          <p className="text-gray-500">
            Gestiona tu experiencia dentro de
            PsicoClinicas.
          </p>
        </div>

        {/* User info */}
        <div className="bg-white p-5 rounded-xl shadow mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Información de cuenta
          </h2>

          <div className="space-y-2">
            <p>
              <strong>Correo:</strong>{" "}
              {user.email}
            </p>

            <p>
              <strong>Clínica:</strong>{" "}
              {user.tenantId}
            </p>

            <p>
              <strong>Rol:</strong>{" "}
              {user.roles.join(", ")}
            </p>
          </div>
        </div>

        {/* PATIENT DASHBOARD */}
        {isPatient && (
          <div className="grid md:grid-cols-3 gap-6">

            {/* Reservar */}
            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="text-xl font-semibold mb-3">
                Reservar cita
              </h3>

              <p className="text-gray-600 mb-4">
                Agenda una nueva sesión con
                nuestros psicólogos.
              </p>

              <a
                href="/agendar-cita"
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
                Consulta tus próximas sesiones
                agendadas.
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
                Edita tu información personal
                próximamente.
              </p>

              <button
                disabled
                className="bg-gray-400 text-white px-4 py-2 rounded-lg cursor-not-allowed"
              >
                Próximamente
              </button>
            </div>
          </div>
        )}

        {/* PSYCHOLOGIST DASHBOARD */}
        {isPsychologist && (
          <div className="grid md:grid-cols-3 gap-6">

            {/* Disponibilidad */}
            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="text-xl font-semibold mb-3">
                Mi disponibilidad
              </h3>

              <p className="text-gray-600 mb-4">
                Configura y administra tus
                horarios disponibles.
              </p>

              <a
                href="/mi-disponibilidad"
                className="inline-block bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Gestionar horarios
              </a>
            </div>

            {/* Historial */}
            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="text-xl font-semibold mb-3">
                Historial
              </h3>

              <p className="text-gray-600 mb-4">
                Consulta sesiones pasadas y
                actividad reciente.
              </p>

              <a
                href="/historial"
                className="inline-block bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
              >
                Ver historial
              </a>
            </div>

            {/* Próximamente */}
            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="text-xl font-semibold mb-3">
                Estadísticas
              </h3>

              <p className="text-gray-600 mb-4">
                Visualiza métricas y ocupación
                próximamente.
              </p>

              <button
                disabled
                className="bg-gray-400 text-white px-4 py-2 rounded-lg cursor-not-allowed"
              >
                Próximamente
              </button>
            </div>
          </div>
        )}

        {/* CLINIC ADMIN DASHBOARD */}
        {isClinicAdmin && (
          <div className="grid md:grid-cols-3 gap-6">

            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="text-xl font-semibold mb-3">
                Administración
              </h3>

              <p className="text-gray-600 mb-4">
                Gestiona la clínica y usuarios
                próximamente.
              </p>

              <button
                disabled
                className="bg-gray-400 text-white px-4 py-2 rounded-lg cursor-not-allowed"
              >
                Próximamente
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}