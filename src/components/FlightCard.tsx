import React from "react";
import { FaPlane, FaUser, FaPlaneArrival, FaPlaneDeparture, FaChild } from "react-icons/fa";
import { BsCashStack, BsAirplane } from "react-icons/bs";
import { Flight } from "@/data/types";
import formatCurrency from "@/utils/formatCurrency";

interface FlightCardProps {
  flight: Flight;
  onClick?: () => void;
}

const FlightCard: React.FC<FlightCardProps> = ({ flight, onClick }) => (
  <div
    key={flight.id}
    className="flex flex-col lg:flex-row bg-white rounded-2xl shadow-lg p-3 md:p-4 lg:p-6 transition-all hover:shadow-xl">
    <div className="flex-1 flex flex-col lg:mr-16">
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-4">
          <div className="bg-primary-50 p-2 md:p-3 rounded-full">
            <BsAirplane className="text-primary-6000 md:text-xl" />
          </div>
          <div>
            <h2 className="font-semibold text-sm md:text-md md:font-bold text-gray-700">Flight {flight.flightCode}</h2>
            <p className="text-gray-600 text-small md:mt-1">
              {flight.departureDate} &#45; {flight.arrivalDate}
            </p>
          </div>
        </div>
      </div>
      <div className="flex-1 mt-3">
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-2">
            <FaPlaneDeparture className="hidden md:block text-primary-6000 text-2xl mr-2" />
            <div className="text-center">
              <p className="md:text-lg font-semibold text-gray-800">{flight.departureTime}</p>
              <p className="text-2xl md:text-3xl font-bold text-gray-600">{flight.sectorsCode[0]}</p>
              <p className="text-gray-600">{flight.sectors[0]}</p>
            </div>
          </div>
          <div className="flex-1 flex flex-col items-center ">
            <p className="text-sm font-semibold text-gray-500 mb-2">{flight.totalTime}</p>
            <div className="w-full h-0.5 bg-primary-6000 relative">
              <FaPlane className="text-primary-6000 text-xl absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2" />
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {flight.sectors.length - 1} {flight.sectors.length - 1 === 1 ? "stop" : "stops"}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-center">
              <p className="md:text-lg font-semibold text-gray-800">{flight.arrivalTime}</p>
              <p className="text-2xl md:text-3xl font-bold text-gray-600">
                {flight.sectorsCode[flight.sectorsCode.length - 1]}
              </p>
              <p className="text-gray-600">{flight.sectors[flight.sectors.length - 1]}</p>
            </div>
            <FaPlaneArrival className="hidden md:block text-primary-6000 text-2xl ml-2" />
          </div>
        </div>
      </div>
    </div>

    <div className="flex flex-col border-t-2 lg:border-t-0 lg:border-l-4 border-dashed border-gray-400 lg:pl-16 md:gap-1">
      <p className="text-xl md:text-2xl lg:text-3xl font-bold text-primary-6000 text-right order-1 md:order-0">
        {formatCurrency(flight.price)} VND
      </p>

      <div className="flex flex-col items-end justify-end md:space-y-2 order-0 md:order-1">
        <div className="flex items-center justify-end space-x-2">
          <FaUser className="text-gray-400" />
          <p className="text-gray-600">
            {flight.adults} {flight.adults > 1 ? "Adults" : "Adult"}
          </p>
          {flight.children > 0 && (
            <div className="flex items-center justify-end space-x-2">
              , 
              <FaChild className="text-gray-400" />
              <p className="text-gray-600">
                {flight.children} {flight.children > 1 ? "Children" : "Child"}
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end space-x-2">
          <BsCashStack className="text-gray-400" />
          <p className="text-gray-600">{flight.class}</p>
        </div>
      </div>

      <div className="flex gap-2 justify-end mt-2 md:mt-4 order-2">
        <button className="text-sm md:text-md px-4 md:px-6 py-2 border border-primary-6000 text-primary-6000 rounded-lg hover:bg-primary-100">
          View Details
        </button>
        <button
          onClick={onClick}
          className="text-sm md:text-md px-4 md:px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-700">
          Book now
        </button>
      </div>
    </div>
  </div>
);

export default FlightCard;
