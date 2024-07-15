
  const getRandomValue = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

  const generateDateRange = (startDate: string, endDate: string) => {
      const dates = [];
      let currentDate = new Date(startDate);
      const end = new Date(endDate);
  
      while (currentDate <= end) {
          dates.push(currentDate.toISOString().split('T')[0]);
          currentDate.setDate(currentDate.getDate() + 1);
      }
  
      return dates;
  };
  
  const startDate = '2024-01-01';
  const endDate = new Date().toISOString().split('T')[0];
  
  const dateRange = generateDateRange(startDate, endDate);
  
  export const priceData = dateRange.map(date => ({
      time: date,
      value: getRandomValue(89, 105)
  }));

export const apyData = dateRange.map(date => ({
  time: date,
  value: getRandomValue(12, 25)
}));
  