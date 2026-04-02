"use client";

import React from "react";
import { Minus, Plus } from "lucide-react";

interface DurationSelectorProps {
  value: number;
  onChange: (duration: number) => void;
  maxDuration?: number;
}

export default function DurationSelector({
  value,
  onChange,
  maxDuration = 8,
}: DurationSelectorProps) {
  const handleDecrease = () => {
    if (value > 1) {
      onChange(value - 1);
    }
  };

  const handleIncrease = () => {
    if (value < maxDuration) {
      onChange(value + 1);
    }
  };

  return (
    <div className="w-full">
      <label className="font-poppins font-bold text-black block mb-3">
        Durasi (Jam)
      </label>

      <div className="flex items-center gap-4">
        <button
          onClick={handleDecrease}
          disabled={value <= 1}
          className="p-2 border-2 border-black rounded hover:bg-black hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          <Minus className="w-5 h-5" />
        </button>

        <div className="flex-1 text-center">
          <p className="font-poppins font-bold text-2xl text-black">{value}</p>
          <p className="font-inter text-sm text-gray-600">jam</p>
        </div>

        <button
          onClick={handleIncrease}
          disabled={value >= maxDuration}
          className="p-2 border-2 border-black rounded hover:bg-black hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
