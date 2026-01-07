import prisma from '../prisma/client.js';

export const calculateEmployeeDeductions = async ({
  basicSalary
}) => {

  const rates = await prisma.fixedamount.findMany();

  const result = [];

  for (const rate of rates) {
    const amount = (basicSalary * Number(rate.percentage)) / 100;

    result.push({
      type: rate.type,
      percentage: Number(rate.percentage),
      amount: Number(amount.toFixed(2))
    });
  }

  return result;
};

export const storeEmployeeDeductions = async ({
  employeeId,
  deductions,
  month,
  year
}) => {

  const data = deductions.map(d => ({
    employee_id: employeeId,
    type: d.type,
    amount: d.amount,
    month,
    year
  }));

  await prisma.deduction.createMany({ data });

  const totalDeduction = deductions.reduce(
    (sum, d) => sum + d.amount,
    0
  );

  return totalDeduction;
};