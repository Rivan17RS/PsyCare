import { useEffect, useState } from "react";
import Layout from "../../../components/layout/Layout";

type Appointment = {
  appointmentId: string;
  psychologistName: string;
  startTime: string;
  status: string;
};

export default function HistorialCitas() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:5056/api/Appointments/history",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();
        setAppointments(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <Layout>
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-4">Historial de Citas</h1>

        {loading ? (
          <p>Cargando...</p>
        ) : appointments.length === 0 ? (
          <p>No hay historial disponible.</p>
        ) : (
          <div className="space-y-3">
            {appointments.map((appt) => (
              <div
                key={appt.appointmentId}
                className="p-3 border rounded-lg bg-gray-50 text-sm"
              >
                <p>
                  <strong>{formatDateTime(appt.startTime)}</strong>
                </p>
                <p>Psicólogo: {appt.psychologistName}</p>
                <p
                  className={`text-xs font-semibold ${
                    appt.status === "Cancelled"
                      ? "text-red-500"
                      : appt.status === "NoShow"
                      ? "text-gray-500"
                      : "text-green-600"
                  }`}
                >
                  {appt.status}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

function formatDateTime(dateString: string) {
  const date = new Date(dateString);

  return date.toLocaleString("es-CR", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/Costa_Rica",
  });
}