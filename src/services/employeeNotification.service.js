import prisma from '../prisma/client.js';
import {sendMail} from '../utils/mail.util.js';
import { getPreviousMonthYear } from '../utils/date.util.js';


const {month,year}=getPreviousMonthYear();

export const allEmployeeMail = async () => {
  try {

    const payrolls = await prisma.payroll.findMany({
      where: {
        month,
        year
      }
    });
   console.log('Payrolls found:', payrolls.length);
    for (const payroll of payrolls) {
      console.log(payroll.payroll_id);
      const payslip = await prisma.payslip.findFirst({
        where: { payroll_id:payroll.payroll_id }
      });

      if(!payslip){
        console.log(`Mail does not sent to employee ${payroll.employee_id}`);
        continue;
      }
        await sendPayslipMail({
          employeeId: payslip.employee_id,
          payrollId: payroll.payroll_id
        });
    }
    console.log("All employee payslip mails sent successfully.");
  } catch (error) {
    console.error("Error sending payslip mails:", error);
  }

};

export const sendPayslipMail = async ({
  employeeId,
  payrollId
}) => {
  try{
  const payroll = await prisma.payroll.findFirst({
    where: { payroll_id: payrollId }
  });

  const response = await axios.get(`${process.env.ONE_USER_DETAILS_URL}`, {
    headers: {
      Authorization: `Bearer ${process.env.test_token}`
    },
    params: {
      emp_id: employeeId
    }
  });

  if(!response || !response.data){
    console.log(`Mail not sent to ${employeeId}`);
    return;
  }
  
  const user = response.data;
  const payslip = await prisma.payslip.findFirst({
    where: { payroll_id: payrollId, employee_id: employeeId }
  });

  if (!payslip){
    console.log(`Mail not sent to ${employeeId}`);
    return;
  }

  const mailBody = `
    <h3>Payslip - ${payroll.month} ${payroll.year}</h3>
    <p>Hello ${user.first_name},</p>
    <p>Your salary has been credited.</p>
    <p><b>Net Salary:</b> ₹${payroll.net_salary}</p>
    <p>
      <a href="http:localhost:${process.env.PORT}/api/payslip/download/${payrollId}">
        Download Payslip
      </a>
    </p>
  `;

  const result = await sendMail({
    to: user.email,
    subject: `Payslip - ${payroll.month} ${payroll.year}`,
    html: mailBody
  });

  await prisma.notification_log.create({
    data: {
      type: 'EMPLOYEE_PAYSLIP',
      reference_id: payrollId,
      recipient: user.email,
      message: 'Payslip mail sent'
    }
  });
}
catch(error){
  console.error("Error sending payslip mails:", error);
}
};
