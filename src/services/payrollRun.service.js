import prisma from '../prisma/client.js';
import { calculatePayrollForEmployee } from './payrollCalculation.service.js';
import { getPreviousMonthYear } from '../utils/date.util.js';
import  { v4 as uuid } from 'uuid';
import axios from 'axios';

export const runMonthlyPayroll = async () => {

const { month, year} = getPreviousMonthYear();

  const existing = await prisma.payroll_run.findFirst({
    where: { month, year }
  });

  if (existing) {
    throw new Error('Payroll already executed for this month');
  }

  const payrollRun = await prisma.payroll_run.create({
    data: {
      id: uuid(),
      month,
      year,
      triggered_by: 'AUTO',
      status: 'PROCESSING'
    }
  });
  try{
  const response= await axios.get(`${process.env.BASIC_USER_DETAILS_URL}`, {
    headers:{
      Authorization: `Bearer ${process.env.test_token}`
    }
  })

  const employees = response.data;

  console.log('Employees for payroll:', employees);

  await prisma.payroll_log.createMany({
    data: employees.map(emp => ({
      payroll_run_id: payrollRun.id,
      employee_id: emp.emp_id,
      action: 'PAYROLL_QUEUED',
      message: 'Employee added to payroll run'
    }))
  });

    for (const emp of employees) {
    try {
      const result = await calculatePayrollForEmployee({
        employee: emp
      });
      await prisma.payroll_log.create({
        data: {
          payroll_run_id: payrollRun.id,
          employee_id: emp.emp_id,
          action: 'PAYROLL_CALCULATED',
          message: result.skipped ? 'Skipped (duplicate)' : 'Payroll created'
        }
      });

    } catch (error) {
      await prisma.payroll_log.create({
        data: {
          payroll_run_id: payrollRun.id,
          employee_id: emp.emp_id,
          action: 'PAYROLL_FAILED',
          message: error.message
        }
      });
      console.log("Run payroll error:"+error);
    }
  }

  await prisma.payroll_run.update({
    where: { id: payrollRun.id },
    data: {
      status: 'COMPLETED',
      completed_at: new Date()
    }
  });


  return {
    payrollRunId: payrollRun.id,
    totalEmployees: employees.length
  };

   }
  catch(error){
    throw new Error('BASIC_USER_DETAILS_URL axios error');
  }
};
export const getPayrolls = async ({ employeeId, month, year }) => {
  
  const where = {};

  if (employeeId) where.employee_id = employeeId;
  if (month) where.month = month;
  if (year) where.year = year;

  const payrolls = await prisma.payroll.findMany({
    where,
    orderBy: { created_at: 'desc' }
  });

  return payrolls.map(p => ({
    ...p,
    payroll_id: p.payroll_id.toString(),
    employee_id: p.employee_id.toString(),
    basic_salary: Number(p.basic_salary),
    net_salary: Number(p.net_salary)
  }));
};
