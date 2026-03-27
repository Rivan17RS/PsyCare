import { useEffect, useState } from "react";

type Slot = {
  startTime: string;
  endTime: string;
  psychologistId: string;
  isBooked?: boolean;
};

export default function Appointments() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState("");

  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjIxODA5ODdiLTNlZjktNDdkZi05N2E3LWUyM2JjN2NhZWNkMyIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2VtYWlsYWRkcmVzcyI6ImZlcm5hbmRhQG1pbmRjYXJlLmNvbSIsInRlbmFudElkIjoiZmQ2M2Q2M2EtYmJkMS00M2ZkLWE4OGYtODgwOGY0MTBkNmRhIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiUHN5Y2hvbG9naXN0IiwiZXhwIjoxNzc0Njc0MDk1LCJpc3MiOiJQc3lDYXJlIiwiYXVkIjoiUHN5Q2FyZVVzZXJzIn0._XpHQ6XVhDlb5ysDtCZm83fydmDHaiQhqe9YtnxcjGw";

  useEffect(() => {
    if (!date) return;

    const fetchSlots = async () => {
      try {
        setLoading(true);

        const formattedDate = `${date}T00:00:00Z`;

        const response = await fetch(
          `http://localhost:5056/api/Appointments/availability?psychologistId=2180987b-3ef9-47df-97a7-e23bc7caecd3&date=${formattedDate}`,
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

        // ✅ Sort slots by start time
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
  }, [date]);

  // ✅ BOOK APPOINTMENT
  const handleBook = async (slot: Slot) => {
    try {
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
            start: slot.startTime,
            end: slot.endTime,
          }),
        }
      );

      if (!response.ok) {
        console.error("Error creando cita");
        return;
      }

      const data = await response.json();
      console.log("Cita creada:", data);

      alert("Cita reservada correctamente ✅");

      // 🔄 Refresh slots after booking
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
    <div>
      <h1>Reservar Cita</h1>

      <p>Selecciona una fecha para ver los horarios disponibles.</p>

      <div>
        <label htmlFor="fecha">Selecciona una fecha:</label>
        <input
          type="date"
          id="fecha"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <div>
        <h3>Horarios disponibles</h3>

        {!date ? (
          <p>Selecciona una fecha para ver disponibilidad</p>
        ) : loading ? (
          <p>Cargando...</p>
        ) : slots.length === 0 ? (
          <p>No hay horarios disponibles</p>
        ) : (
          slots.map((slot, index) => (
            <button
              key={index}
              onClick={() => handleBook(slot)}
              disabled={slot.isBooked}
              style={{
                display: "block",
                margin: "8px 0",
                padding: "10px",
                cursor: slot.isBooked ? "not-allowed" : "pointer",
                backgroundColor: slot.isBooked ? "#ccc" : "#fff",
              }}
            >
              {formatHour(slot.startTime)} -{" "}
              {formatHour(slot.endTime)}
              {slot.isBooked && " (Reservado)"}
            </button>
          ))
        )}
      </div>
    </div>
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