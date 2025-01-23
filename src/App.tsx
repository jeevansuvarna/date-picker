import React from 'react';
import WeekdayDateRangePicker from './component/date-picker/index.tsx';

const App: React.FC = () => {
  const handleDateChange = (
    range: [string, string | null],
    weekends: string[]
  ) => {
    console.log('Selected Range:', range);
    console.log('Weekend Dates:', weekends);
  };

  const predefinedRanges = [
    {
      label: 'Last 7 Days',
      days: 7,
    },
    {
      label: 'Last 30 Days',
      days: 30,
    },
  ];

  return (
    <div>
      <h1>Weekday Date Range Picker</h1>
      <WeekdayDateRangePicker predefinedRanges={predefinedRanges} />
    </div>
  );
};

export default App;
