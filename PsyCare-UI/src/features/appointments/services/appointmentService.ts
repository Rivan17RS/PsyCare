import apiClient from "../../../api/apiClient";

export type Psychologist = {
  id: string;
  fullName: string;
};

export type Slot = {
  startTime: string;
  endTime: string;
  psychologistId: string;
  isBooked?: boolean;
};

export type CreateAppointmentRequest = {
  psychologistId: string;
  startTime: string;
  endTime: string;
  mode: number;
};

export type CreateAppointmentResponse = {
  appointmentId: string;
};

export async function getPsychologists(): Promise<Psychologist[]> {
  const response = await apiClient.get<Psychologist[]>(
    "/clinics/psychologists"
  );

  return response.data;
}

export async function getAvailability(
  psychologistId: string,
  date: string
): Promise<Slot[]> {
  const response = await apiClient.get<Slot[]>(
    "/Appointments/availability",
    {
      params: {
        psychologistId,
        date,
      },
    }
  );

  return response.data;
}

export async function createAppointment(
  request: CreateAppointmentRequest
): Promise<CreateAppointmentResponse> {
  const response =
    await apiClient.post<CreateAppointmentResponse>(
      "/Appointments",
      request
    );

  return response.data;
}