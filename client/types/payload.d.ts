interface LoginPayload {
  email: string;
  password: string;
}
interface RegisterPayload {
  email: string;
  password: string;
  full_name: string;
  role: string;
  phone:string
  location:object
}

interface BookParcelPayload {
  pickup_address: object;
  receiver_address: object;
  parcel_size: number;
  parcel_type: string;
  payment_type: string;
  amount: number
}

interface UpdateStatus{
  status: string,
  current_location: object
  id:string
}

interface AssignParcelBooking{
  parcelId:string
  agentId:string
}