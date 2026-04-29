import { useNavigate } from "react-router-dom";

export default function LogoutPage() {
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Sesión cerrada
        </h1>

        <p className="text-gray-600 mb-8">
          Has cerrado sesión exitosamente en PsicoClinicas.
        </p>

        <button
          onClick={handleLoginRedirect}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Volver a iniciar sesión
        </button>

        {/* Future landing page */}
        <p className="text-sm text-gray-400 mt-6">
          Próximamente podrás volver a nuestra página principal.
        </p>
      </div>
    </div>
  );
}