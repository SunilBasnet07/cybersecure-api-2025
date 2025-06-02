import express from 'express';
import { getCaptchaGenerate, getStringCaptchaGenerate } from '../controllers/captchaController.js';

const router = express.Router();


router.get('/number',getCaptchaGenerate);
router.get('/string',getStringCaptchaGenerate);


export default router;