import { useEffect, useState } from "react";
import Layout from "../../../components/layout/Layout";

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

useEffect(() => {
const fetchAppointments = async () => {
try {
const token = localStorage.getItem("token");


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

// Filter ONLY pending + future
const now = new Date();

const pendingAppointments = appointments.filter((a) => {
const start = new Date(a.startTime);
return a.status === "Pending" && start > now;
});

const canCancel = (startTime: string) => {
const now = new Date();
const appointmentDate = new Date(startTime);


const diffHours =
  (appointmentDate.getTime() - now.getTime()) / (1000 * 60 * 60);

return diffHours > 24;


};

const handleCancel = async (appointmentId: string) => {
const confirmCancel = window.confirm(
"¿Estás seguro de que deseas cancelar esta cita? Esta acción no se puede deshacer."
);


if (!confirmCancel) return;

try {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `http://localhost:5056/api/Appointments/cancel?appointmentId=${appointmentId}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    alert("No se pudo cancelar la cita");
    return;
  }

  alert("Cita cancelada correctamente");

  setAppointments((prev) =>
    prev.map((a) =>
      a.appointmentId === appointmentId
        ? { ...a, status: "Cancelled" }
        : a
    )
  );
} catch (error) {
  console.error("Error:", error);
}


};

return ( <Layout> <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8"> <h1 className="text-3xl font-bold text-gray-800 mb-4">
Mis Citas </h1>


    <p className="text-gray-500 mb-6">
      Aquí puedes ver tus próximas sesiones programadas.
    </p>

    {loading ? (
      <div className="bg-blue-50 p-4 rounded-lg text-blue-600">
        Cargando citas...
      </div>
    ) : pendingAppointments.length === 0 ? (
      <div className="bg-yellow-50 p-4 rounded-lg text-yellow-700">
        No tienes citas pendientes.
      </div>
    ) : (
      <div className="space-y-4">
        {pendingAppointments.map((appointment) => (
          <div
            key={appointment.appointmentId}
            className="border rounded-xl p-5 bg-gray-50"
          >
            <h3 className="font-semibold text-lg text-gray-800">
              Sesión agendada
            </h3>

            <div className="space-y-1 text-gray-600">
              <p>Psicólogo: {appointment.psychologistName}</p>

              <p>
                Fecha: {formatDate(appointment.startTime)}
              </p>

              <p>
                Hora: {formatHour(appointment.startTime)} -{" "}
                {formatHour(appointment.endTime)}
              </p>
            </div>

            <span className="inline-block mt-3 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
              Pendiente
            </span>

            <button
              onClick={() =>
                handleCancel(appointment.appointmentId)
              }
              disabled={!canCancel(appointment.startTime)}
              className={`mt-3 px-4 py-2 rounded-lg text-white ${
                canCancel(appointment.startTime)
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Cancelar
            </button>
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
