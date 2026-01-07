import express from 'express';
import { createBonusController } from '../controllers/bonus.controller.js';
import * as bonusService from '../services/bonus.service.js';
import {authenticate} from '../middleware/authenticate.middleware.js';
import { allowedRoles } from '../middleware/role.middleware.js';

const router = express.Router();

const { performanceBonus, festivalBonus } = createBonusController(bonusService);

router.post('/performance',performanceBonus);//internally triggered for testing purpose
router.post('/festival',authenticate,allowedRoles(1),festivalBonus);//triggered by admin only

export default router;
