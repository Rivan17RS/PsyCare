type BookingConfirmationModalProps = {
  psychologistName: string;
  date: string;
  startTime: string;
  endTime: string;
  onClose: () => void;
  onViewAppointments: () => void;
};

export default function BookingConfirmationModal({
  psychologistName,
  date,
  startTime,
  endTime,
  onClose,
  onViewAppointments,
}: BookingConfirmationModalProps) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-confirmation-title"
    >
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        {/* Success icon */}
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-7 w-7 text-green-600"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m5 12 4 4L19 6"
            />
          </svg>
        </div>

        {/* Header */}
        <div className="mt-4 text-center">
          <h2
            id="booking-confirmation-title"
            className="text-2xl font-semibold text-gray-900"
          >
            Cita agendada correctamente
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Tu sesión ha sido reservada exitosamente.
          </p>
        </div>

        {/* Appointment details */}
        <div className="mt-6 rounded-xl bg-gray-50 p-4">
          <div className="space-y-3 text-sm">
            <div className="flex items-start justify-between gap-4">
              <span className="text-gray-500">Psicólogo</span>
              <span className="text-right font-medium text-gray-900">
                {psychologistName}
              </span>
            </div>

            <div className="flex items-start justify-between gap-4">
              <span className="text-gray-500">Fecha</span>
              <span className="text-right font-medium text-gray-900">
                {date}
              </span>
            </div>

            <div className="flex items-start justify-between gap-4">
              <span className="text-gray-500">Hora</span>
              <span className="text-right font-medium text-gray-900">
                {startTime} - {endTime}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Cerrar
          </button>

          <button
            type="button"
            onClick={onViewAppointments}
            className="rounded-lg bg-green-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-green-700"
          >
            Ver mis citas
          </button>
        </div>
      </div>
    </div>
  );
}