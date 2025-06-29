import { UserRole } from "@/models/user.models"

export interface UserType{
    full_name: string
}

export interface JwtResponse{
  id: number,
  email: string,
  iat: number,
  exp: number
}

export interface User{
  full_name:string
  id:string
  email:string
  phone:string
  role:UserRole
}