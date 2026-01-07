import { calculateDeductionForEmployee } from '../services/payrollCalculation.service.js';

export const calculateDeductionController = async (req, res) => {
  try {
    await calculateDeductionForEmployee();

    return res.status(200).json({
      success: true,
      message: 'Employee deductions calculated successfully'
    });

  } catch (error) {
    console.error('Deduction calculation error:', error.message);

    return res.status(500).json({
      success: false,
      message: 'Failed to calculate employee deductions'
    });
  }
};
