import { User, UserRole } from "@/models/user.models";
import ApiError from "@/utils/api-error";
import ApiResponse from "@/utils/api-response";
import asyncHandler from "@/utils/async-handler";
import {
  compare_password,
  generate_access_token,
  hash_password,
} from "@/utils/auth-helper";
import { Request, Response } from "express";

const options = {
  httpOnly: true,
  secure: true,
};

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { email, full_name, password, role } = req.body;

  if (role === UserRole.ADMIN)
    throw new ApiError(400, `You can't signup as admin`);

  const user = await User.findOne({ where: { email } });

  if (user) throw new ApiError(400, "User already exist");

  const payload = {
    email,
    password: await hash_password(password),
    full_name,
    role: role ? role : UserRole.CUSTOMER,
  };

  const newUser = await User.create(payload);

  const access_token = generate_access_token({
    id: newUser.id,
    email,
    role: newUser.role,
  });

  const userWithoutPassword = await User.findByPk(newUser.id, {
    attributes: { exclude: ["password"] },
  });

  return res.cookie("access_token", access_token, options).json(
    new ApiResponse(
      200,
      {
        user: userWithoutPassword,
        access_token,
      },
      "Login Successfully"
    )
  );
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });

  if (!user) throw new ApiError(400, "User doesn't exits");
  const is_password_correct = await compare_password(user.password, password);
  if (!is_password_correct) throw new ApiError(400, "Invalid User Details");

  const access_token = generate_access_token({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  const userWithoutPassword = await User.findByPk(user.id, {
    attributes: { exclude: ["password"] },
  });

  return res.cookie("access_token", access_token, options).json(
    new ApiResponse(
      200,
      {
        user: userWithoutPassword,
        access_token,
      },
      "Login Successfully"
    )
  );
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  return res
    .clearCookie("access_token")
    .clearCookie("refresh_token")
    .json(new ApiResponse(200, null, "Logout Success"));
});

export const get_me = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findOne({
    where: { id: req.user.id },
    attributes: {
      exclude: ["password", "two_factor_secret"],
    },
  });

  if (!user) throw new ApiError(404, "Not found user");

  return res.json(new ApiResponse(200, user, "Fetching User Success"));
});
