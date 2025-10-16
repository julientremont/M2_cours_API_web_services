// src/routes/darkdata.routes.mjs
import express from 'express';
import {
  getGlobalStats,
  getRiskScore,
  getDemographicAnalysis,
  getPredictiveScore
} from '../controllers/darkdata.controller.mjs';

const router = express.Router();

router.get('/stats', getGlobalStats);

router.get('/risk-score', getRiskScore);

router.get('/demographics', getDemographicAnalysis);

router.get('/predictive', getPredictiveScore);

export default router;