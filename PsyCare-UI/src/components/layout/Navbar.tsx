import { useMemo } from "react";

import { useNavigate } from "react-router-dom";

import logo from "../../assets/PsicoClinicas-logo.png";

type User = {
  fullName?: string;
  roles?: string[];
};

export default function Navbar() {
  const navigate = useNavigate();

  // Get persisted user
  const user: User = useMemo(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      return {};
    }

    try {
      return JSON.parse(storedUser);
    } catch {
      return {};
    }
  }, []);

  const roles = user.roles || [];

  const isPsychologist =
    roles.includes("Psychologist");

  const isClinicAdmin =
    roles.includes("ClinicAdmin");

  const isPatient =
    roles.includes("Patient");

  const logout = () => {
    localStorage.removeItem("token");

    localStorage.removeItem("user");

    navigate("/logout");
  };

  return (
    <div className="bg-white shadow px-6 py-4 flex justify-between items-center">
      
      {/* Logo / Home */}
      <img
        src={logo}
        alt="PsicoClinicas"
        onClick={() => navigate("/inicio")}
        className="h-14 cursor-pointer object-contain"
      />

      {/* Navigation */}
      <div className="flex gap-6 items-center flex-wrap">

        {/* Home */}
        <button
          onClick={() => navigate("/inicio")}
          className="text-gray-700 hover:text-blue-600"
        >
          Inicio
        </button>

        {/* PATIENT NAVIGATION */}
        {isPatient && (
          <>
            <button
              onClick={() =>
                navigate("/agendar-cita")
              }
              className="text-gray-700 hover:text-blue-600"
            >
              Agendar Cita
            </button>

            <button
              onClick={() =>
                navigate("/mis-citas")
              }
              className="text-gray-700 hover:text-blue-600"
            >
              Mis Citas
            </button>
          </>
        )}

        {/* PSYCHOLOGIST NAVIGATION */}
        {isPsychologist && (
          <>
            <button
              onClick={() =>
                navigate("/mi-disponibilidad")
              }
              className="text-gray-700 hover:text-blue-600"
            >
              Mi Disponibilidad
            </button>
          </>
        )}

        {/* CLINIC ADMIN NAVIGATION */}
        {isClinicAdmin && (
          <>
            <button
              className="text-gray-700 hover:text-blue-600"
              disabled
            >
              Administración
            </button>
          </>
        )}

        {/* Shared */}
        <button
          onClick={() => navigate("/historial")}
          className="text-gray-700 hover:text-blue-600"
        >
          Historial
        </button>

        {/* Logout */}
        <button
          onClick={logout}
          className="text-red-500 hover:underline"
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
}