import { DataTypes, Model } from 'sequelize';
import sequelize from '@/config/db';

export class ParcelTimeline extends Model {
    public id!:string
    public parcelId!:string
    public status!:string
    public location!:string
    public timestamp!:Date
    public description!:string
}

ParcelTimeline.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    parcelId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    description: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: 'ParcelTimeline',
    tableName: 'parcel_timelines',
    timestamps: true,
  }
);
