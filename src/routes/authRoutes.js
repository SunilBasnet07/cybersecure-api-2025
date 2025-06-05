import express from "express";
import {  forgotPassword, login, register, resendOTPEmail, resetPassword, verifiedOTPEmail } from "../controllers/authController.js";
import auth from "../middleware/auth.js";

const router = express.Router()


router.post("/login",login);
router.post("/register",register);
router.post("/forgot-password",forgotPassword);
router.put("/reset-password/:id",resetPassword);
router.put("/verify-otp",auth,verifiedOTPEmail);
router.put("/resend-email/update",auth,resendOTPEmail);

export default router