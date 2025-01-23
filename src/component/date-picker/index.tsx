import React, { useState } from 'react';
import styles from './date-picker.module.css';

type DateRange = {
  startDate: Date | null;
  endDate: Date | null;
};

type PropsType = {
  onDateChange: (range: [string, string | null], weekends: string[]) => void;
  predefinedRanges?: { label: string; range: () => [Date, Date] }[];
}

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const isWeekend = (date: Date) => [0, 6].includes(date.getDay());

const DateRangePicker: React.FC<PropsType> = ({ onDateChange, predefinedRanges }) => {

  const [leftCalenderMonth, setLeftCalenderMonth] = useState(new Date());
  const [rightCalenderMonth, setRightCalenderMonth] = useState(new Date(new Date().setMonth(new Date().getMonth() + 1)));
  const [selectedRange, setSelectedRange] = useState<DateRange>({ startDate: null, endDate: null });
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);


  const renderCalendar = (currentMonth: Date, setMonth: (date: Date) => void, otherCalMonth: Date, setOtherCalMonth: (date: Date) => void) => {
    const days: any = [];
    const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1); // 1st
    const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0); // 31th
    const startingDate = firstDay.getDay();
    const totalDays = lastDay.getDate();

    const changeMonth = (type = "inc") => {
      if (type == "inc") {
        const month = new Date(currentMonth.setMonth(currentMonth.getMonth() + 1));
        setMonth(month);
        if (month.getMonth() === otherCalMonth.getMonth() && month.getFullYear() == otherCalMonth.getFullYear()) {
          setOtherCalMonth(new Date(otherCalMonth.setMonth(otherCalMonth.getMonth() + 1)));
        }
      } else {
        const month = new Date(currentMonth.setMonth(currentMonth.getMonth() - 1))
        setMonth(month)
        if (month.getMonth() === otherCalMonth.getMonth() && month.getFullYear() === otherCalMonth.getFullYear()) {
          setOtherCalMonth(new Date(otherCalMonth.setMonth(otherCalMonth.getMonth() - 1)));
        }
      }
    }
    const handleDateClick = (e: any, date: any) => {
      e.preventDefault();
      e.stopPropagation();
      console.log(date)
      if (isWeekend(date)) return;
      if (!selectedRange.startDate || (selectedRange.startDate && selectedRange.endDate)) {
        setSelectedRange({ startDate: date, endDate: null })
      } else {
        const endDate = date >= selectedRange.startDate ? date : selectedRange.startDate;
        const startDate = date < selectedRange.startDate ? date : selectedRange.startDate;
        // const weekends: string[] = [];
        // for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        //   if (isWeekend(new Date(d))) weekends.push(formatDate(new Date(d)));
        // }

        setSelectedRange({ startDate, endDate });
        console.log(startDate, endDate)
      }
    }
    //make empty spaces 
    for (let i = 0; i < startingDate; i++) {
      days.push(<div key={`empty-${i}`} className={styles.emptyDay}></div>);
    }
    const checkRange = (date: Date) => {
      if (selectedRange.startDate && !selectedRange.endDate && date.getTime() === selectedRange.startDate.getTime()) {
        return true;
      }
      if (
        selectedRange.startDate &&
        selectedRange.endDate &&
        date >= selectedRange.startDate &&
        date <= selectedRange.endDate &&
        !isWeekend(date)
      ) {
        return true;
      }
      return false;
    };
    const handleMouseEnter = (date: Date) => {
      if (selectedRange.startDate && !selectedRange.endDate) {
        setHoveredDate(date);
      }
    };

    const handleMouseLeave = () => {
      setHoveredDate(null);
    };

    const isHoveredRange = (date: Date) => {
      if (selectedRange.startDate && !selectedRange.endDate && hoveredDate) {
        return date >= selectedRange.startDate && date <= hoveredDate && !isWeekend(date);
      }
      return false;
    };

    for (let day = new Date(firstDay); day <= lastDay; day.setDate(day.getDate() + 1)) {
      const dayCopy = new Date(day); // Create a new copy of the date for each iteration
      days.push(
        <button
          id={dayCopy.toDateString()}
          className={`${styles.day} 
            ${checkRange(dayCopy) ? styles.selected : ''} 
            ${isHoveredRange(dayCopy) ? styles.hoveredRange : ''}`}
          onClick={(e) => handleDateClick(e, dayCopy)}
          onMouseEnter={() => handleMouseEnter(dayCopy)}
          onMouseLeave={handleMouseLeave}
          disabled={isWeekend(dayCopy)}
        >
          {dayCopy.getDate()}
        </button>
      );
    }

    return (
      <div className={styles.calendar}>
        <div className={styles.header}>
          <button onClick={() => changeMonth('dec')}>&lt;</button>
          <span>
            {currentMonth.toLocaleString('default', { month: 'long' })} {currentMonth.getFullYear()}
          </span>
          <button onClick={() => changeMonth('inc')}>&gt;</button>
        </div>
        <div className={styles.weekdays}>
          {
            weekdays.map((item, index) => {
              return <div className={styles.weekday}>{item}</div>
            })
          }
        </div>
        <div className={styles.daysGrid}>{days}</div>
      </div>
    );
  }


  return (
    <div className={styles.dateRangePicker}>
      <div className={styles.calendars}>
        {renderCalendar(leftCalenderMonth, setLeftCalenderMonth, rightCalenderMonth, setRightCalenderMonth)}
        {renderCalendar(rightCalenderMonth, setRightCalenderMonth, leftCalenderMonth, setLeftCalenderMonth)}
      </div>
    </div>
  )

}
export default DateRangePicker;
