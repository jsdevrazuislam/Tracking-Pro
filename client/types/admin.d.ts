interface AdminStatsResponse {
  statusCode: number;
  data: AdminStats;
  message: string;
  success: boolean;
}
interface AdminStats {
  stats: Stats;
}
interface Stats {
  totalParcels: number;
  dailyBookings: number;
  activeAgents: string;
  codAmount: number;
  deliveredToday: number;
  transitToday: number
  pendingToday: number
  failedDeliveries: number;
  revenueThisMonth: number;
  todayRevenue: number;
  growthRate: number;
}

 interface AgentsResponse {
  statusCode: number;
  data: AgentData;
  message: string;
  success: boolean;
}
 interface AgentData {
  agents?: (AgentsEntity)[] | null;
  pagination: Pagination;
}
 interface AgentsEntity {
  id: string;
  full_name: string;
  email: string;
  currentDeliveries: number
  completedDeliveries: number
  createdAt: string;
  phone:string
}

 interface UsersResponse {
  statusCode: number;
  data: UserData;
  message: string;
  success: boolean;
}
 interface UserData {
  users?: (UsersEntity)[] | null;
  pagination: Pagination;
}
 interface UsersEntity {
  id: string;
  full_name: string;
  email: string;
  status: string;
  role: string;
  createdAt: string;
  phone: string
  totalOrders: number;
  completedDeliveries: number;
}


 interface BookingResponse {
  statusCode: number;
  data: BookingData;
  message: string;
  success: boolean;
}
 interface BookingData {
  bookings?: (BookingsEntity)[] | null;
  pagination: Pagination;
}
 interface BookingsEntity {
  id: string;
  senderId: string;
  receiver_address: ReceiverAddressOrPickupAddress;
  pickup_address: ReceiverAddressOrPickupAddress;
  parcel_size: string;
  amount: number;
  parcel_type: string;
  payment_type: string;
  status: string;
  assignedAgentId?: string | null;
  tracking_code: string;
  current_location?: null;
  createdAt: string;
  updatedAt: string;
  sender: SenderOrAgent;
  agent?: SenderOrAgent1 | null;
}
 interface ReceiverAddressOrPickupAddress {
  lat: number;
  long: number;
  place_name: string;
}
 interface SenderOrAgent {
  id: string;
  full_name: string;
  email: string;
  status: string;
  role: string;
}
 interface SenderOrAgent1 {
  id: string;
  full_name: string;
  email: string;
  status: string;
  role: string;
}