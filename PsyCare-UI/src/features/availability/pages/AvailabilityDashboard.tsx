import { useEffect, useState } from "react";

import Layout from "../../../components/layout/Layout";


import {
  getAvailability,
  generateAvailability,
  deleteAvailabilitySlot,
  generateAvailabilityRange,
  deleteAvailabilityRange,
} from "../services/availabilityService";

type Slot = {
  id: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
};

export default function AvailabilityDashboard() {
  const [date, setDate] = useState("");

  const [slots, setSlots] = useState<Slot[]>([]);

  const [loading, setLoading] = useState(false);

  const [startHour, setStartHour] = useState(8);

  const [endHour, setEndHour] = useState(17);

  const [slotMinutes, setSlotMinutes] = useState(30);

  const [mode, setMode] = useState<"single" | "range">("single");

  const [startDate, setStartDate] = useState("");

  const [endDate, setEndDate] = useState("");

  const [processing, setProcessing] = useState(false);

  // Fetch availability
  useEffect(() => {
    if (!date) return;

    fetchAvailability();
  }, [date]);

  const fetchAvailability = async () => {
    try {
      setLoading(true);

      const data = await getAvailability(
        `${date}T00:00:00Z`
      );

      const sorted = data.sort(
        (a: Slot, b: Slot) =>
          new Date(a.startTime).getTime() -
          new Date(b.startTime).getTime()
      );

      setSlots(sorted);
    } catch (error) {
      console.error(
        "Error cargando disponibilidad:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    try {

        // Validation
        if (startHour >= endHour) {
        alert(
            "La hora final debe ser mayor a la inicial."
        );

        return;
        }

        // SINGLE MODE
        if (mode === "single") {

        if (!date) {
            alert("Selecciona una fecha.");

            return;
        }

        await generateAvailability({
            date: `${date}T00:00:00Z`,
            startHour,
            endHour,
            slotMinutes,
        });

        setMode("single");

        setDate(startDate);

        alert(
            "Horarios generados correctamente."
        );

        return;
        }

        // RANGE MODE
        if (!startDate || !endDate) {
        alert(
            "Selecciona rango de fechas."
        );

        return;
        }

        if (new Date(endDate) < new Date(startDate)) {
            alert(
                "La fecha final debe ser mayor o igual a la fecha inicial."
            );

            return;
        }

        const result =
        await generateAvailabilityRange({
            startDate:
            `${startDate}T00:00:00Z`,

            endDate:
            `${endDate}T00:00:00Z`,

            startHour,
            endHour,
            slotMinutes,
        });

        alert(
        `Horarios generados.\n\nCreados: ${result.created}\nDuplicados omitidos: ${result.skipped}`
        );

    } catch (error) {

        console.error(error);

        alert(
        "Error generando disponibilidad."
        );
    }
  };

  const handleDeleteRange = async () => {
    try {

        if (mode === "single") {

        if (!date) {
            alert("Selecciona una fecha.");

            return;
        }

        const result =
            await deleteAvailabilityRange({
            startDate:
                `${date}T00:00:00Z`,

            endDate:
                `${date}T23:59:59Z`,
            });

        setMode("single");

        setDate(startDate);

        alert(
            `Disponibilidad limpiada.\n\nEliminados: ${result.deleted}\nReservados preservados: ${result.preservedBooked}`
        );

        return;
        }

        // RANGE
        if (!startDate || !endDate) {
        alert(
            "Selecciona rango de fechas."
        );

        return;
        }

        if (new Date(endDate) < new Date(startDate)) {
            alert(
                "La fecha final debe ser mayor o igual a la fecha inicial."
            );

            return;
        }

        const result =
        await deleteAvailabilityRange({
            startDate:
            `${startDate}T00:00:00Z`,

            endDate:
            `${endDate}T23:59:59Z`,
        });

        alert(
        `Disponibilidad limpiada.\n\nEliminados: ${result.deleted}\nReservados preservados: ${result.preservedBooked}`
        );

    } catch (error) {

        console.error(error);

        alert(
        "Error limpiando disponibilidad."
        );
    }
    };

  const handleDelete = async (slotId: string) => {
    try {
      await deleteAvailabilitySlot(slotId);

      setSlots((prev) =>
        prev.filter((slot) => slot.id !== slotId)
      );
    } catch (error) {
      console.error(error);

      alert("No se pudo eliminar el horario.");
    }
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Mi Disponibilidad
          </h1>

          <p className="text-gray-500 mt-2">
            Gestiona tus horarios disponibles
            para citas.
          </p>
        </div>

        {/* Scheduling mode */}
        <div className="bg-white rounded-2xl shadow p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">
                Visualización de disponibilidad
            </h2>
                <div className="mb-6">
                    <p className="text-sm text-gray-500 mb-2">
                    Selecciona una fecha específica o un rango para administrar tu disponibilidad.
                    </p>
                </div>

            <div className="flex gap-6">
                
                {/* Single */}
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="radio"
                        checked={mode === "single"}
                        onChange={() => setMode("single")}
                    />

                    <span>Día único</span>
                </label>

                {/* Range */}
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="radio"
                        checked={mode === "range"}
                        onChange={() => setMode("range")}
                    />

                    <span>Rango de fechas</span>
                </label>
            </div>
        </div>

        {/* Date selector */}
        <div className="bg-white rounded-2xl shadow p-6 mb-8">

            {mode === "single" ? (
            <div>
                <label
                    htmlFor="availabilityDate"
                    className="block text-sm font-medium text-gray-700 mb-2"
                >
                    Fecha
                </label>

                <input
                    id="availabilityDate"
                    type="date"
                    value={date}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setDate(e.target.value)}
                    className="border rounded-lg p-3 w-full md:w-64"
                />
            </div>
            ) : (
                <div className="grid md:grid-cols-2 gap-4">

                {/* Start date */}
                <div>
                    <label
                    htmlFor="startDate"
                    className="block text-sm font-medium text-gray-700 mb-2"
                    >
                    Fecha inicio
                    </label>

                    <input
                    id="startDate"
                    type="date"
                    value={startDate}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) =>
                        setStartDate(e.target.value)
                    }
                    className="border rounded-lg p-3 w-full"
                    />
                </div>

                {/* End date */}
                <div>
                    <label
                    htmlFor="endDate"
                    className="block text-sm font-medium text-gray-700 mb-2"
                    >
                    Fecha fin
                    </label>

                    <input
                    id="endDate"
                    type="date"
                    value={endDate}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) =>
                        setEndDate(e.target.value)
                    }
                    className="border rounded-lg p-3 w-full"
                    />
                </div>
            </div>
         )}
        </div>

        {/* Generator */}
        <div className="bg-white rounded-2xl shadow p-6 mb-8">
            <h2 className="text-xl font-semibold mb-6">
                Generar Horarios
            </h2>
            <div className="mb-10">
                <p className="text-sm text-gray-500 mb-2">
                    Crea tus horarios utilizando el formato de hora militar. 
                    El rango de horas y la duración
                    de cada cita se pueden configurar a tu
                    conveniencia.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
                {/* Start */}
                <div>
                    <label
                    htmlFor="startHour"
                    className="block text-sm mb-2"
                    >
                    Hora inicio
                    </label>

                    <input
                    id="startHour"
                    type="number"
                    value={startHour}
                    min={0}
                    max={23}
                    onChange={(e) =>
                        setStartHour(Number(e.target.value))
                    }
                    className="border rounded-lg p-3 w-full"
                    />
                </div>

                {/* End */}
                <div>
                    <label
                    htmlFor="endHour"
                    className="block text-sm mb-2"
                    >
                    Hora fin
                    </label>

                    <input
                    id="endHour"
                    type="number"
                    value={endHour}
                    min={1}
                    max={24}
                    onChange={(e) =>
                        setEndHour(Number(e.target.value))
                    }
                    className="border rounded-lg p-3 w-full"
                    />
                </div>

                {/* Duration */}
                <div>
                    <label
                    htmlFor="slotMinutes"
                    className="block text-sm mb-2"
                    >
                    Duración
                    </label>

                    <select
                        id="slotMinutes"
                        value={slotMinutes}
                        onChange={(e) =>
                            setSlotMinutes(Number(e.target.value))
                        }
                        className="border rounded-lg p-3 w-full"
                        >
                        <option value={30}>
                            30 minutos
                        </option>

                        <option value={60}>
                            60 minutos
                        </option>
                    </select>
                </div>
            </div>

                {/* Action buttons */}
                <div className="flex flex-col md:flex-row gap-4 mt-6">

                {/* Generate */}
                <button
                    onClick={handleGenerate}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg"
                >
                    Generar horarios
                </button>

                {/* Delete */}
                <button
                    onClick={handleDeleteRange}
                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg"
                >
                    Limpiar Todos
                </button>
            </div>
        </div>

        {/* Slots */}
        {mode === "single" && (
            <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-semibold mb-6">
                Disponibilidad del día
            </h2>

            {date && (
                <p className="text-gray-500 mt-1 capitalize">
                    {formatDateLabel(date)}
                </p>
            )}

            {!date ? (
                <div className="text-gray-500">
                Selecciona una fecha.
                </div>
            ) : loading ? (
                <div className="text-blue-500">
                Cargando disponibilidad...
                </div>
            ) : slots.length === 0 ? (
                <div className="text-gray-500">
                No hay horarios configurados.
                </div>
            ) : (
                <div className="grid md:grid-cols-2 gap-4">
                {slots.map((slot) => (
                    <div
                    key={slot.id}
                    className="border rounded-xl p-4 flex justify-between items-center"
                    >
                    <div>
                        <p className="font-medium">
                        {formatHour(slot.startTime)} -{" "}
                        {formatHour(slot.endTime)}
                        </p>

                        <p
                        className={`text-sm mt-1 ${
                            slot.isBooked
                            ? "text-red-500"
                            : "text-green-600"
                        }`}
                        >
                        {slot.isBooked
                            ? "Reservado"
                            : "Disponible"}
                        </p>
                    </div>

                    {!slot.isBooked && (
                        <button
                        onClick={() =>
                            handleDelete(slot.id)
                        }
                        className="text-red-500 hover:underline"
                        >
                        Eliminar
                        </button>
                    )}
                    </div>
                ))}
                </div>
            )}
            </div>
        )}
      </div>
    </Layout>
  );
}

function formatHour(dateString: string) {
  const date = new Date(dateString);

  return date.toLocaleTimeString("es-CR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Costa_Rica",
  });
}

function formatDateLabel(dateString: string) {
  const date = new Date(dateString);

  return date.toLocaleDateString("es-CR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "America/Costa_Rica",
  });
}