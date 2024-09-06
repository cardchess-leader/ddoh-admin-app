// components/Calendar.tsx
"use client";

import React, { useState } from "react";
import Calendar, { CalendarProps } from "react-calendar";
import "react-calendar/dist/Calendar.css"; // Import default styling

// Type to cover all possible values returned by react-calendar
type CalendarValue = Date | [Date, Date] | null;

interface CalendarComponentProps {
  onDateChange: (date: Date | null) => void;
}

const CalendarComponent: React.FC<CalendarComponentProps> = ({ onDateChange }) => {
  const [date, setDate] = useState<CalendarValue>(new Date());

  const handleChange = (newDate: CalendarValue) => {
    // Handle various types of date values
    if (newDate instanceof Date) {
      onDateChange(newDate);
    } else if (Array.isArray(newDate) && newDate.length > 0 && newDate[0] instanceof Date) {
      onDateChange(newDate[0]); // Use the first date if it's an array
    } else {
      onDateChange(null); // Handle null or empty array cases
    }
    setDate(newDate);
  };

  return (
    <div>
      <Calendar onChange={handleChange as CalendarProps["onChange"]} value={date} />
    </div>
  );
};

export default CalendarComponent;
