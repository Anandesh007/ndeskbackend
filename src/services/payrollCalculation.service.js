import prisma from '../prisma/client.js';
import axios from 'axios';
import { getPreviousMonthYear } from '../utils/date.util.js';
import {calculateEmployeeDeductions,storeEmployeeDeductions} from './deduction.service.js';

const { month, year}= getPreviousMonthYear();

export const calculatePayrollForEmployee = async ({ employee }) => {

  const existingPayroll = await prisma.payroll.findFirst({
    where: {
      employee_id: employee.emp_id,
      month,
      year
    }
  });

  if (existingPayroll) {
    return { skipped: true, reason: 'Payroll already exists' };
  }

  const salary = await prisma.salaryamount.findFirst({
      where: { employee_id: employee.emp_id }
    });

  const officeDaysResponse = await axios.get(`${process.env.OFFICEDAY_URL}`, {headers:{Authorization: `Bearer ${process.env.test_token}`},
      params: { month, year }
    });

  const workedDaysResponse = await axios.get(`${process.env.WORKDAY_URL}`, {
      params: { employeeId: employee.emp_id, month, year }
    });

  const deduction = await prisma.deduction.aggregate({
      where: { employee_id: employee.emp_id, month, year },
      _sum: { amount: true }
    });

  const bonuses = await prisma.bonus.aggregate({
      where: { employee_id: employee.emp_id, month, year },
      _sum: { amount: true }
    });

  if (!salary) {
    throw new Error(`Salary not defined for employee ${employee.emp_id}`);
  }
  

  const officeDays = Number(officeDaysResponse.data?.actualWorkingDays);
  console.log(officeDays);
  const workedDays = Number(workedDaysResponse.data?.total_worked_days);
  console.log(workedDays);
  const basicSalary = Number(salary.basic_salary);
  const allowances = Number(salary.allowances);
  const bonusAmount = bonuses?._sum.amount || 0;
  const deductionAmount = deduction?._sum.amount|| 0;

  const oneDaySalary = basicSalary / officeDays;
  console.log(oneDaySalary);
  const earnedBasicSalary = oneDaySalary * workedDays;
  console.log(workedDays);
  console.log(earnedBasicSalary);

  const grossSalary = earnedBasicSalary + allowances +  Number(bonusAmount);

  const netSalary = grossSalary - Number(deductionAmount);

  const payroll = await prisma.payroll.create({
    data: {
      employee_id: employee.emp_id,
      name: `${employee.first_name} ${employee.last_name}`,
      month,
      year,
      office_days: Number(officeDays),
      worked_days: Number(workedDays),
      one_day_salary: oneDaySalary,
      basic_salary: basicSalary,
      allowances,
      bonuses: bonusAmount,
      deductions: deductionAmount,
      gross_salary: grossSalary,
      net_salary: netSalary
    }
  });

  return payroll;
};

export const calculateDeductionForEmployee = async () => {
  let count=0;

  const employees= await prisma.salaryamount.findMany({select:{employee_id:true,basic_salary:true}});

  for(const emp of employees){
  try{
     const exists = await prisma.deduction.findFirst({
        where: {
          employee_id: emp.employee_id,
          month,
          year
        }
      });

      if(exists){ 
        count++;
        console.log(`deduction already applied for ${emp.employee_id}`);
        continue;
        }
  const deductions = await calculateEmployeeDeductions({
    employeeId: emp.employee_id,
    basicSalary: emp.basic_salary
  });

  await storeEmployeeDeductions({
    employeeId: emp.employee_id,
    deductions,
    month,
    year
  });

  console.log(`Deduction applied for employee ${emp.employee_id}`);
  }
  catch(err){
    console.error(`Deduction failed for employee ${emp.employee_id}:`,err.message);
  }
}
   if(count==employees.length){
    throw new Error("Deduction already applied for all employees");
  }
}