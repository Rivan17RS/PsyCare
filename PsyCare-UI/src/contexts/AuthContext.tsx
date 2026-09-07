import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import apiClient from "../api/apiClient";

export type CurrentUser = {
  id: string;
  fullName: string;
  email: string;
  phoneNumber?: string | null;
  roles: string[];
  tenantId?: string;
  profileImageUrl?: string | null;
};

type AuthContextValue = {
  user: CurrentUser | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  setUser: (user: CurrentUser | null) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
        setUser(null);
        setLoading(false);
        return;
    }

    try {
        const [authResponse, profileResponse] =
        await Promise.all([
            apiClient.get("/auth/me"),
            apiClient.get("/Profile"),
        ]);

        const authUser = authResponse.data;
        const profile = profileResponse.data;

        setUser({
        id: authUser.userId,
        email: authUser.email,
        tenantId: authUser.tenantId,
        roles: authUser.roles || [],
        fullName: profile.fullName,
        phoneNumber: profile.phoneNumber,
        profileImageUrl: profile.profileImageUrl ?? null,
        });
        } catch (error) {
            console.error(
            "Error cargando información del usuario:",
            error
            );

            setUser(null);
            localStorage.removeItem("token");
        } finally {
            setLoading(false);
        }
    }, []);

  useEffect(() => {
    void refreshUser();
  }, [refreshUser]);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      refreshUser,
      setUser,
      logout,
    }),
    [user, loading, refreshUser, logout]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth debe utilizarse dentro de AuthProvider."
    );
  }

  return context;
}