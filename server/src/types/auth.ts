export interface UserType{
    full_name: string
}

export interface JwtResponse{
  id: number,
  email: string,
  iat: number,
  exp: number
}