import React, { useState } from 'react';
import styles from './date-picker.module.css';

type DateRange = {
  startDate: Date | null;
  endDate: Date | null;
};

type PropsType = {
  // onDateChange: (range: [string, string | null], weekends: string[]) => void;
  predefinedRanges?: { label: string; days: number }[];
};

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const isWeekend = (date: Date) => [0, 6].includes(date.getDay());

const DateRangePicker: React.FC<PropsType> = ({
  // onDateChange,
  predefinedRanges,
}) => {
  const [leftCalenderMonth, setLeftCalenderMonth] = useState(new Date());
  const [rightCalenderMonth, setRightCalenderMonth] = useState(
    new Date(new Date().setMonth(new Date().getMonth() + 1))
  );

  const [selectedRange, setSelectedRange] = useState<DateRange>({
    startDate: null,
    endDate: null,
  });
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const [dateValue, setDateValue] = useState<string>('MM/dd/yyyy ~ MM/dd/yyyy');
  const [showCalender, setShowCalender] = useState<boolean>(false);
  const renderCalendar = (
    currentMonth: Date,
    setMonth: (date: Date) => void,
    otherCalMonth: Date,
    setOtherCalMonth: (date: Date) => void
  ) => {
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
    ); // 31th
    const startingDate = firstDay.getDay();
    const totalDays = lastDay.getDate();

    const changeMonth = (type = 'inc') => {
      if (type == 'inc') {
        const month = new Date(
          currentMonth.setMonth(currentMonth.getMonth() + 1)
        );
        setMonth(month);
        if (
          month.getMonth() === otherCalMonth.getMonth() &&
          month.getFullYear() == otherCalMonth.getFullYear()
        ) {
          setOtherCalMonth(
            new Date(otherCalMonth.setMonth(otherCalMonth.getMonth() + 1))
          );
        }
      } else {
        const month = new Date(
          currentMonth.setMonth(currentMonth.getMonth() - 1)
        );
        setMonth(month);
        if (
          month.getMonth() === otherCalMonth.getMonth() &&
          month.getFullYear() === otherCalMonth.getFullYear()
        ) {
          setOtherCalMonth(
            new Date(otherCalMonth.setMonth(otherCalMonth.getMonth() - 1))
          );
        }
      }
    };
    const handleDateClick = (e: any, date: any) => {
      e.preventDefault();
      e.stopPropagation();
      console.log(date);
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
    //make empty spaces
    for (let i = 0; i < startingDate; i++) {
      days.push(<div key={`empty-${i}`} className={styles.emptyDay}></div>);
    }
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

    for (
      let day = new Date(firstDay);
      day <= lastDay;
      day.setDate(day.getDate() + 1)
    ) {
      const dayCopy = new Date(day); // Create a new copy of the date for each iteration
      days.push(
        <button
          id={dayCopy.toDateString()}
          className={`${styles.day} 
            ${checkRange(dayCopy) ? styles.selected : ''} 
            ${isHoveredRange(dayCopy) ? styles.hoveredRange : ''}
            ${isWeekend(dayCopy) ? styles.disabled : ''}`}
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
            return <div className={styles.weekday}>{item}</div>;
          })}
        </div>
        <div className={styles.daysGrid}>{days}</div>
      </div>
    );
  };

  const formatDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    };
    return date.toLocaleDateString('en-US', options);
  };

  const OnHandleChange = () => {
    if (!selectedRange.startDate || !selectedRange.endDate) {
      console.error('Please select a valid date range.');
      return;
    }
    const startDate = selectedRange.startDate;
    const endDate = selectedRange.endDate;
    const weekends: string[] = [];

    for (
      let day = new Date(startDate);
      day <= new Date(endDate);
      day.setDate(day.getDate() + 1)
    ) {
      const dayCopy = new Date(day);
      if (isWeekend(dayCopy)) {
        console.log(dayCopy, 's');
        weekends.push(formatDate(dayCopy));
      }
    }
    setDateValue(
      formatDate(new Date(startDate)) + '-' + formatDate(new Date(endDate))
    );
    setShowCalender(false);
    console.log(
      [formatDate(new Date(startDate)), formatDate(new Date(endDate))],
      weekends
    );
  };

  const onPredefineDateChange = (days: number) => {
    const currentDate = new Date();
    const startDate = new Date(
      currentDate.setDate(currentDate.getDate() - days)
    );
    const endDate = new Date();
    setSelectedRange({ startDate, endDate });
    setDateValue(
      formatDate(new Date(startDate)) + '-' + formatDate(new Date(endDate))
    );
    setShowCalender(false);
  };

  const onInputClick = () => {
    if (selectedRange.startDate && selectedRange.endDate) {
      const leftCalenderMonth =
        selectedRange.startDate &&
        new Date(selectedRange.startDate).getMonth() + 1;

      const leftCalenderYear =
        selectedRange.startDate &&
        new Date(selectedRange.startDate).getFullYear();

      const leftCalender = new Date(
        `${leftCalenderMonth}/1/${leftCalenderYear}`
      );

      setLeftCalenderMonth(leftCalender);

      setRightCalenderMonth(
        new Date(
          new Date(leftCalender).setMonth(new Date(leftCalender).getMonth() + 1)
        )
      );
    }
    setShowCalender(true);
  };

  return (
    <>
      <label htmlFor="startDate">Select Date: </label>
      <input
        inputMode="numeric"
        autoComplete="off"
        autoCorrect="off"
        spellCheck="false"
        aria-haspopup="dialog"
        className={styles.dateInput}
        type="text"
        id="rs-:r5p:"
        placeholder="Select Date"
        value={dateValue}
        aria-invalid="true"
        onClick={() => onInputClick()}
      />
      {showCalender && (
        <div className={styles.dateRangePicker}>
          <div className={styles.calendars}>
            {renderCalendar(
              leftCalenderMonth,
              setLeftCalenderMonth,
              rightCalenderMonth,
              setRightCalenderMonth
            )}
            {renderCalendar(
              rightCalenderMonth,
              setRightCalenderMonth,
              leftCalenderMonth,
              setLeftCalenderMonth
            )}
          </div>
          <div className={styles.predefinedRanges}>
            {predefinedRanges?.map((item, idx) => {
              return (
                <div
                  onClick={() => onPredefineDateChange(item?.days)}
                  className={styles.rangeLabel}
                >
                  {item.label}
                </div>
              );
            })}
          </div>
          <button onClick={() => OnHandleChange()} className={styles.submitBtn}>
            OK
          </button>
        </div>
      )}
    </>
  );
};
export default DateRangePicker;
