import express from "express";
import { askToAssistance, createUser, getAllUsers,  getUserById, updateUser } from "../controllers/userController.js";
import auth from "../middleware/auth.js";



const router= express.Router();

router.post("/",createUser);
router.get("/",auth,getAllUsers);

router.get("/:id",getUserById);
router.put("/:id",updateUser);
router.post("/assistance", auth,askToAssistance);

export default router