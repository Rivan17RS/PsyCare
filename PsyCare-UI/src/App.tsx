import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import Appointments from "./pages/Appointments";
import MisCitas from "./pages/MisCitas";
import LogoutPage from "./pages/LogoutPage";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/inicio" element={<Dashboard />} />
      <Route path="/agendar-cita" element={<Appointments />} />
      <Route path="/mis-citas" element={<MisCitas />} />
      <Route path="/logout" element={<LogoutPage />} />
    </Routes>
  );

}


export default App;