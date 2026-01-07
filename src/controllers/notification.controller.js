
export const notificationController = (services) =>{

  const { allEmployeeMail,sendMonthlySummary} = services;
//send mail to all employees
const sendAllPayslipsController = async (req, res) => {
  try {
    await allEmployeeMail();
    return res.status(200).json({success:true,message:`All mails sent successfully`});
  } catch (error) {
    console.error(error);
    res.status(500).json({ success:false,message: 'Failed to send payslip emails', error });
  }
};

//send monthlysummary to all employees
const sendMonthlySummaryController = async (req, res) => {
  try {
    await sendMonthlySummary();
    res.status(200).json({success:true, message: `Payroll summary has been sent successfully!` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success:false,error: 'An error occurred while sending the payroll summary.' });
  }
};

return { sendAllPayslipsController,sendMonthlySummaryController};
};
