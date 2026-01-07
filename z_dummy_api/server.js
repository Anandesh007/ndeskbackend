import express from 'express';
import axios from 'axios';

const app = express();
const PORT = 3000;

const topPerformersByYear = {
  2025: [
    { employeeId: "NEX101", score: 98 },
    { employeeId: "NEX102", score: 96 },
    { employeeId: "NEX103", score: 95 },
    { employeeId: "NEX104", score: 93 }
  ],
  2024: [
    { employeeId: "NEX201", score: 97 },
    { employeeId: "NEX202", score: 94 },
    { employeeId: "NEX203", score: 92 }
  ]
};


app.get('/api/top-performers', (req, res) => {
  const { year } = req.query;

  if (!year) {
    return res.status(400).json({ message: 'year query param is required' });
  }

  const data = topPerformersByYear[year];

  if (!data || data.length === 0) {
    return res.status(200).json([]);
  }

  const sorted = data.sort((a, b) => (b.score || 0) - (a.score || 0));

  res.status(200).json(sorted);
});

app.get('/api/office-days', (req, res) => {
  const { month, year } = req.query;

  if (!month || !year) {
    return res.status(400).json({ message: 'month and year required' });
  }

  const officeDaysMap = {
    1: 22,
    2: 20,
    3: 23,
    4: 22,
    5: 22,
    6: 21,
    7: 23,
    8: 22,
    9: 21,
    10: 23,
    11: 22,
    12: 21
  };

  const officeDays = officeDaysMap[month] || 22;

  res.json({
    month,
    year,
    officeDays
  });
});

app.get('/api/worked-days', async (req, res) => {
  const { employeeId, month, year } = req.query;

  if (!employeeId || !month || !year) {
    return res.status(400).json({
      message: 'employeeId, month, year required'
    });
  }
  
  // Get office days from calendar service
  const calendarResponse = await axios.get('http://localhost:3000/api/office-days',{ params: { month, year } });

  const officeDays = calendarResponse.data.officeDays;

  const leaveDays = 2;

  const workedDays = Math.max(officeDays - leaveDays, 0);

  res.json({
    employeeId,
    month,
    year,
    officeDays,
    leaveDays,
    workedDays
  });
});


app.listen(PORT, () => {
  console.log(`Dummy performance service running on port ${PORT}`);
});
