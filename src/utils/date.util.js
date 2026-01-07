export const getCurrentMonthYear = () => {
  const date = new Date();

  return {
    month: date.getMonth() + 1,
    year: date.getFullYear()
  };
};

export const getPreviousMonthYear = () => {
  const date = new Date();
  date.setMonth(date.getMonth() - 1);

  return {
    month: date.getMonth() + 1,
    year: date.getFullYear()
  };
};
