import { useNavigate } from "react-router-dom";
import logo from "../assets/PsicoClinicas-logo.png";

export default function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
  localStorage.removeItem("token");
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

      {/* Navigation links */}
      <div className="flex gap-6 items-center">
        <button
          onClick={() => navigate("/inicio")}
          className="text-gray-700 hover:text-blue-600"
        >
          Inicio
        </button>

        <button
          onClick={() => navigate("/agendar-cita")}
          className="text-gray-700 hover:text-blue-600"
        >
          Agendar Cita
        </button>

        <button
          onClick={() => navigate("/mis-citas")}
          className="text-gray-700 hover:text-blue-600"
        >
          Mis Citas
        </button>

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