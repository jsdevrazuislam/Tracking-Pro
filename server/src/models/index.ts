import { User } from "@/models/user.models";
import { Parcel } from "@/models/parcel.models";


Parcel.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });
Parcel.belongsTo(User, { foreignKey: 'assignedAgentId', as: 'agent' });


export { User };
export default { User };
