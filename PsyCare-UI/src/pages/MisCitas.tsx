import { useEffect, useState } from "react";
import Layout from "../components/Layout";


type Appointment = {
  appointmentId: string;
  patientName: string;
  psychologistName: string;
  startTime: string;
  endTime: string;
  status: string;
};

export default function MisCitas() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        if (!token) {
          console.error("Token no encontrado");
          return;
        }

        const response = await fetch(
          "http://localhost:5056/api/Appointments/my",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          console.error("Error obteniendo citas");
          return;
        }

        const data = await response.json();

        const sorted = data.sort(
          (a: Appointment, b: Appointment) =>
            new Date(a.startTime).getTime() -
            new Date(b.startTime).getTime()
        );

        setAppointments(sorted);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  return (
      <Layout>
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Mis Citas
          </h1>

        <p className="text-gray-500 mb-6">
          Aquí puedes ver tus próximas sesiones agendadas.
        </p>

        {loading ? (
          <div className="bg-blue-50 p-4 rounded-lg text-blue-600">
            Cargando citas...
          </div>
        ) : appointments.length === 0 ? (
          <div className="bg-yellow-50 p-4 rounded-lg text-yellow-700">
            No tienes citas agendadas.
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div
                key={appointment.appointmentId}
                className="border rounded-xl p-5 bg-gray-50"
              >
                <h3 className="font-semibold text-lg text-gray-800">
                  Sesión agendada
                </h3>

                <div className="space-y-1 text-gray-600">
                    <p>
                    Psicólogo: {appointment.psychologistName}
                    </p>

                    <p>
                    Fecha: {formatDate(appointment.startTime)}
                    </p>

                    <p>
                    Hora: {formatHour(appointment.startTime)} -{" "}
                    {formatHour(appointment.endTime)}
                    </p>
                </div>
                <span className="inline-block mt-3 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                  {appointment.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

function formatDate(dateString: string) {
  const date = new Date(dateString);

  return date.toLocaleDateString("es-CR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "America/Costa_Rica",
  });
}

function formatHour(dateString: string) {
  const date = new Date(dateString);

  return date.toLocaleTimeString("es-CR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Costa_Rica",
  });
}