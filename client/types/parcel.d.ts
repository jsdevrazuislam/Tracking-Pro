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

 interface AgentStatsResponse {
  statusCode: number;
  data: AgentStatsData;
  message: string;
  success: boolean;
}
 interface AgentStatsData {
  assigned: number;
  picked: number;
  in_transit: number;
  delivered: number;
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
  current_location?: LocationOrReceiverAddressOrPickupAddress | null;
  createdAt: string;
  updatedAt: string;
  agent: User;
  timeline?: TimelineEntity[];
}
 interface LocationOrReceiverAddressOrPickupAddress {
  lat: number;
  long: number;
  place_name: string;
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


 interface AgentNavigateDetailsResponse {
  statusCode: number;
  data: AgentNavigateDetailsData;
  message: string;
  success: boolean;
}
 interface AgentNavigateDetailsData {
  parcel: Parcel;
}
 interface Parcel {
  id: string;
  senderId: string;
  receiver_address: ReceiverAddressOrPickupAddress;
  pickup_address: ReceiverAddressOrPickupAddress;
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
  sender: User;
}
 interface ReceiverAddressOrPickupAddress {
  lat: number;
  long: number;
  place_name: string;
}
 interface Location {
  latitude: number;
  longitude: number;
  place_name: string;
}
