import { useNavigate } from "react-router-dom";

export default function WelcomePage() {
const navigate = useNavigate();

return ( <div className="min-h-screen bg-green-50 flex items-center justify-center px-4"> 
         <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-8 text-center">

    {/* Logo */}
    <img
      src="/src/assets/PsicoClinicas-logo.png"
      alt="PsicoClinicas"
      className="h-28 mx-auto mb-4"
    />

    {/* Hero image */}
    <img
      src="https://images.unsplash.com/photo-1584515933487-779824d29309"
      alt="Terapia psicológica"
      className="rounded-xl mb-4"
    />

    {/* Title */}
    <h1 className="text-2xl font-bold text-gray-800 mb-2">
      Bienestar mental, mejor vida
    </h1>

    {/* Description */}
    <p className="text-gray-600 mb-6 text-sm-center">
      Agenda tus citas con profesionales en salud mental de forma fácil,
      segura y rápida:
    </p>
    <ul className="text-gray-600 mb-6 text-left space-y-1">
        <li><span className="text-green-500 mr-2">✔</span>Atención profesional</li>
        <li><span className="text-green-500 mr-2">✔</span>Confidencialidad garantizada</li>
        <li><span className="text-green-500 mr-2">✔</span>Agenda flexible</li>
    </ul>

    {/* Primary actions */}
    <div className="space-y-3 mb-4">
      <button
        onClick={() => navigate("/register")}
        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
      >
        Crear cuenta
      </button>

      <button
        onClick={() => navigate("/login")}
        className="w-full border py-2 rounded-lg hover:bg-gray-100 transition"
      >
        Iniciar sesión
      </button>
    </div>

    {/* Secondary links */}
    <div className="text-sm space-y-2">

      <button
        onClick={() => window.open("http://172.23.224.1:3000/", "_blank")}
        className="text-blue-500 hover:underline"
      >
        Accede a más información
      </button>

      <br />

      <button
        onClick={() =>
          window.open("https://wa.me/506XXXXXXXX", "_blank")
        }
        className="text-green-600 hover:underline"
      >
        Contactar por WhatsApp
      </button>
    </div>
  </div>
</div>

);
}
