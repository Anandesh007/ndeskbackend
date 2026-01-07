import Joi from 'joi';

export const monthlySummarySchema = Joi.object({
  month: Joi.number().min(1).max().required(),
  year: Joi.number().integer().min(2000).max(2100).required()
});

export const payslipMailSchema = Joi.object({
  employeeId: Joi.number().integer().required(),
  payrollId: Joi.number().integer().required()
});

