
import { bookParcel, deleteParcel, generateShippingLabel, getAgentAssignedParcels, getAgentStats, getBookingAnalytics, getCustomerStats, getUserParcels, trackParcel, updateParcel, updateParcelStatus } from '@/controller/parcel.controller';
import { require_role, verify_auth } from '@/middleware/auth.middleware';
import { validateData } from '@/middleware/validation.middleware';
import { UserRole } from '@/models/user.models';
import { create_parcel } from '@/validation_schemas/parcel.schema';
import { Router } from 'express'


const router = Router()
router.post('/', validateData(create_parcel), verify_auth, require_role(UserRole.CUSTOMER), bookParcel);
router.get('/my', verify_auth, require_role(UserRole.CUSTOMER), getUserParcels);
router.patch('/edit/:id', verify_auth, require_role(UserRole.CUSTOMER), updateParcel);
router.delete('/delete/:id', verify_auth, require_role(UserRole.CUSTOMER), deleteParcel);
router.get('/stats', verify_auth, require_role(UserRole.CUSTOMER), getCustomerStats);
router.get('/track/:tracking_code', verify_auth, require_role(UserRole.CUSTOMER), trackParcel);
router.get('/agent-stats', verify_auth, require_role(UserRole.AGENT), getAgentStats);
router.get('/agent-assign-parcels', verify_auth, require_role(UserRole.AGENT), getAgentAssignedParcels);
router.post('/update-status/:parcelId', verify_auth, require_role(UserRole.AGENT), updateParcelStatus);
router.get('/generate-barcode/:parcelId', verify_auth, require_role(UserRole.ADMIN), generateShippingLabel);
router.get('/booking-analytics', verify_auth, require_role(UserRole.ADMIN), getBookingAnalytics);

export const basePath = '/parcel';
export default router