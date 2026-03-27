import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="bg-white shadow px-6 py-3 flex justify-between">
      <h1 className="font-bold text-lg">PsicoClinicas</h1>
      <button
        onClick={logout}
        className="text-red-500 hover:underline"
      >
        Cerrar Sesión
      </button>
    </div>
  );
}