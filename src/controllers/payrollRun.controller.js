import { runMonthlyPayroll, getPayrolls } from '../services/payrollRun.service.js';

//runpayroll for employee
export const runPayroll = async (req, res) => {
  try {

    const result = await runMonthlyPayroll();

    res.status(201).json({
      success: true,
      message: 'Payroll run started',
      data: result
    });

  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const getPayrollsController = async (req, res) => {
  try {
    const { employeeId, month, year } = req.query;

    const payrolls = await getPayrolls({
      employeeId: employeeId ? employeeId : undefined,
      month: month ? Number(month) : undefined,
      year: year ? Number(year) : undefined
    });

    return res.status(200).json({
      success: true,
      count: payrolls.length,
      data: payrolls
    });

  } catch (error) {
    console.error("Payroll fetch error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch payroll data"
    });
  }
};