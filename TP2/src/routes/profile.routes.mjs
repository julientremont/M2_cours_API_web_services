import express from 'express';
import { getFullProfile, getRandomUser, getBatchProfiles } from '../controllers/profile.controller.mjs';

const router = express.Router();

router.get('/full', getFullProfile);

router.get('/user', getRandomUser);

router.get('/batch/:count', getBatchProfiles);

export default router;