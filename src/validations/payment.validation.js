import Joi from 'joi';

export const paymentSchema = Joi.object({
    month:Joi.number().min(1).max(12).required(),
    year:Joi.number().min(2000).max(2100).required(),
    employeeId:Joi.string().required()
});