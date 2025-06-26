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
  createdAt: string;
  updatedAt: string;
}
