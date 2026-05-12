import apiClient from "../../../api/apiClient";

export const getAvailability = async (
  date: string
) => {
  const response = await apiClient.get(
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

export const generateAvailabilityRange =
  async (payload: {
    startDate: string;
    endDate: string;
    startHour: number;
    endHour: number;
    slotMinutes: number;
  }) => {
    const response = await apiClient.post(
      "/psychologist/availability/generate-range",
      payload
    );

    return response.data;
};

export const deleteAvailabilityRange =
  async (payload: {
    startDate: string;
    endDate: string;
  }) => {
    const response = await apiClient.delete(
      "/psychologist/availability/range",
      {
        data: payload,
      }
    );

    return response.data;
};