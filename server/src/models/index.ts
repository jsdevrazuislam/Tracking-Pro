import { User } from "@/models/user.models";
import { Parcel } from "@/models/parcel.models";
import { ParcelTimeline } from "@/models/parcel-timeline.models";


Parcel.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });
Parcel.belongsTo(User, { foreignKey: 'assignedAgentId', as: 'agent' });
Parcel.hasMany(ParcelTimeline, { foreignKey: 'parcelId', as: 'timeline' });
ParcelTimeline.belongsTo(Parcel, { foreignKey: 'parcelId' });



export { User };
export default { User };
