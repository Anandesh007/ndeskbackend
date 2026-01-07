import { processPayment } from '../services/payment.service.js';
import { paymentSchema } from '../validations/payment.validation.js';

//manualpay done by a admin for all employee
export const manualPay = async (req, res) => {
  try {

    const { error, value } = paymentSchema.validate(req.body);
    if(error){
        return res.status(400).json({success: false, message: error.details[0].message});
    }

    const { month, year , employeeId } = value;

    const payment = await processPayment({
      month,
      year,
      employeeId,
      mode: 'MANUAL'
    });

    res.json({
      success: true,
      message: 'Payment successful',
      data: payment
    });

  } catch (e) {
    res.status(400).json({
      success: false,
      message: e.message
    });
  }
};
