import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import apiClient from "../../../api/apiClient";
import { useAuth } from "../../../contexts/AuthContext";

import logo from "../../../assets/PsicoClinicas-logo.png";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const registrationCompleted =
    location.state?.registrationCompleted === true;

  const { refreshUser } = useAuth();

  const login = async () => {
    try {
      setLoading(true);

      // Authenticate user
      const loginResponse = await apiClient.post(
        "/auth/login",
        {
          email,
          password,
        }
      );

      const token = loginResponse.data.token;

      // Keep only the authentication token in localStorage.
      // User profile data is managed by AuthContext.
      localStorage.setItem("token", token);

      // Load the authenticated user's complete state:
      // /auth/me -> identity, tenant and roles
      // /Profile -> mutable profile information
      await refreshUser();

      // All authenticated roles currently land on the dashboard.
      navigate("/inicio");
    } catch (err) {
      console.error("Error during login:", err);

      // Do not leave a potentially invalid token behind.
      localStorage.removeItem("token");

      alert("Credenciales inválidas.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-80 rounded-2xl bg-white p-8 shadow-lg">

        {/* Logo */}
        <div className="mb-4 flex justify-center">
          <img
            src={logo}
            alt="PsicoClinicas"
            className="h-20 object-contain"
          />
        </div>

        {/* Title */}
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">
          Credenciales
        </h1>

        {registrationCompleted && (
          <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            <p className="font-medium">
              Registro completado correctamente.
            </p>

            <p className="mt-1">
              Ya puedes iniciar sesión con tu nueva cuenta.
            </p>
          </div>
        )}

        {/* Email */}
        <div className="mb-4">
          <label
            htmlFor="email"
            className="mb-2 block text-sm text-gray-700"
          >
            Correo electrónico
          </label>

          <input
            id="email"
            className="w-full rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            type="email"
            placeholder="correo@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label
            htmlFor="password"
            className="mb-2 block text-sm text-gray-700"
          >
            Contraseña
          </label>

          <input
            id="password"
            className="w-full rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !loading) {
                void login();
              }
            }}
          />
        </div>

        {/* Button */}
        <button
          type="button"
          className="w-full rounded-lg bg-blue-500 py-2 text-white transition hover:bg-blue-600 disabled:bg-gray-400"
          onClick={() => void login()}
          disabled={loading}
        >
          {loading ? "Ingresando..." : "Iniciar sesión"}
        </button>
      </div>
    </div>
  );
}