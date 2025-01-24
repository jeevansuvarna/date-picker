import React, { useState } from 'react';
import styles from './date-picker.module.css';
import Calendar from './calender/index.tsx';

type DateRange = {
  startDate: Date | null;
  endDate: Date | null;
};

type PropsType = {
  predefinedRanges?: { label: string; days: number }[];
};

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const isWeekend = (date: Date) => [0, 6].includes(date.getDay());

const DateRangePicker: React.FC<PropsType> = ({ predefinedRanges }) => {
  const [leftCalenderMonth, setLeftCalenderMonth] = useState(new Date());
  const [rightCalenderMonth, setRightCalenderMonth] = useState(
    new Date(new Date().setMonth(new Date().getMonth() + 1))
  );

  const [selectedRange, setSelectedRange] = useState<DateRange>({
    startDate: null,
    endDate: null,
  });
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const [dateValue, setDateValue] = useState<string>('YYYY/MM/DD ~YYYY/MM/DD');
  const [showCalender, setShowCalender] = useState<boolean>(false);
  const [weekend, setWeekends] = useState<string[]>([]);

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}/${month}/${day}`;
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
    setWeekends(weekends);
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

  const onDateChange = (e: any) => {
    console.log(e.target.value);
    let value = e.target.value;
    const [startDate, endDate] = value.split('~');
    console.log(startDate, endDate);
    setSelectedRange({ startDate, endDate });
    setDateValue(value);
  };

  return (
    <>
      {selectedRange.startDate && selectedRange.endDate && (
        <div>
          Date Range: {formatDate(new Date(selectedRange.startDate))}
          {' ~ '}
          {formatDate(new Date(selectedRange.startDate))}
        </div>
      )}
      <br />
      <br />
      {weekend.length > 0 && (
        <div>
          Weekends:{' '}
          {weekend.map((item) => {
            return (
              <span className={styles.weekEnds}>
                {item}
                {','}
              </span>
            );
          })}
        </div>
      )}
      <br />
      <br />
      <label htmlFor="startDate">Select Date: </label>
      <input
        inputMode="numeric"
        autoComplete="off"
        autoCorrect="off"
        className={styles.dateInput}
        type="text"
        placeholder="Select Date"
        value={dateValue}
        onClick={() => onInputClick()}
        // onChange={(e) => onDateChange(e)}
      />
      {showCalender && (
        <div className={styles.dateRangePicker}>
          <div className={styles.calendars}>
            <Calendar
              isWeekend={isWeekend}
              selectedRange={selectedRange}
              setSelectedRange={setSelectedRange}
              currentMonth={leftCalenderMonth}
              setMonth={setLeftCalenderMonth}
              otherCalMonth={rightCalenderMonth}
              setOtherCalMonth={setRightCalenderMonth}
            />

            <Calendar
              isWeekend={isWeekend}
              selectedRange={selectedRange}
              setSelectedRange={setSelectedRange}
              currentMonth={rightCalenderMonth}
              setMonth={setRightCalenderMonth}
              otherCalMonth={leftCalenderMonth}
              setOtherCalMonth={setLeftCalenderMonth}
            />
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
