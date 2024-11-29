import React from "react";
import { FaSortAmountDown, FaSortAmountUp } from "react-icons/fa";

interface SortButtonProps {
  sortOrder: string;
  setSortOrder: (value: string) => void;
}

const SortButton: React.FC<SortButtonProps> = ({ sortOrder, setSortOrder }) => (
  <button
    onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
    className="flex items-center bg-[#06B6D4] text-white px-3 md:px-6 py-2 md:py-4 rounded-xl hover:bg-cyan-700 transition-colors shadow-lg"
  >
    {sortOrder === "asc" ? <FaSortAmountUp className="mr-2" /> : <FaSortAmountDown className="mr-2" />}
    Sort by Price
  </button>
);

export default SortButton;
