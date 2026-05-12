import { useState } from "react";
import { useNavigate } from "react-router-dom";

import apiClient from "../../../api/apiClient";

import logo from "../../../assets/PsicoClinicas-logo.png";

export default function LoginPage() {
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const login = async () => {
    try {
      setLoading(true);

      // Login request
      const loginResponse = await apiClient.post(
        "/auth/login",
        {
          email,
          password,
        }
      );

      const token = loginResponse.data.token;

      // Store token
      localStorage.setItem("token", token);

      // Fetch authenticated user profile
      const meResponse = await apiClient.get(
        "/auth/me"
      );

      const user = meResponse.data;

      // Store user profile
      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      const roles: string[] = user.roles || [];

      // Role-based navigation
      if (roles.includes("Psychologist")) {
        navigate("/inicio");

        return;
      }

      if (roles.includes("ClinicAdmin")) {
        navigate("/inicio");

        return;
      }

      // Default patient flow
      navigate("/inicio");
    } catch (err) {
      console.error(err);

      alert("Credenciales inválidas.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      
      <div className="bg-white p-8 rounded-2xl shadow-lg w-80">
        
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img
            src={logo}
            alt="PsicoClinicas"
            className="h-20 object-contain"
          />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Credenciales
        </h1>

        {/* Email */}
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm text-gray-700 mb-2"
          >
            Correo electrónico
          </label>

          <input
            id="email"
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            type="email"
            placeholder="correo@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label
            htmlFor="password"
            className="block text-sm text-gray-700 mb-2"
          >
            Contraseña
          </label>

          <input
            id="password"
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Button */}
        <button
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition disabled:bg-gray-400"
          onClick={login}
          disabled={loading}
        >
          {loading
            ? "Ingresando..."
            : "Iniciar sesión"}
        </button>
      </div>
    </div>
  );
}