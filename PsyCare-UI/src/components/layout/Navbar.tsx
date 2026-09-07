import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import logo from "../../assets/PsicoClinicas-logo.png";

type User = {
  fullName?: string;
  roles?: string[];
  profileImageUrl?: string;
};

function getRoleLabel(roles: string[]) {
  if (roles.includes("Psychologist")) {
    return "Psicólogo";
  }

  if (roles.includes("ClinicAdmin")) {
    return "Administrador de clínica";
  }

  if (roles.includes("PlatformAdmin")) {
    return "Administrador";
  }

  if (roles.includes("Patient")) {
    return "Paciente";
  }

  return "Usuario";
}

function getInitials(fullName?: string) {
  if (!fullName) {
    return "U";
  }

  const parts = fullName
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }

  return (
    parts[0].charAt(0) +
    parts[parts.length - 1].charAt(0)
  ).toUpperCase();
}

export default function Navbar() {
  const navigate = useNavigate();

  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const profileMenuRef = useRef<HTMLDivElement>(null);

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

  const roleLabel = getRoleLabel(roles);
  const initials = getInitials(user.fullName);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (
      event: MouseEvent
    ) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(
          event.target as Node
        )
      ) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  // Close menu with Escape
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setIsProfileOpen(false);

    navigate("/logout");
  };

  const handleProfileNavigation = (
    path: string
  ) => {
    setIsProfileOpen(false);
    navigate(path);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex min-h-[76px] w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <button
          type="button"
          onClick={() => navigate("/inicio")}
          className="shrink-0 cursor-pointer"
          aria-label="Ir al inicio"
        >
          <img
            src={logo}
            alt="PsicoClinicas"
            className="h-14 w-auto object-contain"
          />
        </button>

        {/* Right side */}
        <div className="flex items-center gap-10">

          {/* Navigation */}
          <nav
            className="hidden items-center gap-6 md:flex"
            aria-label="Navegación principal"
          >
            {/* Home */}
            <button
              type="button"
              onClick={() =>
                navigate("/inicio")
              }
              className="text-sm font-medium text-gray-600 transition-colors hover:text-blue-600"
            >
              Inicio
            </button>

            {/* Patient */}
            {isPatient && (
              <>
                <button
                  type="button"
                  onClick={() =>
                    navigate("/agendar-cita")
                  }
                  className="text-sm font-medium text-gray-600 transition-colors hover:text-blue-600"
                >
                  Agendar Cita
                </button>

                <button
                  type="button"
                  onClick={() =>
                    navigate("/mis-citas")
                  }
                  className="text-sm font-medium text-gray-600 transition-colors hover:text-blue-600"
                >
                  Mis Citas
                </button>
              </>
            )}

            {/* Psychologist */}
            {isPsychologist && (
              <button
                type="button"
                onClick={() =>
                  navigate("/mi-disponibilidad")
                }
                className="text-sm font-medium text-gray-600 transition-colors hover:text-blue-600"
              >
                Mi Disponibilidad
              </button>
            )}

            {/* Clinic Admin */}
            {isClinicAdmin && (
              <button
                type="button"
                disabled
                className="cursor-not-allowed text-sm font-medium text-gray-400"
              >
                Administración
              </button>
            )}

            {/* Shared */}
            <button
              type="button"
              onClick={() =>
                navigate("/historial")
              }
              className="text-sm font-medium text-gray-600 transition-colors hover:text-blue-600"
            >
              Historial
            </button>
          </nav>

          {/* Profile menu */}
          <div
            ref={profileMenuRef}
            className="relative"
          >
            <button
              type="button"
              onClick={() =>
                setIsProfileOpen(
                  (previous) => !previous
                )
              }
              aria-haspopup="menu"
              aria-expanded={isProfileOpen}
              className="flex items-center gap-3 rounded-xl px-2 py-1.5 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-100"
            >
              {/* Avatar */}
              {user.profileImageUrl ? (
                <img
                  src={user.profileImageUrl}
                  alt={
                    user.fullName ||
                    "Perfil de usuario"
                  }
                  className="h-10 w-10 rounded-full border border-gray-200 object-cover"
                />
              ) : (
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-blue-700 ring-1 ring-blue-100"
                  aria-hidden="true"
                >
                  {initials}
                </div>
              )}

              {/* User information */}
              <div className="hidden text-left lg:block">
                <p className="max-w-[180px] truncate text-sm font-semibold text-gray-800">
                  {user.fullName ||
                    "Usuario"}
                </p>

                <p className="text-xs text-gray-500">
                  {roleLabel}
                </p>
              </div>

              {/* Chevron */}
              <svg
                className={`hidden h-4 w-4 text-gray-400 transition-transform lg:block ${
                  isProfileOpen
                    ? "rotate-180"
                    : ""
                }`}
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {/* Dropdown */}
            {isProfileOpen && (
              <div
                role="menu"
                className="absolute right-0 mt-3 w-64 origin-top-right overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl ring-1 ring-black/5"
              >
                {/* User summary */}
                <div className="border-b border-gray-100 px-4 py-4">
                  <div className="flex items-center gap-3">
                    {user.profileImageUrl ? (
                      <img
                        src={
                          user.profileImageUrl
                        }
                        alt={
                          user.fullName ||
                          "Perfil"
                        }
                        className="h-11 w-11 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-blue-700">
                        {initials}
                      </div>
                    )}

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-gray-800">
                        {user.fullName ||
                          "Usuario"}
                      </p>

                      <p className="truncate text-xs text-gray-500">
                        {roleLabel}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Menu items */}
                <div className="p-2">

                  <button
                    type="button"
                    role="menuitem"
                    onClick={() =>
                      handleProfileNavigation(
                        "/perfil"
                      )
                    }
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
                  >
                    <svg
                      className="h-5 w-5 text-gray-400"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 19a4 4 0 00-8 0"
                      />
                      <circle
                        cx="11"
                        cy="7"
                        r="4"
                      />
                    </svg>

                    <span>Ver perfil</span>
                  </button>

                  <button
                    type="button"
                    role="menuitem"
                    onClick={() =>
                      handleProfileNavigation(
                        "/perfil/editar"
                      )
                    }
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
                  >
                    <svg
                      className="h-5 w-5 text-gray-400"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 20h9"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.5 3.5a2.121 2.121 0 013 3L8 18l-4 1 1-4L16.5 3.5z"
                      />
                    </svg>

                    <span>Editar perfil</span>
                  </button>
                </div>

                {/* Logout */}
                <div className="border-t border-gray-100 p-2">
                  <button
                    type="button"
                    role="menuitem"
                    onClick={logout}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-red-500 transition-colors hover:bg-red-50 hover:text-red-600"
                  >
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M10 17l5-5-5-5"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12H3"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 19V5a2 2 0 00-2-2h-6"
                      />
                    </svg>

                    <span>Cerrar sesión</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}