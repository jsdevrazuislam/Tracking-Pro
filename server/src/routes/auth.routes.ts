
import { get_me, login, register } from '@/controller/auth.controller';
import { verify_auth } from '@/middleware/auth.middleware';
import { validateData } from '@/middleware/validation.middleware';
import { login_schema, register_schema } from '@/validation_schemas/auth.schema';
import { Router } from 'express'


const router = Router()
router.post("/register", validateData(register_schema), register)
router.post("/login", validateData(login_schema), login)
router.get("/me", verify_auth, get_me)

export const basePath = '/auth';
export default router