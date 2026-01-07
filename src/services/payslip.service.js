import prisma from '../prisma/client.js';
import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';
import { fileURLToPath } from 'url';

export const generatePayslip = async ({ payrollId, employeeId }) => {


  const ROOT_DIR = path.resolve(process.cwd());
  const serializeBigInt = (data) => {
  return JSON.parse(
    JSON.stringify(data, (_, value) =>
      typeof value === 'bigint' ? value.toString() : value
    )
  );
};

  const payment = await prisma.payment.findFirst({
    where: { payroll_id: payrollId, employee_id: employeeId, payment_status: "Success"}
  });

  if (!payment) {
    throw new Error('Payment not completed');
  }

  const existing = await prisma.payslip.findFirst({
    where: { payroll_id: payrollId, employee_id: employeeId }
  });

  if (existing) return serializeBigInt(existing);

  const payroll = await prisma.payroll.findFirst({
    where: { payroll_id: payrollId }
  });

  const payslipDir = path.join(ROOT_DIR,'storage','payslips',`${payroll.year}-${payroll.month}`);

  if(!fs.existsSync(payslipDir)){
    fs.mkdirSync(payslipDir,{ recursive:true});
  }

  const filePath = path.join(payslipDir,`emp_${employeeId}_payslip.pdf`);


  const doc = new PDFDocument({ size: 'A4', margin: 50 });

  doc.pipe(fs.createWriteStream(filePath));

  doc
    .image('assets/img/Nexitence-logo.png', 50, 45, { height:50, width:50 })
    .fillColor('#4B0082')
    .fontSize(20)
    .text('Nexitence Technology LLP', 160, 60, { align: 'left' })
    .fontSize(14)
    .text(`Payslip - ${payroll.month} ${payroll.year}`,160,100,{ align: 'right' })
    .moveDown(2);


  const rowHeight = 28;
let y = doc.y;
const col1 = 50;
const colWidth = 240;

drawHeaderCell(doc, col1, y, colWidth, rowHeight, 'Employee Info');
drawHeaderCell(doc, col1 + colWidth, y, colWidth, rowHeight, 'Details');

y += rowHeight;

drawCell(doc, col1, y, colWidth, rowHeight, `Employee ID`);
drawCell(doc, col1 + colWidth, y, colWidth, rowHeight, employeeId);

y += rowHeight;
drawCell(doc, col1, y, colWidth, rowHeight, `Name`);
drawCell(doc, col1 + colWidth, y, colWidth, rowHeight, `${payroll.name}`);

y += rowHeight;
drawCell(doc, col1, y, colWidth, rowHeight, `Pay Period`);
drawCell(doc, col1 + colWidth, y, colWidth, rowHeight, `${payroll.month} ${payroll.year}`);

y += rowHeight;
drawCell(doc, col1, y, colWidth, rowHeight, `Office Working days`);
drawCell(doc, col1 + colWidth, y, colWidth, rowHeight, `28`);

y += rowHeight;
drawCell(doc, col1, y, colWidth, rowHeight, `Worked Days`);
drawCell(doc, col1 + colWidth, y, colWidth, rowHeight, `20`);


  y += 40;

const labelWidth = 300;
const amountWidth = 150;

drawHeaderCell(doc, col1, y, labelWidth, rowHeight, 'Earnings');
drawHeaderCell(doc, col1 + labelWidth, y, amountWidth, rowHeight, 'Amount (in Rupees)');

y += rowHeight;

const earnings = [
  { label: 'Basic Salary', value: payroll.basic_salary },
  { label: 'Allowances', value: payroll.allowances },
  { label: 'Bonus', value: payroll.bonuses },
  { label: 'Deduction', value: payroll.deductions},
  { label: 'Gross salary', value: payroll.gross_salary},
  { label: 'Net Salary', value: payroll.net_salary}
];

earnings.forEach(item => {
  drawCell(doc, col1, y, labelWidth, rowHeight, item.label);
  drawCell(
    doc,
    col1 + labelWidth,
    y,
    amountWidth,
    rowHeight,
    item.value.toFixed(2),
    { align: 'right' }
  );
  y += rowHeight;
});


  doc.moveDown(4)
    .fontSize(10)
    .fillColor('#777')
    .text('This is a computer-generated payslip.', { align: 'center' })
    .text('Thank you for your contribution to Nexitence Technology LLP', { align: 'center' });

  doc.end();

  const expiresAt = new Date();
  expiresAt.setFullYear(expiresAt.getFullYear() + 1);

  const result= await prisma.payslip.create({
    data: {
      payroll_id: payrollId,
      employee_id: employeeId,
      file_path: filePath,
      expires_at: expiresAt
    }
  });

  return{
    ...result,
    payroll_id: result.payroll_id.toString(),
    employeeId: result.employee_id.toString(),
    id: result.id.toString()
  }
};

function drawCell(doc, x, y, width, height, text, options = {}) {
  const padding = options.padding ?? 5;

  doc
    .rect(x, y, width, height)
    .stroke();

  doc
    .font(options.font || 'Helvetica')
    .fontSize(options.fontSize || 11)
    .fillColor(options.color || '#000')
    .text(text, x + padding, y + padding, {
      width: width - padding * 2,
      align: options.align || 'left'
    });
}

function drawHeaderCell(doc, x, y, width, height, text) {
  doc
    .rect(x, y, width, height)
    .fillAndStroke('#E6E0F8', '#000');

  doc
    .fillColor('#4B0082')
    .font('Helvetica-Bold')
    .fontSize(11)
    .text(text, x + 5, y + 7, {
      width: width - 10,
      align: 'center'
    });
}


export const getPayslipForDownload = async ({ payrollId, employeeId }) => {

  const payslip = await prisma.payslip.findFirst({
    where: {
      payroll_id: BigInt(payrollId).toString(),
      employee_id: BigInt(employeeId).toString(),
      expires_at: {
        gt: new Date()
      }
    }
  });

  if (!payslip) {
    throw new Error('Payslip not found or expired');
  }

  return {
    id: payslip.id.toString(),
    payrollId: payslip.payroll_id.toString(),
    employeeId: payslip.employee_id.toString(),
    filePath: payslip.file_path
  };
};
