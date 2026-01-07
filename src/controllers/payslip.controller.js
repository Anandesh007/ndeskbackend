import {generatePayslip , getPayslipForDownload} from '../services/payslip.service.js';
import path from 'path';
import fs from 'fs';

export const generate = async (req, res) => {
  try {
    const { month ,year , employeeId } = req.body;
    const payslip = await generatePayslip({
      payrollId,
      month,
      year
    });
    res.json({ success: true, data: payslip });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
};

export const downloadPayslip = async (req, res) => {
  try {
    const { payrollId, employeeId } = req.body;

    if (!payrollId || !employeeId) {
      return res.status(400).json({
        success: false,
        message: 'payrollId and employeeId are required'
      });
    }

    const payslip = await getPayslipForDownload({
      payrollId,
      employeeId
    });

    const absolutePath = path.resolve(payslip.filePath);

    if (!fs.existsSync(absolutePath)) {
      return res.status(404).json({
        success: false,
        message: 'Payslip file missing on server'
      });
    }

    res.download(absolutePath);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};
