import apiClient from "../../../api/apiClient";

export type RegisterPsychologistRequest = {
  token: string;
  fullName: string;
  legalIdentityNumber: string;
  professionalLicense: string;
  specialty: string;
  password: string;
};

export async function registerPsychologist(
  request: RegisterPsychologistRequest
): Promise<string> {
  const response = await apiClient.post<string>(
    "/auth/register-psychologist",
    request
  );

  return response.data;
}