import React from "react";
import { BsCashStack } from "react-icons/bs";

// Function to format numbers
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("vi-VN").format(value);
};

interface PriceRangeFilterProps {
  priceRange: number;
  setPriceRange: (value: number) => void;
  min?: number; // Optional: Minimum price
  max?: number; // Optional: Maximum price
}

const PriceRangeFilter: React.FC<PriceRangeFilterProps> = ({
  priceRange,
  setPriceRange,
  min = 500000, // Default min value
  max = 4000000, // Default max value
}) => (
  <div className="flex items-center bg-white p-3 md:p-6 rounded-2xl shadow-lg border-small">
    <BsCashStack className="text-cyan-600 text-xl mr-4" />
    <div className="flex flex-col w-64">
      <div className="flex justify-between mb-2">
        <span className="text-sm text-neutral-600">Budget Range</span>
        <span className="text-sm font-medium text-cyan-600">{formatCurrency(priceRange)} VND</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={priceRange}
        onChange={(e) => setPriceRange(Number(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-cyan-600"
      />
      <div className="flex justify-between mt-2 text-xs text-neutral-500">
        <span>{formatCurrency(min)} VND</span>
        <span>{formatCurrency(max)} VND</span>
      </div>
    </div>
  </div>
);

export default PriceRangeFilter;
