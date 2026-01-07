import express from 'express';
import FixedAmountController from '../controllers/fixedamount.controller.js';
import { authenticate } from '../middleware/authenticate.middleware.js';
import { allowedRoles } from '../middleware/role.middleware.js';

const router = express.Router();

router.post('/create',authenticate,allowedRoles(1),FixedAmountController.create);//accessed by admin
router.get('/getall',authenticate,allowedRoles(1,2,3,4,5),FixedAmountController.getAll);//accessed by all
router.get('/:type',authenticate,allowedRoles(1,2,3,4,5),FixedAmountController.getByType);//accessed by type
router.put('/update/:type',authenticate,allowedRoles(1),FixedAmountController.update);//admin only
router.delete('/delete/:type',authenticate,allowedRoles(1),FixedAmountController.remove);//admin only
router.post('/set-salary',authenticate,allowedRoles(1),FixedAmountController.setSalaryAmount);//admin only

export default router;
