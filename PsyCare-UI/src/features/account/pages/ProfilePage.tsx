import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";

export default function ProfilePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading } = useAuth();


  const getRoleLabel = (role: string) => {
  switch (role) {
    case "Psychologist":
      return "Psicólogo";
    case "Patient":
      return "Paciente";
    case "ClinicAdmin":
      return "Administrador de clínica";
    case "PlatformAdmin":
      return "Administrador de plataforma";
    default:
      return role;
  }
};

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-gray-500">Cargando perfil...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-gray-900">
            No se pudo cargar el perfil
          </h1>

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="mt-4 rounded-lg bg-green-600 px-5 py-2 text-sm font-medium text-white hover:bg-green-700"
          >
            Ir al inicio de sesión
          </button>
        </div>
      </div>
    );
  }

  const roleLabel = user.roles?.length
    ? user.roles.map(getRoleLabel).join(", ")
    : "Sin rol";

  return (
  <>
    {location.state?.profileUpdated && (
        <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            Perfil actualizado correctamente.
        </div>
    )}

    <div className="mx-auto max-w-3xl">
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200">
        <div className="border-b border-gray-100 px-6 py-6 sm:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">
            Mi perfil
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Consulta tu información personal y los datos de tu cuenta.
          </p>
        </div>

        <div className="px-6 py-6 sm:px-8">
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nombre completo
              </label>

              <div className="mt-1 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900">
                {user.fullName}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Correo electrónico
              </label>

              <div className="mt-1 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-gray-600">
                {user.email}
              </div>

              <p className="mt-1 text-xs text-gray-400">
                El correo electrónico no puede modificarse desde este perfil.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Teléfono
              </label>

              <div className="mt-1 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900">
                {user.phoneNumber || "No registrado"}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Rol
              </label>

              <div className="mt-1 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900">
                {roleLabel}
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              type="button"
              onClick={() => navigate("/perfil/editar")}
              className="rounded-lg bg-green-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-green-700"
            >
              Editar perfil
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}