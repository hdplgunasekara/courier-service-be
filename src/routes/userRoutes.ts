import express from "express"
import { getProfile, updateProfile } from "../controllers/userController"
import { protect } from "../middleware/auth"
import { validateUpdateProfile } from "../middleware/validation"

const router = express.Router()

router.use(protect) // All routes are protected

router.get("/profile", getProfile)
router.put("/profile", validateUpdateProfile, updateProfile)

export default router
