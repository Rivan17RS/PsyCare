import { useEffect, useState } from "react";

import Layout from "../../../components/layout/Layout";

import {
  getAvailability,
  generateAvailability,
  deleteAvailabilitySlot,
  generateAvailabilityRange,
  getAvailabilityRange,
  deleteAvailabilityRange,
  type AvailabilitySlot,
  type AvailabilityDay,
} from "../services/availabilityService";

export default function AvailabilityDashboard() {
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);

  const [rangeAvailability, setRangeAvailability] = useState<
    AvailabilityDay[]
  >([]);

  const [loading, setLoading] = useState(false);
  const [rangeLoading, setRangeLoading] = useState(false);

  const [startHour, setStartHour] = useState(8);
  const [startPeriod, setStartPeriod] = useState<"AM" | "PM">("AM");

  const [endHour, setEndHour] = useState(5);
  const [endPeriod, setEndPeriod] = useState<"AM" | "PM">("PM");

  const [slotMinutes, setSlotMinutes] = useState(30);

  const [mode, setMode] = useState<"single" | "range">("single");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // ------------------------------------------------------------
  // SINGLE DAY - Fetch availability
  // ------------------------------------------------------------
  useEffect(() => {
    if (mode !== "single" || !date) {
      return;
    }

    const fetchSingleAvailability = async () => {
      try {
        setLoading(true);

        const data = await getAvailability(
          `${date}T00:00:00.000Z`
        );

        const sorted = data.sort(
          (a: AvailabilitySlot, b: AvailabilitySlot) =>
            new Date(a.startTime).getTime() -
            new Date(b.startTime).getTime()
        );

        setSlots(sorted);
      } catch (error) {
        console.error(
          "Error cargando disponibilidad:",
          error
        );

        setSlots([]);
      } finally {
        setLoading(false);
      }
    };

    void fetchSingleAvailability();
  }, [date, mode]);

  // ------------------------------------------------------------
  // RANGE - Fetch existing availability
  // ------------------------------------------------------------
  useEffect(() => {
    if (
      mode !== "range" ||
      !startDate ||
      !endDate
    ) {
      return;
    }

    if (new Date(endDate) < new Date(startDate)) {
      setRangeAvailability([]);
      return;
    }

    const fetchRangeAvailability = async () => {
      try {
        setRangeLoading(true);

        const data = await getAvailabilityRange(
          `${startDate}T00:00:00.000Z`,
          `${endDate}T23:59:59.999Z`
        );

        setRangeAvailability(data);
      } catch (error) {
        console.error(
          "Error cargando disponibilidad del rango:",
          error
        );

        setRangeAvailability([]);
      } finally {
        setRangeLoading(false);
      }
    };

    void fetchRangeAvailability();
  }, [startDate, endDate, mode]);

  // ------------------------------------------------------------
  // Helpers
  // ------------------------------------------------------------
  function convertTo24Hour(
    hour: number,
    period: "AM" | "PM"
  ) {
    if (period === "AM") {
      return hour === 12 ? 0 : hour;
    }

    return hour === 12 ? 12 : hour + 12;
  }

  function convertCostaRicaHourToUtc(hour24: number) {
    return hour24 + 6;
  }

  // ------------------------------------------------------------
  // Generate availability
  // ------------------------------------------------------------
  const handleGenerate = async () => {
    try {
      const startHour24 = convertTo24Hour(
        startHour,
        startPeriod
      );

      const endHour24 = convertTo24Hour(
        endHour,
        endPeriod
      );

      if (startHour24 >= endHour24) {
        alert(
          "La hora final debe ser mayor a la hora inicial."
        );

        return;
      }

      const startHourUtc =
        convertCostaRicaHourToUtc(startHour24);

      const endHourUtc =
        convertCostaRicaHourToUtc(endHour24);

      // --------------------------------------------------------
      // SINGLE MODE
      // --------------------------------------------------------
      if (mode === "single") {
        if (!date) {
          alert("Selecciona una fecha.");
          return;
        }

        await generateAvailability({
          date: `${date}T00:00:00.000Z`,
          startHour: startHourUtc,
          endHour: endHourUtc,
          slotMinutes,
        });

        // Refresh the existing availability using GET.
        const data = await getAvailability(
          `${date}T00:00:00.000Z`
        );

        const sorted = data.sort(
          (a: AvailabilitySlot, b: AvailabilitySlot) =>
            new Date(a.startTime).getTime() -
            new Date(b.startTime).getTime()
        );

        setSlots(sorted);

        alert(
          "Horarios generados correctamente."
        );

        return;
      }

      // --------------------------------------------------------
      // RANGE MODE
      // --------------------------------------------------------
      if (!startDate || !endDate) {
        alert("Selecciona rango de fechas.");
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
            `${startDate}T00:00:00.000Z`,
          endDate:
            `${endDate}T00:00:00.000Z`,
          startHour: startHourUtc,
          endHour: endHourUtc,
          slotMinutes,
        });

      // Refresh range through GET after generation.
      const refreshed =
        await getAvailabilityRange(
          `${startDate}T00:00:00.000Z`,
          `${endDate}T23:59:59.999Z`
        );

      setRangeAvailability(refreshed);

      alert(
        `Horarios generados.\n\nCreados: ${result.created}\nDuplicados omitidos: ${result.skipped}`
      );
    } catch (error) {
      console.error(
        "Error generando disponibilidad:",
        error
      );

      alert(
        "Error generando disponibilidad."
      );
    }
  };

  // ------------------------------------------------------------
  // Delete availability range
  // ------------------------------------------------------------
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
              `${date}T00:00:00.000Z`,
            endDate:
              `${date}T23:59:59.999Z`,
          });

        // Refresh single-day availability.
        const refreshed =
          await getAvailability(
            `${date}T00:00:00.000Z`
          );

        const sorted = refreshed.sort(
          (a: AvailabilitySlot, b: AvailabilitySlot) =>
            new Date(a.startTime).getTime() -
            new Date(b.startTime).getTime()
        );

        setSlots(sorted);

        alert(
          `Disponibilidad limpiada.\n\nEliminados: ${result.deleted}\nReservados preservados: ${result.preservedBooked}`
        );

        return;
      }

      // RANGE MODE
      if (!startDate || !endDate) {
        alert("Selecciona rango de fechas.");
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
            `${startDate}T00:00:00.000Z`,
          endDate:
            `${endDate}T23:59:59.999Z`,
        });

      // Refresh range availability.
      const refreshed =
        await getAvailabilityRange(
          `${startDate}T00:00:00.000Z`,
          `${endDate}T23:59:59.999Z`
        );

      setRangeAvailability(refreshed);

      alert(
        `Disponibilidad limpiada.\n\nEliminados: ${result.deleted}\nReservados preservados: ${result.preservedBooked}`
      );
    } catch (error) {
      console.error(
        "Error limpiando disponibilidad:",
        error
      );

      alert(
        "Error limpiando disponibilidad."
      );
    }
  };

  // ------------------------------------------------------------
  // Delete single slot
  // ------------------------------------------------------------
  const handleDelete = async (slotId: string) => {
    try {
      await deleteAvailabilitySlot(slotId);

      setSlots((prev) =>
        prev.filter((slot) => slot.id !== slotId)
      );
    } catch (error) {
      console.error(error);

      alert(
        "No se pudo eliminar el horario."
      );
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
            Gestiona tus horarios disponibles para citas.
          </p>
        </div>

        {/* Scheduling mode */}
        <div className="bg-white rounded-2xl shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Visualización de disponibilidad
          </h2>

          <div className="mb-6">
            <p className="text-sm text-gray-500 mb-2">
              Selecciona una fecha específica o un rango
              para administrar tu disponibilidad.
            </p>
          </div>

          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={mode === "single"}
                onChange={() => {
                  setMode("single");
                  setRangeAvailability([]);
                }}
              />

              <span>Día único</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={mode === "range"}
                onChange={() => {
                  setMode("range");
                  setSlots([]);
                }}
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
                min={
                  new Date()
                    .toISOString()
                    .split("T")[0]
                }
                onChange={(e) =>
                  setDate(e.target.value)
                }
                className="border rounded-lg p-3 w-full md:w-64"
              />
            </div>
          ) : (
            <div>
              <div className="grid md:grid-cols-2 gap-4">
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
                    min={
                      new Date()
                        .toISOString()
                        .split("T")[0]
                    }
                    onChange={(e) =>
                      setStartDate(e.target.value)
                    }
                    className="border rounded-lg p-3 w-full"
                  />
                </div>

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
                    min={
                      startDate ||
                      new Date()
                        .toISOString()
                        .split("T")[0]
                    }
                    onChange={(e) =>
                      setEndDate(e.target.value)
                    }
                    className="border rounded-lg p-3 w-full"
                  />
                </div>
              </div>

              {startDate &&
                endDate &&
                new Date(endDate) <
                  new Date(startDate) && (
                  <p className="mt-3 text-sm text-red-600">
                    La fecha final debe ser mayor o igual a
                    la fecha inicial.
                  </p>
                )}
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
              Crea tus horarios utilizando el formato
              estándar AM/PM. El rango de horas y la duración
              de cada cita se pueden configurar a tu
              conveniencia.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {/* Start Hour */}
            <div>
              <label
                htmlFor="startHour"
                className="block text-sm mb-2"
              >
                Hora inicio
              </label>

              <div className="flex gap-2">
                <select
                  id="startHour"
                  value={startHour}
                  onChange={(e) =>
                    setStartHour(
                      Number(e.target.value)
                    )
                  }
                  className="border rounded-lg p-3 w-full"
                >
                  {Array.from(
                    { length: 12 },
                    (_, i) => i + 1
                  ).map((hour) => (
                    <option
                      key={hour}
                      value={hour}
                    >
                      {hour}
                    </option>
                  ))}
                </select>

                <select
                  id="startPeriod"
                  value={startPeriod}
                  onChange={(e) =>
                    setStartPeriod(
                      e.target.value as "AM" | "PM"
                    )
                  }
                  className="border rounded-lg p-3 w-28"
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
            </div>

            {/* End Hour */}
            <div>
              <label
                htmlFor="endHour"
                className="block text-sm mb-2"
              >
                Hora fin
              </label>

              <div className="flex gap-2">
                <select
                  id="endHour"
                  value={endHour}
                  onChange={(e) =>
                    setEndHour(
                      Number(e.target.value)
                    )
                  }
                  className="border rounded-lg p-3 w-full"
                >
                  {Array.from(
                    { length: 12 },
                    (_, i) => i + 1
                  ).map((hour) => (
                    <option
                      key={hour}
                      value={hour}
                    >
                      {hour}
                    </option>
                  ))}
                </select>

                <select
                  id="endPeriod"
                  value={endPeriod}
                  onChange={(e) =>
                    setEndPeriod(
                      e.target.value as "AM" | "PM"
                    )
                  }
                  className="border rounded-lg p-3 w-28"
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
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
                  setSlotMinutes(
                    Number(e.target.value)
                  )
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
            <button
              onClick={handleGenerate}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg"
            >
              Generar horarios
            </button>

            <button
              onClick={handleDeleteRange}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg"
            >
              Eliminar Disponibilidad
            </button>
          </div>
        </div>

        {/* Single-day availability */}
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
              <div className="grid md:grid-cols-2 gap-4 mt-6">
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
                          void handleDelete(slot.id)
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

        {/* Range availability */}
        {mode === "range" && (
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-semibold mb-6">
              Disponibilidad del período
            </h2>

            {!startDate || !endDate ? (
              <div className="text-gray-500">
                Selecciona una fecha de inicio y una fecha
                de fin para consultar disponibilidad.
              </div>
            ) : new Date(endDate) <
              new Date(startDate) ? (
              <div className="text-red-500">
                El rango de fechas no es válido.
              </div>
            ) : rangeLoading ? (
              <div className="text-blue-500">
                Cargando disponibilidad...
              </div>
            ) : rangeAvailability.length === 0 ? (
              <div className="text-gray-500">
                No hay horarios configurados en este período.
              </div>
            ) : (
              <div className="space-y-6">
                {rangeAvailability.map((day) => (
                  <div
                    key={day.date}
                    className="border rounded-xl p-5"
                  >
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-gray-800 capitalize">
                        {formatDateLabel(
                          day.date.substring(0, 10)
                        )}
                      </h3>
                    </div>

                    <div className="grid md:grid-cols-2 gap-3">
                      {day.slots.map((slot) => (
                        <div
                          key={slot.id}
                          className="border rounded-lg p-3 flex justify-between items-center"
                        >
                          <div>
                            <p className="font-medium">
                              {formatHour(
                                slot.startTime
                              )}{" "}
                              -{" "}
                              {formatHour(
                                slot.endTime
                              )}
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
                                void handleDelete(
                                  slot.id
                                )
                              }
                              className="text-red-500 hover:underline"
                            >
                              Eliminar
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
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

// ------------------------------------------------------------
// Formatting helpers
// ------------------------------------------------------------

function formatHour(dateString: string) {
  const date = new Date(dateString);

  return date.toLocaleTimeString("es-CR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "America/Costa_Rica",
  });
}

function formatDateLabel(dateString: string) {
  const [year, month, day] =
    dateString.split("-").map(Number);

  const date = new Date(
    year,
    month - 1,
    day
  );

  return date.toLocaleDateString("es-CR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}