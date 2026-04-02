"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarPickerProps {
  value: string;
  onChange: (date: string) => void;
  minDate?: string;
}

export default function CalendarPicker({
  value,
  onChange,
  minDate,
}: CalendarPickerProps) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Parse min date
  const getMinDate = () => {
    if (minDate) return new Date(minDate);
    return today;
  };

  const min = getMinDate();

  // Get calendar days
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const days: (number | null)[] = Array(firstDay).fill(null);

  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const handlePrevMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() - 1);
    if (newDate >= min) {
      setCurrentMonth(newDate);
    }
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentMonth(newDate);
  };

  const handleSelectDate = (day: number) => {
    const selectedDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );

    if (selectedDate >= min) {
      const dateString = selectedDate.toISOString().split("T")[0];
      onChange(dateString);
    }
  };

  const isDateSelected = (day: number) => {
    if (!value) return false;
    const selectedDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    const selectedDateString = selectedDate.toISOString().split("T")[0];
    return selectedDateString === value;
  };

  const isDateDisabled = (day: number) => {
    const checkDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    return checkDate < min;
  };

  const formatMonth = (date: Date) => {
    return date.toLocaleString("id-ID", { month: "long", year: "numeric" });
  };

  return (
    <div className="w-full bg-white border-2 border-black rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-poppins font-bold text-lg text-black">
          {formatMonth(currentMonth)}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={handlePrevMonth}
            disabled={
              currentMonth.getFullYear() === min.getFullYear() &&
              currentMonth.getMonth() === min.getMonth()
            }
            className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded"
          >
            <ChevronLeft className="w-5 h-5 text-black" />
          </button>
          <button
            onClick={handleNextMonth}
            className="p-2 hover:bg-gray-100 rounded"
          >
            <ChevronRight className="w-5 h-5 text-black" />
          </button>
        </div>
      </div>

      {/* Days of week header */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((day) => (
          <div
            key={day}
            className="text-center font-poppins font-bold text-sm text-gray-600"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, idx) => (
          <div key={idx}>
            {day === null ? (
              <div className="w-full aspect-square" />
            ) : (
              <button
                onClick={() => handleSelectDate(day)}
                disabled={isDateDisabled(day)}
                className={`
                  w-full aspect-square rounded border-2 font-poppins font-bold text-sm
                  transition-all duration-200
                  ${
                    isDateSelected(day)
                      ? "bg-black text-white border-black"
                      : isDateDisabled(day)
                        ? "text-gray-300 border-gray-200 cursor-not-allowed"
                        : "border-gray-300 text-black hover:border-black hover:bg-gray-50"
                  }
                `}
              >
                {day}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Selected date display */}
      {value && (
        <div className="mt-6 pt-4 border-t-2 border-gray-200">
          <p className="font-inter text-sm text-gray-600 mb-2">
            Tanggal dipilih:
          </p>
          <p className="font-poppins font-bold text-black">
            {new Date(value).toLocaleDateString("id-ID", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      )}
    </div>
  );
}
