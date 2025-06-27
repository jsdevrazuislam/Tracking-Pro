import api from "@/lib/api";
import ApiStrings from "@/lib/api-strings";

export const bookParcel = async (payload: BookParcelPayload) => {
  const response = await api.post<BookParcelResponse>(
    ApiStrings.BOOK_PARCEL,
    payload
  );
  return response.data;
};

export const getStats = async (): Promise<CustomerStatsResponse> => {
  const response = await api.get<CustomerStatsResponse>(ApiStrings.GET_STATS);
  return response.data;
};

export const getParcels = async ({ page = 1, limit = 10 }): Promise<ParcelResponse> => {
  const response = await api.get<ParcelResponse>(ApiStrings.GET_PARCELS,{ params: { page, limit } });
  return response.data;
};

export const trackParcel = async (id:string): Promise<TrackResponse> =>{
  const response = await api.get<TrackResponse>(`${ApiStrings.TRACK_PARCEL}/${id}`);
  return response.data;
}