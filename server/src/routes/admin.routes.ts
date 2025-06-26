
import { assignAgentToParcel, deleteUser, exportBookings, getAdminStats, getAllAgents, getAllBookings, getAllUsers, getUnassignedParcels, toggleUserStatus } from '@/controller/admin.controller';
import { require_role, verify_auth } from '@/middleware/auth.middleware';
import { validateData } from '@/middleware/validation.middleware';
import { UserRole } from '@/models/user.models';
import { assign_parcel_schema } from '@/validation_schemas/admin.schema';
import { Router } from 'express'


const router = Router()

router.get('/stats', verify_auth, require_role(UserRole.ADMIN), getAdminStats)
router.post('/assign-parcel', validateData(assign_parcel_schema), verify_auth, require_role(UserRole.ADMIN), assignAgentToParcel)
router.get('/export', verify_auth, require_role(UserRole.ADMIN), exportBookings)
router.get('/unassigned-parcels', verify_auth, require_role(UserRole.ADMIN), getUnassignedParcels)
router.get('/agents', verify_auth, require_role(UserRole.ADMIN), getAllAgents)
router.get('/users', verify_auth, require_role(UserRole.ADMIN), getAllUsers)
router.patch('/user/:userId/toggle-status', verify_auth, require_role(UserRole.ADMIN), toggleUserStatus);
router.delete('/user/:userId', verify_auth, require_role(UserRole.ADMIN), deleteUser);
router.get('/bookings', verify_auth, require_role(UserRole.ADMIN), getAllBookings);


export const basePath = '/admin';
export default router