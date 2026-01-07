import prisma from '../prisma/client.js'
import {sendMail} from '../utils/mail.util.js';
import { getPreviousMonthYear } from '../utils/date.util.js';

export const sendMonthlySummary = async () => {

  try{
  const {month,year}=getPreviousMonthYear();
  const payrolls = await prisma.payroll.findMany({
    where: { month, year },
    select: {
      employee_id: true,
      name: true,
      basic_salary: true,
      allowances: true,
      bonuses: true,
      deductions: true,
      net_salary: true
    }
  });

  if (payrolls.length === 0) {
    throw new Error(`No payroll found for this ${month} ${year}`);
  }

  const totalEmployees = payrolls.length;
  const totalAmount = payrolls.reduce((sum, p) => sum + Number(p.net_salary), 0);

  const tableRows = payrolls.map(p => `
    <tr>
      <td>${p.employee_id}</td>
      <td>${p.name}</td>
      <td>₹${p.basic_salary}</td>
      <td>₹${p.allowances}</td>
      <td>₹${p.bonuses}</td>
      <td>₹${p.deductions}</td>
      <td>₹${p.net_salary}</td>
    </tr>
  `).join('');

  const html = `
    <h2>Payroll Summary - ${month} ${year}</h2>
    <p>Total Employees Paid: ${totalEmployees}</p>
    <p>Total Amount Paid: ₹${totalAmount}</p>
    <table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse;">
      <thead>
        <tr>
          <th>Employee ID</th>
          <th>Name</th>
          <th>Basic</th>
          <th>Allowances</th>
          <th>Bonus</th>
          <th>Deductions</th>
          <th>Net Pay</th>
        </tr>
      </thead>
      <tbody>
        ${tableRows}
      </tbody>
    </table>
  `;

  await sendMail({
    to: process.env.ADMIN_MAIL,
    subject: `Payroll Summary - ${month} ${year}`,
    html
  });

  await prisma.notification_log.create({
    data: {
      type: 'ADMIN_SUMMARY',
      message: `Payroll summary sent for ${month} ${year}`
    }
  });

  console.log(`Payroll summary email sent for ${month} ${year}`);
  }
  catch(error){
    console.error("Sending mail error:"+error.message);
    throw(error);
  }
};
