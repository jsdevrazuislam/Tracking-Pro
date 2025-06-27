 interface LoginResponse {
  statusCode: number;
  data: LoginData;
  message: string;
  success: boolean;
}
 interface LoginData {
  user: User;
  access_token: string;
}
 interface User {
  id: string;
  full_name: string;
  email: string;
  role: string;
  phone: string;
  status: string;
  location: {
    latitude: number
    longitude:number
    place_name:string
  };
  createdAt: string;
  updatedAt: string;
}
