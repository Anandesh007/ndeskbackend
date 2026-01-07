import {createFixedAmount,getAllFixedAmounts,getByType,updateFixedAmount,deleteFixedAmount, setSalaryAmountForEmployee} from '../services/fixedamount.service.js';


class FixedAmountController {

  //create a tax/PF/ESI
  static async create(req, res) {
    try {
      const { type, percentage } = req.body;

      if (!type || percentage == null) {
        return res.status(400).json({
          success: false,
          message: 'Type and percentage are required'
        });
      }

      const result = await createFixedAmount({
        type,
        percentage
      });

      res.status(201).json({
        success: true,
        data: result
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  //get all the value stored
  static async getAll(req, res) {
    try {
      const result = await getAllFixedAmounts();

      res.json({
        success: true,
        data: result
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  //show the specific type
  static async getByType(req, res) {
    try {
      const { type } = req.params;

      const result = await getByType(type);

      if (!result) {
        return res.status(404).json({
          success: false,
          message: 'Fixed amount not found'
        });
      }

      res.json({
        success: true,
        data: result
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
  //update the tax/PF/ESI
  static async update(req, res) {
    try {
      const { type } = req.params;
      const { percentage } = req.body;

      const result = await updateFixedAmount(type, percentage);

      res.json({
        success: true,
        data: result
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  //Removes the specific type
  static async remove(req, res) {
    try {
      const { type } = req.params;

      await deleteFixedAmount(type);

      res.json({
        success: true,
        message: 'Deleted successfully'
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async setSalaryAmount(req, res){
  try {
    const { employee_id, basic_salary, allowances } = req.body;

      if (!employee_id || !basic_salary) {
        return res.status(400).json({
          success: false,
          message: 'employee_id and basic_salary are required'
        });
      }

      const salary = await setSalaryAmountForEmployee(
        employee_id,
        Number(basic_salary),
        Number(allowances)
      );

      res.status(201).json({
        success: true,
        message: 'Salary amount set successfully',
        data: salary
      });

    }   catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  };
}

export default FixedAmountController;
