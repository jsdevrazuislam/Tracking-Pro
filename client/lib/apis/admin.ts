import api from "@/lib/api";
import ApiStrings from "@/lib/api-strings";

export const adminStats = async (): Promise<AdminStatsResponse> => {
  const response = await api.get<AdminStatsResponse>(
    ApiStrings.GET_ADMIN_STATS
  );
  return response.data;
};

export const unAssignParcels = async ({
  page = 1,
  limit = 10,
}): Promise<ParcelResponse> => {
  const response = await api.get<ParcelResponse>(
    ApiStrings.UNASSIGNED_PARCELS,
    { params: { page, limit } }
  );
  return response.data;
};

export const getActiveAgents = async ({
  page = 1,
  limit = 10,
}): Promise<AgentsResponse> => {
  const response = await api.get<AgentsResponse>(ApiStrings.GET_ACTIVE_AGENTS, {
    params: { page, limit },
  });
  return response.data;
};

export const getAllUsers = async ({
  page = 1,
  limit = 10,
}): Promise<UsersResponse> => {
  const response = await api.get<UsersResponse>(ApiStrings.GET_USERS, {
    params: { page, limit },
  });
  return response.data;
};

export const getAllBookings = async ({
  page = 1,
  limit = 10,
}): Promise<BookingResponse> => {
  const response = await api.get<BookingResponse>(ApiStrings.GET_BOOKINGS, {
    params: { page, limit },
  });
  return response.data;
};

export const assignParcel = async (payload:AssignParcelBooking) => {
  const response = await api.post(ApiStrings.ASSIGN_PARCEL, payload);
  return response.data;
};
