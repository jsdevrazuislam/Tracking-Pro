interface LoginPayload {
  email: string;
  password: string;
}
interface RegisterPayload {
  email: string;
  password: string;
  full_name: string;
  role: string;
}

interface BookParcelPayload {
  pickup_address: string;
  receiver_address: string;
  parcel_size: number;
  parcel_type: string;
  payment_type: string;
  amount: number
}
