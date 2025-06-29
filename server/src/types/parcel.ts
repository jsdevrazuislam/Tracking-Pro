import { Parcel } from "@/models/parcel.models";

export type UpdatableParcelFields = Pick<
  Parcel,
  'pickup_address' | 'receiver_address' | 'parcel_size' | 'parcel_type' | 'payment_type' | 'amount'
>;
