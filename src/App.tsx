import React from 'react';
import WeekdayDateRangePicker from './component/date-picker/index.tsx';

const App: React.FC = () => {
  const handleDateChange = (range: [string, string | null], weekends: string[]) => {
    console.log('Selected Range:', range);
    console.log('Weekend Dates:', weekends);
  };

  const predefinedRanges = [
    {
      label: 'Last 7 Days',
      range: () => {
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - 7);
        return [start, end];
      },
    },
    {
      label: 'Last 30 Days',
      range: () => {
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - 30);
        return [start, end];
      },
    },
  ];

  return (
    <div>
      <h1>Weekday Date Range Picker</h1>
      <WeekdayDateRangePicker onChange={handleDateChange} predefinedRanges={predefinedRanges} />
    </div>
  );
};

export default App;
