import { Model, DataTypes } from "sequelize";
import sequelize from "@/config/db";

export class Parcel extends Model {
    public id!:string
    public senderId!:string
    public receiver_address!:string
    public pickup_address!:string
    public parcel_size!:string
    public parcel_type!:string
    public payment_type!:string
    public status!:string
    public assignedAgentId!:string
    public tracking_code!:string
    public current_location!:string
    public amount!:string
 }

Parcel.init({
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    senderId: { type: DataTypes.UUID, allowNull: false },
    receiver_address: { type: DataTypes.STRING, allowNull: false },
    pickup_address: { type: DataTypes.STRING, allowNull: false },
    parcel_size: { type: DataTypes.STRING },
    amount: { type: DataTypes.STRING },
    parcel_type: { type: DataTypes.STRING },
    payment_type: { type: DataTypes.ENUM('cod', 'prepaid'), allowNull: false },
    status: {
        type: DataTypes.ENUM('pending', 'assigned', 'picked', 'in_transit', 'delivered', 'cancelled'),
        defaultValue: 'pending'
    },
    assignedAgentId: { type: DataTypes.UUID, allowNull: true },
    tracking_code: { type: DataTypes.STRING, unique: true },
    current_location: { type: DataTypes.STRING },
}, { sequelize, modelName: 'Parcel', tableName:'parcels', timestamps: true, });
