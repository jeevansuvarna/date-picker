import React, { useState } from 'react';
import styles from './calendar.module.css';

interface CalendarProps {
  isWeekend: (date: Date) => boolean;
  selectedRange: { startDate: Date | null; endDate: Date | null };
  setSelectedRange: React.Dispatch<
    React.SetStateAction<{ startDate: Date | null; endDate: Date | null }>
  >;
  currentMonth: Date;
  setMonth: (date: Date) => void;
  otherCalMonth: Date;
  setOtherCalMonth: (date: Date) => void;
}

const Calendar: React.FC<CalendarProps> = ({
  isWeekend,
  selectedRange,
  setSelectedRange,
  currentMonth,
  setMonth,
  otherCalMonth,
  setOtherCalMonth,
}) => {
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const days: any = [];
  const firstDay = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ); // 1st
  const lastDay = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ); // last day of month
  const startingDate = firstDay.getDay();
  const totalDays = lastDay.getDate();

  const changeMonth = (type: 'inc' | 'dec') => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + (type === 'inc' ? 1 : -1));
    setMonth(newMonth);
    if (
      newMonth.getMonth() === otherCalMonth.getMonth() &&
      newMonth.getFullYear() === otherCalMonth.getFullYear()
    ) {
      setOtherCalMonth(
        new Date(
          otherCalMonth.setMonth(
            otherCalMonth.getMonth() + (type === 'inc' ? 1 : -1)
          )
        )
      );
    }
  };

  const handleDateClick = (date: Date) => {
    if (isWeekend(date)) return;

    if (
      !selectedRange.startDate ||
      (selectedRange.startDate && selectedRange.endDate)
    ) {
      setSelectedRange({ startDate: date, endDate: null });
    } else {
      const endDate =
        date >= selectedRange.startDate ? date : selectedRange.startDate;
      const startDate =
        date < selectedRange.startDate ? date : selectedRange.startDate;
      setSelectedRange({ startDate, endDate });
    }
  };

  const checkRange = (date: Date) => {
    if (
      selectedRange.startDate &&
      !selectedRange.endDate &&
      date.getTime() === selectedRange.startDate.getTime()
    ) {
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
      return (
        date >= selectedRange.startDate &&
        date <= hoveredDate &&
        !isWeekend(date)
      );
    }
    return false;
  };

  for (let i = 0; i < startingDate; i++) {
    days.push(<div key={`empty-${i}`} className={styles.emptyDay}></div>);
  }

  for (let day = 1; day <= totalDays; day++) {
    const dayCopy = new Date(currentMonth);
    dayCopy.setDate(day);
    days.push(
      <button
        key={dayCopy.toDateString()}
        className={`${styles.day}
          ${checkRange(dayCopy) ? styles.selected : ''}
          ${isHoveredRange(dayCopy) ? styles.hoveredRange : ''}
          ${isWeekend(dayCopy) ? styles.disabled : ''}`}
        onClick={() => handleDateClick(dayCopy)}
        onMouseEnter={() => handleMouseEnter(dayCopy)}
        onMouseLeave={handleMouseLeave}
        disabled={isWeekend(dayCopy)}
      >
        {day}
      </button>
    );
  }

  return (
    <div className={styles.calendar}>
      <div className={styles.header}>
        <div className={styles.arrow} onClick={() => changeMonth('dec')}>
          &lt;
        </div>
        <span>
          {currentMonth.toLocaleString('default', { month: 'long' })}{' '}
          {currentMonth.getFullYear()}
        </span>
        <div onClick={() => changeMonth('inc')} className={styles.arrow}>
          &gt;
        </div>
      </div>
      <div className={styles.weekdays}>
        {weekdays.map((item, index) => {
          return (
            <div key={index} className={styles.weekday}>
              {item}
            </div>
          );
        })}
      </div>
      <div className={styles.daysGrid}>{days}</div>
    </div>
  );
};

export default Calendar;
