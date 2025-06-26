
import { bookParcel, getCustomerStats, getUserParcels, trackParcel } from '@/controller/parcel.controller';
import { require_role, verify_auth } from '@/middleware/auth.middleware';
import { validateData } from '@/middleware/validation.middleware';
import { UserRole } from '@/models/user.models';
import { create_parcel } from '@/validation_schemas/parcel.schema';
import { Router } from 'express'


const router = Router()
router.post('/', validateData(create_parcel), verify_auth, require_role(UserRole.CUSTOMER), bookParcel);
router.get('/my', verify_auth, require_role(UserRole.CUSTOMER), getUserParcels);
router.get('/stats', verify_auth, require_role(UserRole.CUSTOMER), getCustomerStats);
router.get('/track/:tracking_code', trackParcel);

export const basePath = '/parcel';
export default router