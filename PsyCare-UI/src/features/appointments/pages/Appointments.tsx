import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../../components/layout/Layout";

import BookingConfirmationModal from "../components/BookingConfirmationModal";

import {
  createAppointment,
  getAvailability,
  getPsychologists,
  type Psychologist,
  type Slot,
} from "../services/appointmentService";

type BookingConfirmation = {
  psychologistName: string;
  date: string;
  startTime: string;
  endTime: string;
};

export default function Appointments() {
  const navigate = useNavigate();
  const [slots, setSlots] = useState<Slot[]>([]);
  const [psychologists, setPsychologists] = useState<Psychologist[]>([]);
  const [selectedPsychologist, setSelectedPsychologist] = useState("");

  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState(false);
  const [date, setDate] = useState("");

  const [bookingConfirmation, setBookingConfirmation] =
    useState<BookingConfirmation | null>(null);

  // Fetch psychologists when component loads
  useEffect(() => {
    const fetchPsychologists = async () => {
      try {
        const data = await getPsychologists();

        setPsychologists(data);

        // Select first psychologist by default
        if (data.length > 0) {
          setSelectedPsychologist(data[0].id);
        }
      } catch (error) {
        console.error("Error cargando psicólogos:", error);
      }
    };

    void fetchPsychologists();
  }, []);

  // Fetch availability slots
  useEffect(() => {
    if (!date || !selectedPsychologist) {
      return;
    }

    const fetchSlots = async () => {
      try {
        setLoading(true);

        // Keep existing timezone/date behavior unchanged.
        const formattedDate = `${date}T00:00:00Z`;

        const data = await getAvailability(
          selectedPsychologist,
          formattedDate
        );

        const sorted = data.sort(
          (a: Slot, b: Slot) =>
            new Date(a.startTime).getTime() -
            new Date(b.startTime).getTime()
        );

        setSlots(sorted);
      } catch (error) {
        console.error("Error al obtener disponibilidad:", error);
        setSlots([]);
      } finally {
        setLoading(false);
      }
    };

    void fetchSlots();
  }, [date, selectedPsychologist]);

  // Book appointment
  const handleBook = async (slot: Slot) => {
    try {
      setBooking(true);

      const data = await createAppointment({
        psychologistId: slot.psychologistId,
        startTime: slot.startTime,
        endTime: slot.endTime,
        mode: 0,
      });

      console.log("Cita creada:", data);

      const psychologist = psychologists.find(
        (item) => item.id === slot.psychologistId
      );

      // Mark the slot as booked in the current UI.
      setSlots((prev) =>
        prev.map((currentSlot) =>
          currentSlot.psychologistId === slot.psychologistId &&
          currentSlot.startTime === slot.startTime
            ? { ...currentSlot, isBooked: true }
            : currentSlot
        )
      );

      // Only show confirmation after the API succeeds.
      setBookingConfirmation({
        psychologistName:
          psychologist?.fullName ?? "Psicólogo",
        date: formatDate(date),
        startTime: formatHour(slot.startTime),
        endTime: formatHour(slot.endTime),
      });
    } catch (error) {
      console.error("Error creando cita:", error);
    } finally {
      setBooking(false);
    }
  };

  return (
    <>
      <Layout>
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800">
              Agendar Cita
            </h1>

            <p className="text-gray-500 mt-2">
              Selecciona un psicólogo y una fecha para encontrar horarios
              disponibles.
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
                onChange={(e) =>
                  setSelectedPsychologist(e.target.value)
                }
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-400"
                disabled={booking}
              >
                {psychologists.length === 0 ? (
                  <option value="">
                    No hay psicólogos disponibles
                  </option>
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
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-400"
                disabled={booking}
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
                    onClick={() => void handleBook(slot)}
                    disabled={slot.isBooked || booking}
                    className={`p-4 rounded-xl border transition font-medium ${
                      slot.isBooked
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : booking
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
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

      {bookingConfirmation && (
        <BookingConfirmationModal
          psychologistName={bookingConfirmation.psychologistName}
          date={bookingConfirmation.date}
          startTime={bookingConfirmation.startTime}
          endTime={bookingConfirmation.endTime}
          onClose={() => setBookingConfirmation(null)}
          onViewAppointments={() => {
            setBookingConfirmation(null);
            navigate("/mis-citas");
          }}
        />
      )}
    </>
  );
}

function formatDate(dateString: string) {
  if (!dateString) {
    return "";
  }

  // Noon avoids accidental date shifts caused by timezone conversion.
  const date = new Date(`${dateString}T12:00:00`);

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