import prisma from '../prisma/client.js';
import axios from 'axios';
import { getPreviousMonthYear,getCurrentMonthYear } from '../utils/date.util.js';

export const applyPerformanceBonus = async () => {
  try{
    let count=0;

    const year=getPreviousMonthYear().year;

    const response = await axios.get('http://localhost:3000/api/top-performers',{ params: { year } });

    const topEmployees = response.data;

    if(!topEmployees){
      throw new Error("No data fetched from performance api");
    }
  
    for (const emp of topEmployees.slice(0, 3)) {

      const bonusCode = `PERFORMANCE_${year}`;

      const exists = await prisma.bonus.findFirst({where: { employee_id: emp.employeeId,bonus_type: 'PERFORMANCE', bonus_code: bonusCode}});//it reduce duplicate bonus

      if (exists){
        count++;
        continue;
      }

      await prisma.bonus.create({
        data: {
          employee_id: emp.employeeId,
          bonus_type: 'PERFORMANCE',
          bonus_code: bonusCode,
          amount: 1000,
          month:12,
          year,
          reason: 'Top performer'
        }
    });
  }
  
  console.log(`Number of bonus skipped is ${count} and total employees in the payroll is ${topEmployees.length}`);

  if(count==3){
    throw new Error("Performance bonus already applied for top 3 employees");
  }
  }
  catch(error){
    console.error("Performance bonus api failed:"+error.message);
    throw(error);
  }
};


export const applyFestivalBonus = async ({
  festivalName,
  month,
  year,
  amount
}) => {
  try{
  let count=0;

  const bonusCode = `${festivalName.toUpperCase()}_${year}`;

  const response = await axios.get(`${process.env.USER_DETAILS_URL}`,{
    headers:{
      Authorization: `Bearer ${process.env.test_token}`
    }});

  const employees= response.data;

  if(!employees || employees.length===0){
    throw new Error("No employees found to apply festival bonus");
  }

  for (const { emp_id } of employees) {
    const exists = await prisma.bonus.findFirst({
      where: {
        employee_id: String(emp_id),
        bonus_type: 'FESTIVAL',
        bonus_code: bonusCode
      }
    });

    if (exists){
      count++;
      continue;
    } 

    await prisma.bonus.create({
      data: {
        employee_id: String(emp_id),
        bonus_type: 'FESTIVAL',
        bonus_code: bonusCode,
        festival_name: festivalName,
        amount,
        month,
        year,
        reason: `${festivalName} bonus`
      }
    });
  }

    console.log(`Number of bonus skipped is ${count} and total employees in the payroll is ${employees.length}`);
    if(count === employees.length){
      throw new Error("Festival bonus already applied for all employees");
    }
    }
    catch(error){
      console.error('Festival Bonus error:'+error.message);
      throw(error);
    }
};
