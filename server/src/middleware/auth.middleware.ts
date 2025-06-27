import asyncHandler from "@/utils/async-handler";
import ApiError from "@/utils/api-error";
import { User } from "@/models";
import { NextFunction, Request, Response } from "express";
import { decode_token } from "@/utils/auth-helper";
import { JwtResponse } from "@/types/auth";
import { UserRole, UserStatus } from "@/models/user.models";

export const verify_auth = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const token =
      req.cookies?.access_token ||
      req.headers["authorization"]?.replace("Bearer ", "");

    if (!token) throw new ApiError(404, "Invalid access token");
    const decode_jwt = decode_token(
      token,
      process.env.ACCESS_TOKEN_SECRET!
    ) as JwtResponse;
    const user = await User.findOne({
      where: { id: decode_jwt.id },
      attributes: { exclude: ["password"] },
    });
    if (!user) throw new ApiError(404, "User not found in jwt");
    if (user?.status !== UserStatus.ACTIVE) throw new ApiError(404, "You can't login. Please contact with admin");

    req.user = user?.toJSON();
    next();
  }
);

export const require_role = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = req.user;

    if (!user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    if (!roles.includes(user.role)) {
      res.status(403).json({ message: 'Forbidden: Insufficient role' });
      return;
    }

    next();
  };
};