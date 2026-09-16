import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import apiClient from "../../../api/apiClient";
import { registerPsychologist } from "../services/psychologistService";

type InvitationDetails = {
  email: string;
  role: string;
  expiresAt: string;
};

export default function PsychologistRegistrationPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const [invitation, setInvitation] =
    useState<InvitationDetails | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [fullName, setFullName] = useState("");
  const [legalIdentityNumber, setLegalIdentityNumber] = useState("");
  const [professionalLicense, setProfessionalLicense] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const loadInvitation = async () => {
      if (!token) {
        setError("El enlace de invitación no es válido.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await apiClient.get<InvitationDetails>(
          `/invitations/${token}`
        );

        setInvitation(response.data);
      } catch (err) {
        console.error("Error cargando invitación:", err);
        setError(
          "La invitación no es válida, ha expirado o ya fue utilizada."
        );
      } finally {
        setLoading(false);
      }
    };

    void loadInvitation();
  }, [token]);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
    ) => {
    event.preventDefault();

    if (!fullName.trim()) {
        setError("El nombre completo es obligatorio.");
        return;
    }

    if (!legalIdentityNumber.trim()) {
        setError("El número de identificación es obligatorio.");
        return;
    }

    if (!professionalLicense.trim()) {
        setError("La licencia o código profesional es obligatorio.");
        return;
    }

    if (!specialty.trim()) {
        setError("La especialidad es obligatoria.");
        return;
    }

    if (!password) {
        setError("La contraseña es obligatoria.");
        return;
    }

    if (password !== confirmPassword) {
        setError("Las contraseñas no coinciden.");
        return;
    }

    try {
        setSaving(true);
        setError("");

        await registerPsychologist({
        token: token!,
        fullName: fullName.trim(),
        legalIdentityNumber: legalIdentityNumber.trim(),
        professionalLicense: professionalLicense.trim(),
        specialty: specialty.trim(),
        password,
        });

        navigate("/login", {
        state: {
            registrationCompleted: true,
        },
        });
    } catch (err) {
        console.error("Error registrando psicólogo:", err);
        setError(
        "No se pudo completar el registro. Verifica la información e inténtalo nuevamente."
        );
    } finally {
        setSaving(false);
    }
    };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <p className="text-gray-500">
          Validando invitación...
        </p>
      </div>
    );
  }

  if (error || !invitation) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-lg rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-gray-200">
          <h1 className="text-2xl font-semibold text-gray-900">
            Invitación no válida
          </h1>

          <p className="mt-3 text-sm text-gray-500">
            {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200">
          <div className="border-b border-gray-100 px-6 py-6 sm:px-8">
            <h1 className="text-2xl font-semibold text-gray-900">
              Completa tu registro profesional
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Has sido invitado a formar parte de una clínica en
              PsicoClínicas.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="px-6 py-6 sm:px-8"
            >
            <div className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Correo electrónico
                </label>

                <input
                  id="email"
                  type="email"
                  value={invitation.email}
                  disabled
                  className="mt-1 block w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-gray-500"
                />

                <p className="mt-1 text-xs text-gray-400">
                  Este correo proviene de tu invitación y no puede
                  modificarse.
                </p>
              </div>

              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Nombre completo
                </label>

                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(event) =>
                    setFullName(event.target.value)
                  }
                  placeholder="Ej. María Rodríguez"
                  className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                />
              </div>

              <div>
                <label
                  htmlFor="legalIdentityNumber"
                  className="block text-sm font-medium text-gray-700"
                >
                  Número de identificación
                </label>

                <input
                  id="legalIdentityNumber"
                  type="text"
                  value={legalIdentityNumber}
                  onChange={(event) =>
                    setLegalIdentityNumber(event.target.value)
                  }
                  placeholder="Ej. 1-2345-6789"
                  className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                />
              </div>

              <div>
                <label
                  htmlFor="professionalLicense"
                  className="block text-sm font-medium text-gray-700"
                >
                  Licencia o código profesional
                </label>

                <input
                  id="professionalLicense"
                  type="text"
                  value={professionalLicense}
                  onChange={(event) =>
                    setProfessionalLicense(event.target.value)
                  }
                  placeholder="Ej. CPS-123456"
                  className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                />
              </div>

              <div>
                <label
                  htmlFor="specialty"
                  className="block text-sm font-medium text-gray-700"
                >
                  Especialidad
                </label>

                <input
                  id="specialty"
                  type="text"
                  value={specialty}
                  onChange={(event) =>
                    setSpecialty(event.target.value)
                  }
                  placeholder="Ej. Psicología clínica"
                  className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Contraseña
                </label>

                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirmar contraseña
                </label>

                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(event.target.value)
                  }
                  className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                />
              </div>
            </div>

            {error && (
            <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
            </div>
            )}

            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-green-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                {saving ? "Creando cuenta..." : "Crear cuenta"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}