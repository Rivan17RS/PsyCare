import apiClient from "../../../api/apiClient";

export type AvailabilitySlot = {
  id: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
};

export type AvailabilityDay = {
  date: string;
  slots: AvailabilitySlot[];
};

export type GenerateAvailabilityRangeRequest = {
  startDate: string;
  endDate: string;
  startHour: number;
  endHour: number;
  slotMinutes: number;
};

export type GenerateAvailabilityRangeResult = {
  created: number;
  skipped: number;
};

export type DeleteAvailabilityRangeRequest = {
  startDate: string;
  endDate: string;
};

export type DeleteAvailabilityRangeResult = {
  deleted: number;
  preservedBooked: number;
};

export const getAvailability = async (
  date: string
) => {
  const response = await apiClient.get<AvailabilitySlot[]>(
    `/psychologist/availability?date=${date}`
  );

  return response.data;
};

export const generateAvailability = async (
  payload: {
    date: string;
    startHour: number;
    endHour: number;
    slotMinutes: number;
  }
) => {
  const response = await apiClient.post(
    "/psychologist/availability/generate",
    payload
  );

  return response.data;
};

export const deleteAvailabilitySlot = async (
  slotId: string
) => {
  await apiClient.delete(
    `/psychologist/availability/${slotId}`
  );
};

export const generateAvailabilityRange = async (
  payload: GenerateAvailabilityRangeRequest
): Promise<GenerateAvailabilityRangeResult> => {
  const response =
    await apiClient.post<GenerateAvailabilityRangeResult>(
      "/psychologist/availability/generate-range",
      payload
    );

  return response.data;
};

export const getAvailabilityRange = async (
  startDate: string,
  endDate: string
): Promise<AvailabilityDay[]> => {
  const response =
    await apiClient.get<AvailabilityDay[]>(
      "/psychologist/availability/range",
      {
        params: {
          startDate,
          endDate,
        },
      }
    );

  return response.data;
};

export const deleteAvailabilityRange = async (
  payload: DeleteAvailabilityRangeRequest
): Promise<DeleteAvailabilityRangeResult> => {
  const response =
    await apiClient.delete<DeleteAvailabilityRangeResult>(
      "/psychologist/availability/range",
      {
        data: payload,
      }
    );

  return response.data;
};