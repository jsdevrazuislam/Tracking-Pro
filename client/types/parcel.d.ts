interface BookParcelResponse {
  statusCode: number;
  data: BookParcelData;
  message: string;
  success: boolean;
}
interface BookParcelData {
  id: string;
  status: string;
  pickup_address: string;
  receiver_address: string;
  parcel_size: string;
  parcel_type: string;
  payment_type: string;
  senderId: string;
  tracking_code: string;
  updatedAt: string;
  createdAt: string;
  assignedAgentId?: null;
  current_location?: null;
}


interface CustomerStatsResponse {
  statusCode: number;
  data: CustomerStats;
  message: string;
  success: boolean;
}
interface CustomerStats {
  total: number;
  delivered: number;
  inTransit: number;
  pending: number;
}


interface ParcelResponse {
  statusCode: number;
  data: ParcelData;
  message: string;
  success: boolean;
}
interface ParcelData {
  parcels?: (ParcelsEntity)[] | null;
  pagination: Pagination;
}
interface ParcelsEntity {
  id: string;
  senderId: string;
  amount: string;
  receiver_address: Address;
  pickup_address: Address;
  parcel_size: string;
  parcel_type: string;
  payment_type: string;
  status: string;
  assignedAgentId?: null;
  tracking_code: string;
  current_location?: null;
  createdAt: string;
  updatedAt: string;
  progress: number;
  sender: User
}

interface Address{
    lat:number,
    long:number,
    place_name:string
}
interface Pagination {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}


 interface TrackResponse {
  statusCode: number;
  data: TrackParcelData;
  message: string;
  success: boolean;
}
 interface TrackParcelData {
  id: string;
  senderId: string;
  receiver_address: LocationOrReceiverAddressOrPickupAddress;
  pickup_address: LocationOrReceiverAddressOrPickupAddress;
  parcel_size: string;
  amount: number;
  parcel_type: string;
  payment_type: string;
  status: string;
  assignedAgentId: string;
  tracking_code: string;
  current_location?: null;
  createdAt: string;
  updatedAt: string;
  agent: Agent;
  timeline?: TimelineEntity[];
}
 interface LocationOrReceiverAddressOrPickupAddress {
  lat: number;
  long: number;
  place_name: string;
}
 interface Agent {
  full_name: string;
  email: string;
  id: string;
}
 interface TimelineEntity {
  id: string;
  parcelId: string;
  status: string;
  location: LocationOrReceiverAddressOrPickupAddress;
  timestamp: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}
