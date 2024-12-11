import React from "react";
import { BsArrowRight } from "react-icons/bs";
import { Destination } from "@/data/types";
import Image from "next/image";

interface DestinationCardProps {
  destination: Destination;
  onClick?: () => void;
}

const DestinationCard: React.FC<DestinationCardProps> = ({ destination, onClick }) => {
  return (
    <div
      key={destination.id}
      className="flex-none bg-white w-60 md:w-72 h-[300px] rounded-2xl border-2 shadow-lg overflow-hidden group hover:shadow-xl transition-all">
      {/* Image Section */}
      <div className="relative h-40 md:h-48 overflow-hidden">
        <Image
          src={destination.image}
          alt={`${destination.city}, ${destination.country}`}
                  fill
                  loading="lazy"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        <div className="absolute bottom-4 left-4 text-white">
          <h3 className="text-lg md:text-xl font-bold">{destination.city}</h3>
          <p className="text-sm">{destination.country}</p>
        </div>
      </div>
      {/* Description Section */}
      <div className="p-3 md:p-6">
        <p className="text-sm md:text-md text-neutral-600 mb-2 md:mb-4 truncate">{destination.description}</p>
        <div className="flex justify-end items-center">
          <button onClick={onClick} className="text-sm md:text-md flex items-center text-primary-6000 hover:text-primary-700 transition-colors">
            Book Now
            <BsArrowRight className="ml-2"/>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DestinationCard;
