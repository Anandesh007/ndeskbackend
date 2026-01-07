import express from 'express';
import { calculateDeductionController } from '../controllers/deduction.controller.js';

const router = express.Router();

router.post('/calculate', calculateDeductionController);//internally triggered for testing purpose

export default router;
