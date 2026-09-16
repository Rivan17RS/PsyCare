import apiClient from "../../../api/apiClient";

export type Sex = 0 | 1 | 2;

export type PsychologistProfile = {
  id: string;
  userId: string;
  legalIdentityNumber: string;
  professionalLicense: string;
  specialty: string;
  biography: string | null;
  sex: Sex;
  profileImageUrl: string | null;
};

export type UpdatePsychologistProfileRequest = {
  biography: string | null;
  sex: Sex;
  profileImageUrl: string | null;
};

export async function getPsychologistProfile(): Promise<PsychologistProfile> {
  const response = await apiClient.get<PsychologistProfile>(
    "/psychologist/profile"
  );

  return response.data;
}

export async function updatePsychologistProfile(
  request: UpdatePsychologistProfileRequest
): Promise<void> {
  await apiClient.put("/psychologist/profile", request);
}