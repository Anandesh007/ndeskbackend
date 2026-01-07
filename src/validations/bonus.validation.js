import Joi from 'joi';

export const performanceBonusSchema = Joi.object({
  year: Joi.number().integer().min(5).required()
});

export const festivalBonusSchema = Joi.object({
  festivalName: Joi.string().min(2).max(50).required(),
  month:Joi.number().min(1).max(12).required(),
  year: Joi.number().positive().required(),
  amount: Joi.number().precision(2).positive().required()
});

