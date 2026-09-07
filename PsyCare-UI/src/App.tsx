import Layout from "./components/layout/Layout";
import { Routes, Route } from "react-router-dom";
import WelcomePage from "./pages/WelcomePage";
import LoginPage from "./features/auth/pages/LoginPage";
import LogoutPage from "./features/auth/pages/LogoutPage";
import Dashboard from "./features/dashboard/pages/Dashboard";
import Appointments from "./features/appointments/pages/Appointments";
import MisCitas from "./features/appointments/pages/MisCitas";
import HistorialCitas from "./features/appointments/pages/HistorialCitas";
import AvailabilityDashboard from "./features/availability/pages/AvailabilityDashboard";
import ProfilePage from "./features/account/pages/ProfilePage";
import EditProfilePage from "./features/account/pages/EditProfilePage";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/inicio" element={<Dashboard />} />
      <Route path="/agendar-cita" element={<Appointments />} />
      <Route path="/mis-citas" element={<MisCitas />} />
      <Route path="/logout" element={<LogoutPage />} />
      <Route path="/historial" element={<HistorialCitas />} />
      <Route path="/welcome" element={<WelcomePage />} />
      <Route path="/mi-disponibilidad" element={<AvailabilityDashboard />} />
      
      <Route
        path="/perfil"
        element={
          <Layout>
            <ProfilePage />
          </Layout>
        }
      />

      <Route
        path="/perfil/editar"
        element={
          <Layout>
            <EditProfilePage />
          </Layout>
        }
      />

    </Routes>
  );

}


export default App;