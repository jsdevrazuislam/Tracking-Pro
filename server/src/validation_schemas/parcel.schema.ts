import { z } from 'zod';


export const create_parcel = z.object({
  pickup_address: z.string().min(1, "pickup_address is required"),
  receiver_address: z.string().min(1, "receiver_address is required"),
  parcel_size: z.number().min(1, "parcel_size is required "),
  parcel_type: z.string().min(1, "parcel_type is required "),
  payment_type: z.string().min(1, "payment_type is required "),
});
