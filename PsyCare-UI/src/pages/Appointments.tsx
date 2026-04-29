import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

type Slot = {
  startTime: string;
  endTime: string;
  psychologistId: string;
  isBooked?: boolean;
};

type Psychologist = {
  id: string;
  fullName: string;
};

export default function Appointments() {
  const navigate = useNavigate();
  
  const [slots, setSlots] = useState<Slot[]>([]);
  const [psychologists, setPsychologists] = useState<Psychologist[]>([]);
  const [selectedPsychologist, setSelectedPsychologist] = useState("");

  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState("");

  // stored token
  const token = localStorage.getItem("token");

  // Fetch psychologists when component loads
  useEffect(() => {
    const fetchPsychologists = async () => {
      try {
        if (!token) {
          console.error("Token no encontrado");
          return;
        }

        const response = await fetch(
          "http://localhost:5056/api/clinics/psychologists",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          console.error("Error obteniendo psicólogos");
          return;
        }

        const data = await response.json();
        setPsychologists(data);

        // Select first psychologist by default
        if (data.length > 0) {
          setSelectedPsychologist(data[0].id);
        }
      } catch (error) {
        console.error("Error cargando psicólogos:", error);
      }
    };

    fetchPsychologists();
  }, []);

  // Fetch availability slots
  useEffect(() => {
    if (!date || !selectedPsychologist) return;

    const fetchSlots = async () => {
      try {
        setLoading(true);

        if (!token) {
          console.error("Token no encontrado");
          return;
        }

        const formattedDate = `${date}T00:00:00Z`;

        const response = await fetch(
          `http://localhost:5056/api/Appointments/availability?psychologistId=${selectedPsychologist}&date=${formattedDate}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          console.error("HTTP error:", response.status);
          return;
        }

        const data = await response.json();

        const sorted = data.sort(
          (a: Slot, b: Slot) =>
            new Date(a.startTime).getTime() -
            new Date(b.startTime).getTime()
        );

        setSlots(sorted);
      } catch (error) {
        console.error("Error al obtener disponibilidad:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, [date, selectedPsychologist]);

  // Book appointment
  const handleBook = async (slot: Slot) => {
    try {
      if (!token) {
        console.error("Token no encontrado");
        return;
      }

      const response = await fetch(
        "http://localhost:5056/api/Appointments",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            psychologistId: slot.psychologistId,
            startTime: slot.startTime,
            endTime: slot.endTime,
            mode: 0
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error creando cita:", errorText);
        return;
      }

      const data = await response.json();
      console.log("Cita creada:", data);

      navigate("/mis-citas");

      // Update UI
      setSlots((prev) =>
        prev.map((s) =>
          s.startTime === slot.startTime
            ? { ...s, isBooked: true }
            : s
        )
      );
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return ( 
  <Layout>
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8">
      
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Agendar Cita
        </h1>

        <p className="text-gray-500 mt-2">
          Selecciona un psicólogo y una fecha para encontrar horarios disponibles.
        </p>
      </div>

      {/* Filters */}
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        
        {/* Psychologist dropdown */}
        <div>
          <label
            htmlFor="psychologist"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Psicólogo
          </label>

          <select
            id="psychologist"
            value={selectedPsychologist}
            onChange={(e) => setSelectedPsychologist(e.target.value)}
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-400"
          >
            {psychologists.length === 0 ? (
              <option>No hay psicólogos disponibles</option>
            ) : (
              psychologists.map((psychologist) => (
                <option
                  key={psychologist.id}
                  value={psychologist.id}
                >
                  {psychologist.fullName}
                </option>
              ))
            )}
          </select>
        </div>

        {/* Date picker */}
        <div>
          <label
            htmlFor="fecha"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Fecha
          </label>

          <input
            type="date"
            id="fecha"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>

      {/* Slots */}
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Horarios disponibles
        </h3>

        {!date ? (
          <div className="bg-gray-50 p-4 rounded-lg text-gray-500">
            Selecciona una fecha para ver disponibilidad.
          </div>
        ) : loading ? (
          <div className="bg-blue-50 p-4 rounded-lg text-blue-600">
            Cargando horarios...
          </div>
        ) : slots.length === 0 ? (
          <div className="bg-yellow-50 p-4 rounded-lg text-yellow-700">
            No hay horarios disponibles para esta fecha.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {slots.map((slot) => (
              <button
                key={`${slot.psychologistId}-${slot.startTime}`}
                onClick={() => handleBook(slot)}
                disabled={slot.isBooked}
                className={`p-4 rounded-xl border transition font-medium ${
                  slot.isBooked
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-white hover:bg-blue-500 hover:text-white border-gray-300"
                }`}
              >
                {formatHour(slot.startTime)} -{" "}
                {formatHour(slot.endTime)}

                {slot.isBooked && (
                  <span className="block text-sm mt-2">
                    Reservado
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  </Layout>
);
}

// Helper
function formatHour(dateString: string) {
  const date = new Date(dateString);

  return date.toLocaleTimeString("es-CR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Costa_Rica",
  });
}