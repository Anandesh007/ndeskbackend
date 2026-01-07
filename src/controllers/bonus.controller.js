import { festivalBonusSchema } from '../validations/bonus.validation.js';

export const createBonusController = (bonusService) => {
//store performancebonus for top three
 const performanceBonus = async (req, res) => {
  try{

    await bonusService.applyPerformanceBonus();

    res.json({success:true, message: 'Performance bonus applied'});
  }
  catch(e){
    console.error(e);
    next(e);
    res.status(500).json({success: false, message: e.message});
  }
};

//store festivalbonus for all employees
const festivalBonus = async (req, res) => {
  try{
    const { error, value } = festivalBonusSchema.validate(req.body);
    if(error){
      return res.status(400).json({success: false, message: error.details[0].message});
    }
      await bonusService.applyFestivalBonus(value);
      res.json({success: true, message: 'Festival bonus applied'});
  }
  catch(e){
    console.error(e);
    res.status(500).json({ success: false, message: e.message });
  }
};

  return { performanceBonus, festivalBonus};
};
