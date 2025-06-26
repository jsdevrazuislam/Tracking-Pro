import { DataTypes, Model } from "sequelize";
import sequelize from "@/config/db";

export enum UserRole {
  ADMIN = "admin",
  CUSTOMER = "customer",
  AGENT = "agent",
}

export class User extends Model {
  public id!: string;
  public full_name!: string;
  public email!: string;
  public password!: string;
  public role!: UserRole;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    full_name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    role: {
      type: DataTypes.ENUM(...Object.values(UserRole)),
      allowNull: false,
    },
  },
  { sequelize, modelName: "User", tableName: "users", timestamps: true }
);
