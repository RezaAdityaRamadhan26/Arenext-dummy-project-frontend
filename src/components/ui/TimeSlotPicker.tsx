"use client";

import React from "react";
import { Clock } from "lucide-react";

interface TimeSlotPickerProps {
  value: string;
  onChange: (time: string) => void;
  startHour?: number;
  endHour?: number;
  interval?: number;
}

export default function TimeSlotPicker({
  value,
  onChange,
  startHour = 7,
  endHour = 22,
  interval = 1,
}: TimeSlotPickerProps) {
  const timeSlots = [];

  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += interval * 60) {
      const timeString = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
      timeSlots.push(timeString);
    }
  }

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-black" />
        <label className="font-poppins font-bold text-black">
          Pilih Jam Mulai
        </label>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
        {timeSlots.map((time) => (
          <button
            key={time}
            onClick={() => onChange(time)}
            className={`
              py-3 px-2 rounded border-2 font-poppins font-bold text-sm
              transition-all duration-200
              ${
                value === time
                  ? "bg-black text-white border-black"
                  : "border-black text-black hover:bg-black hover:text-white"
              }
            `}
          >
            {time}
          </button>
        ))}
      </div>

      {value && (
        <div className="mt-4 p-3 bg-gray-100 rounded border-2 border-gray-300">
          <p className="font-inter text-sm text-gray-600">Jam dipilih:</p>
          <p className="font-poppins font-bold text-black">{value}</p>
        </div>
      )}
    </div>
  );
}
