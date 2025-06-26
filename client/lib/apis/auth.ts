import api from "@/lib/api";
import ApiStrings from "@/lib/api-strings";

export const loginUser = async (payload: LoginPayload): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>(ApiStrings.LOGIN, payload);
  return response.data;
};

export const registerUser = async (payload: RegisterPayload): Promise<LoginResponse>  => {
  const response = await api.post<LoginResponse>(ApiStrings.REGISTER, payload);
  return response.data;
}
