import express from 'express';
import passport from 'passport';

import authMiddleware from '../middleware/auth'; 
import { login, register, profile, logout } from '../controllers/auth';
import { send, incoming, outcoming } from '../controllers/email';

const router = express.Router();

router.post('/auth/register', register);
router.post('/auth/login', passport.authenticate('local'), login)
router.get('/auth/profile', authMiddleware(), profile);
router.get('/auth/logout', authMiddleware(), logout);

router.get('/email/incoming', authMiddleware(), incoming);
router.get('/email/outcoming', authMiddleware(), outcoming);
router.post('/email/send', authMiddleware(), send);

export default router;