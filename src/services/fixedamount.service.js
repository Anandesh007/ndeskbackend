import prisma from '../prisma/client.js';


  export const createFixedAmount = async(data) => {
    try{
    const type=data.type.toUpperCase();
    const existing= await prisma.fixedamount.findFirst({where:{type}});
    if(existing){
      throw new Error("This type already exist");
    }
    const fixedamount=await prisma.fixedamount.create({
      data: {
        type: data.type.toUpperCase(),
        percentage: data.percentage
      }
    });
    return fixedamount;
    }
    catch(error){
      console.error("Error in createFixedamount:", error);
      throw error;
    }
  }

  export const getAllFixedAmounts = async() => {
    return prisma.fixedamount.findMany({
      orderBy: { type: 'asc' }
    });
  }

  export const getByType = async(type) => {
    return prisma.fixedamount.findFirst({
      where: { type: type.toUpperCase() }
    });
  }

  export const updateFixedAmount = async(type, percentage) => {
    return prisma.fixedamount.update({
      where: { type: type.toUpperCase() },
      data: { percentage }
    });
  }

  export const deleteFixedAmount = async(type) => {
    return prisma.fixedamount.delete({
      where: { type: type.toUpperCase() }
    });
  }

  //insert a basic salary and allowance for an employee
  export const setSalaryAmountForEmployee = async(employee_id, basic_salary, allowances) => {
    const existing= await prisma.salaryamount.findFirst({where:{employee_id}});
    if(existing){
      throw new Error("Salary amount already set for this employee");
    }
    return prisma.salaryamount.create({
      data: {
        employee_id,
        basic_salary,
        allowances
      }
    });
  }
