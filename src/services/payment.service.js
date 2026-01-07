import prisma from '../prisma/client.js';
import { v4 as uuid } from 'uuid';

export const processPayment = async ({
  month,
  year,
  employeeId,
  mode
}) => {

  const payroll = await prisma.payroll.findFirst({
    where: { month,year,employee_id:employeeId }
  });

  if (!payroll) {
    throw new Error('Payroll not found');
  }

  const existingPayment = await prisma.payment.findFirst({
    where: {
      employee_id: employeeId,
      payment_status:"SUCCESS"
    }
  });

  if (existingPayment) {
    throw new Error('Payment already completed');
  }

  const transactionRef = `TXN-${uuid()}`;

  const payment = await prisma.payment.create({
    data: {
      payroll_id: payroll.payroll_id,
      employee_id: employeeId,
      amount: payroll.net_salary,
      payment_mode: mode,
      payment_status: 'SUCCESS',
      transaction_ref: transactionRef
    }
  });

  await prisma.payroll.update({where:{payroll_id:payroll.payroll_id},data:{ status:'PAID'}});

  const result={
  paymentId: payment.payment_id.toString(),
  payrollId: payment.payroll_id.toString(),
  employeeId: payment.employee_id.toString(),
  amount: payment.amount,
  paymentMode: payment.payment_mode,
  paymentStatus: payment.payment_status,
  transactionRef: payment.transaction_ref,
  paidAt: payment.paid_at
  }

  return result;
};
