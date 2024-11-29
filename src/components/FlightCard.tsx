import React from "react";
import { FaPlane, FaExchangeAlt } from "react-icons/fa";
import { BsClock } from "react-icons/bs";

interface Flight {
  id: number;
  departureTime: string;
  arrivalTime: string;
  totalTime: string;
  sectors: string[];
  fare: number;
}

interface FlightCardProps {
    flight: Flight;
    onClick?: () => void;
}

// Function to format numbers
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("vi-VN").format(value);
};

const FlightCard: React.FC<FlightCardProps> = ({ flight, onClick }) => (
  <div className="bg-white rounded-2xl shadow-lg p-8 transition-all hover:shadow-xl">
    <div className="flex justify-between items-center">
      <div className="flex-1">
        <div className="flex items-center space-x-12">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-800">{flight.departureTime}</p>
            <p className="text-lg text-gray-600 mt-1">{flight.sectors[0]}</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-32 h-0.5 bg-cyan-600 relative">
              <FaPlane className="text-cyan-600 text-xl absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2" />
            </div>
            <p className="text-sm text-gray-500 mt-2">{flight.totalTime}</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-800">{flight.arrivalTime}</p>
            <p className="text-lg text-gray-600 mt-1">{flight.sectors[flight.sectors.length - 1]}</p>
          </div>
        </div>
        <div className="flex items-center space-x-6 mt-6 text-sm text-gray-600">
          <div className="flex items-center bg-gray-50 px-4 py-2 rounded-lg">
            <BsClock className="mr-2 text-cyan-600" />
            Flight Duration: {flight.totalTime}
          </div>
          <div className="flex items-center bg-gray-50 px-4 py-2 rounded-lg">
            <FaExchangeAlt className="mr-2 text-cyan-600" />
            {flight.sectors.length - 1} {flight.sectors.length - 1 === 1 ? "stop" : "stops"}
          </div>
        </div>
      </div>
      <div className="text-right">
        <p className="text-3xl font-bold text-cyan-600">{formatCurrency(flight.fare)} VND</p>
        <button onClick={onClick} className="mt-4 bg-[#06B6D4] text-white px-8 py-3 rounded-xl hover:bg-cyan-700 transition-colors shadow-md hover:shadow-lg">
          Book Now
        </button>
      </div>
    </div>
    {flight.sectors.length > 2 && (
      <div className="mt-6 pt-6 border-t border-gray-100">
        <p className="text-sm font-medium text-gray-700 mb-2">Stopover Cities:</p>
        <div className="flex items-center space-x-3">
          {flight.sectors.slice(1, -1).map((sector, index) => (
            <span key={index} className="bg-cyan-50 text-cyan-700 px-4 py-2 rounded-lg text-sm font-medium">
              {sector}
            </span>
          ))}
        </div>
      </div>
    )}
  </div>
);

export default FlightCard;
