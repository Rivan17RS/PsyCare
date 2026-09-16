import { useEffect, useState } from "react";

import {
  getPsychologistProfile,
  updatePsychologistProfile,
  type PsychologistProfile,
  type Sex,
} from "../services/psychologistProfileService";

function getSexLabel(sex: Sex) {
  switch (sex) {
    case 1:
      return "Masculino";
    case 2:
      return "Femenino";
    default:
      return "No especificado";
  }
}

function getProfileCompletion(profile: PsychologistProfile) {
  const completedFields = [
    Boolean(profile.legalIdentityNumber),
    Boolean(profile.professionalLicense),
    Boolean(profile.specialty),
    Boolean(profile.biography?.trim()),
    profile.sex !== 0,
    Boolean(profile.profileImageUrl?.trim()),
  ].filter(Boolean).length;

  return Math.round((completedFields / 6) * 100);
}

export default function PsychologistProfessionalProfilePage() {
  const [profile, setProfile] =
    useState<PsychologistProfile | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [biography, setBiography] = useState("");
  const [sex, setSex] = useState<Sex>(0);
  const [profileImageUrl, setProfileImageUrl] =
    useState("");

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getPsychologistProfile();

      setProfile(data);
      setBiography(data.biography ?? "");
      setSex(data.sex);
      setProfileImageUrl(data.profileImageUrl ?? "");
    } catch (err) {
      console.error(
        "Error cargando perfil profesional:",
        err
      );

      setError(
        "No se pudo cargar tu perfil profesional."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadProfile();
  }, []);

  const startEditing = () => {
    if (!profile) {
      return;
    }

    setBiography(profile.biography ?? "");
    setSex(profile.sex);
    setProfileImageUrl(profile.profileImageUrl ?? "");

    setError("");
    setSuccess("");
    setEditing(true);
  };

  const cancelEditing = () => {
    if (!profile) {
      return;
    }

    setBiography(profile.biography ?? "");
    setSex(profile.sex);
    setProfileImageUrl(profile.profileImageUrl ?? "");

    setError("");
    setSuccess("");
    setEditing(false);
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await updatePsychologistProfile({
        biography: biography.trim() || null,
        sex,
        profileImageUrl:
          profileImageUrl.trim() || null,
      });

      await loadProfile();

      setEditing(false);
      setSuccess(
        "Tu perfil profesional fue actualizado correctamente."
      );
    } catch (err) {
      console.error(
        "Error actualizando perfil profesional:",
        err
      );

      setError(
        "No se pudo actualizar tu perfil profesional. Inténtalo nuevamente."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-gray-500">
          Cargando perfil profesional...
        </p>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="mx-auto max-w-3xl">
        <div className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-gray-200">
          <h1 className="text-xl font-semibold text-gray-900">
            No se pudo cargar el perfil profesional
          </h1>

          <p className="mt-2 text-sm text-red-600">
            {error}
          </p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  const profileCompletion = getProfileCompletion(profile);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200">
        <div className="border-b border-gray-100 px-6 py-6 sm:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Perfil profesional
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Consulta y actualiza tu información profesional y
                de presentación.
              </p>
            </div>

            {!editing && (
              <button
                type="button"
                onClick={startEditing}
                className="rounded-lg bg-green-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-green-700"
              >
                Editar perfil profesional
              </button>
            )}
          </div>
        </div>

        <div className="px-6 py-6 sm:px-8">
          {profileCompletion < 100 && (
            <div className="mb-8 rounded-xl border border-green-100 bg-green-50 px-5 py-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Completa tu perfil profesional
                  </p>

                  <p className="mt-1 text-sm text-gray-600">
                    Agrega la información que falta para completar tu presentación profesional.
                  </p>
                </div>

                <div className="shrink-0 text-sm font-semibold text-green-700">
                  {profileCompletion}%
                </div>
              </div>

              <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-green-100">
                <div
                  className="h-full rounded-full bg-green-600 transition-all duration-300"
                  style={{ width: `${profileCompletion}%` }}
                />
              </div>

              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                {!profile.biography?.trim() && (
                  <span>• Agrega una biografía</span>
                )}

                {profile.sex === 0 && (
                  <span>• Selecciona tu sexo</span>
                )}

                {!profile.profileImageUrl?.trim() && (
                  <span>• Agrega una foto de perfil</span>
                )}
              </div>
            </div>
          )}
          {success && (
            <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {success}
            </div>
          )}

          {error && profile && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <section>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Información profesional
                </h2>

                <p className="mt-1 text-xs text-gray-400">
                  Esta información profesional no puede modificarse
                  desde este perfil.
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-5">
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Número de identificación
                </p>

                <div className="mt-1 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600">
                  {profile.legalIdentityNumber}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700">
                  Licencia o código profesional
                </p>

                <div className="mt-1 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600">
                  {profile.professionalLicense}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700">
                  Especialidad
                </p>

                <div className="mt-1 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600">
                  {profile.specialty}
                </div>
              </div>
            </div>
          </section>

          <div className="my-8 border-t border-gray-100" />

          <section>
            <h2 className="text-lg font-semibold text-gray-900">
              Presentación profesional
            </h2>

            {editing ? (
              <form
                onSubmit={handleSubmit}
                className="mt-5 space-y-5"
              >
                <div>
                  <label
                    htmlFor="biography"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Biografía
                  </label>

                  <textarea
                    id="biography"
                    value={biography}
                    onChange={(event) =>
                      setBiography(event.target.value)
                    }
                    disabled={saving}
                    rows={6}
                    maxLength={2000}
                    placeholder="Cuéntales a tus pacientes sobre tu experiencia y enfoque profesional."
                    className="mt-1 block w-full resize-y rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100 disabled:bg-gray-100"
                  />

                  <p className="mt-1 text-xs text-gray-400">
                    {biography.length}/2000 caracteres
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="sex"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Sexo
                  </label>

                  <select
                    id="sex"
                    value={sex}
                    onChange={(event) =>
                      setSex(
                        Number(event.target.value) as Sex
                      )
                    }
                    disabled={saving}
                    className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100 disabled:bg-gray-100"
                  >
                    <option value={0}>
                      No especificado
                    </option>

                    <option value={1}>
                      Masculino
                    </option>

                    <option value={2}>
                      Femenino
                    </option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="profileImageUrl"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Foto de perfil
                  </label>

                  <input
                    id="profileImageUrl"
                    type="url"
                    value={profileImageUrl}
                    onChange={(event) =>
                      setProfileImageUrl(event.target.value)
                    }
                    disabled={saving}
                    placeholder="https://..."
                    className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100 disabled:bg-gray-100"
                  />

                  <p className="mt-1 text-xs text-gray-400">
                    Por ahora utiliza una URL de imagen.
                  </p>
                </div>

                <div className="flex flex-col-reverse gap-3 pt-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={cancelEditing}
                    disabled={saving}
                    className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-lg bg-green-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving
                      ? "Guardando..."
                      : "Guardar cambios"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="mt-5 space-y-5">
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Biografía
                  </p>

                  <p className="mt-1 whitespace-pre-line text-sm text-gray-600">
                    {profile.biography ||
                      "Todavía no has agregado una biografía."}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Sexo
                  </p>

                  <p className="mt-1 text-sm text-gray-600">
                    {getSexLabel(profile.sex)}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Foto de perfil
                  </p>

                  {profile.profileImageUrl ? (
                    <div className="mt-2">
                      <img
                        src={profile.profileImageUrl}
                        alt="Foto de perfil"
                        className="h-24 w-24 rounded-full border border-gray-200 object-cover"
                      />
                    </div>
                  ) : (
                    <p className="mt-1 text-sm text-gray-600">
                      Todavía no has agregado una foto.
                    </p>
                  )}
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}