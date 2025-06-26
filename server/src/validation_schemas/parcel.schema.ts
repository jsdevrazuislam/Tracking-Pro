import { z } from 'zod';


export const create_parcel = z.object({
  pickup_address: z.object({
    place_name: z.string().min(10, { message: "Pickup address name must be at least 10 characters." }).max(255, { message: "Pickup address name is too long." }),
    lat: z.number().min(-90, "Latitude must be between -90 and 90.").max(90, "Latitude must be between -90 and 90."),
    long: z.number().min(-180, "Longitude must be between -180 and 180.").max(180, "Longitude must be between -180 and 180."),
  }, { message: "Pickup address is required and must include name, latitude, and longitude." }),

  receiver_address: z.object({
    place_name: z.string().min(10, { message: "Receiver address name must be at least 10 characters." }).max(255, { message: "Receiver address name is too long." }),
    lat: z.number().min(-90, "Latitude must be between -90 and 90.").max(90, "Latitude must be between -90 and 90."),
    long: z.number().min(-180, "Longitude must be between -180 and 180.").max(180, "Longitude must be between -180 and 180."),
  }, { message: "Receiver address is required and must include name, latitude, and longitude." }),
  parcel_size: z.number().min(1, "parcel_size is required "),
  parcel_type: z.string().min(1, "parcel_type is required "),
  payment_type: z.string().min(1, "payment_type is required "),
});
