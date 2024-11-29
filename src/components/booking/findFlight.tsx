"use client";

import SearchForm from "@/components/SearchForm";
import { useRef, useState } from "react";
import PriceRangeFilter from "@/components/PriceRangeFilter";
import FlightCard from "@/components/FlightCard";
import SortButton from "@/components/SortButton";
import sectionBackground from "@/images/section-background.png";
import Stepper from "@/components/Stepper";
import { useRouter } from "next/navigation";
import { useOverlay } from "@/context/OverlayContext";
import Image from "next/image";

const FindFlight = () => {
  const router = useRouter();
  const [priceRange, setPriceRange] = useState<number>(5000000);
  const [sortOrder, setSortOrder] = useState<string>("asc");
  const { setLoading } = useOverlay();

  const flightData = [
    {
      id: 1,
      departureDate: "2022/12/01",
      arrivalDate: "2022/12/01",
      departureTime: "08:00 AM",
      arrivalTime: "10:30 AM",
      totalTime: "2h 30m",
      sectors: ["New York", "London"],
      sectorsCode: ["JFK", "LHR"],
      price: 2000000,
      aircraftModel: "Boeing 747",
      flightCode: "BA-123",
      class: "Economy",
      passengers: 2,
    },
    {
      id: 2,
      departureDate: "2022/12/01",
      arrivalDate: "2022/12/01",
      departureTime: "11:45 AM",
      arrivalTime: "16:15 PM",
      totalTime: "4h 30m",
      sectors: ["New York", "Paris", "London"],
      sectorsCode: ["JFK", "CDG", "LHR"],
      price: 2500000,
      aircraftModel: "Boeing 747",
      flightCode: "BA-123",
      class: "Economy",
      passengers: 1,
    },
    {
      id: 3,
      departureDate: "2022/12/01",
      arrivalDate: "2022/12/01",
      departureTime: "14:20 PM",
      arrivalTime: "16:50 PM",
      totalTime: "2h 30m",
      sectors: ["New York", "London"],
      sectorsCode: ["JFK", "LHR"],
      price: 3000000,
      aircraftModel: "Boeing 747",
      flightCode: "BA-123",
      class: "Economy",
      passengers: 3,
    },
  ];

  const sortedFlights = flightData
    .filter((flight) => flight.price <= priceRange)
    .sort((a, b) => (sortOrder === "asc" ? a.price - b.price : b.price - a.price));

  const searchFormRef = useRef<HTMLDivElement>(null);

  const handleBookNow = async () => {
    setLoading(true);

    // sleep 500ms
    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
      // Gọi API
      router.push("/booking/checking-ticket-info");
      //   if (result.success) {
      //     router.push("/...");
      //   }
    } catch (error) {
      console.error("API call failed", error);
    }
  };

  return (
    <div>
      <div className="flex flex-col items-center justify-center bg-white md:px-32 md:py-5 px-5 py-4 w-full gap-4 md:gap-10">
        <div className="relative bg-gray-100 w-full flex flex-col items-center gap-4 md:gap-10 py-4 rounded-3xl">
          {/* Background image */}
          <div className="absolute inset-0">
            <Image alt="sectionBackground" src={sectionBackground} fill className="object-cover" />
          </div>
          <div
            ref={searchFormRef}
            className="w-[80%] rounded-[2.5rem] shadow-xl px-10 py-8 bg-white hidden md:block border-small z-10">
            <SearchForm align="start" />
          </div>

          {/* stepper section */}
          <div className="w-full md:px-20 z-10">
            <Stepper currentStep={1} />
          </div>
        </div>

        {/* Filter Section */}
        <div className="w-full flex">
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 md:items-end">
            <div>
              <PriceRangeFilter priceRange={priceRange} setPriceRange={setPriceRange} min={500000} max={5000000} />
            </div>
            <div>
              <SortButton sortOrder={sortOrder} setSortOrder={setSortOrder} />
            </div>
          </div>
        </div>

        {/* Flight List Section */}
        <div className="relative rounded-3xl md:px-20 px-6 md:py-12 py-10 bg-gray-100 w-full flex flex-col gap-6">
          {/* Background image */}
          <div className="absolute inset-0">
            <Image alt="sectionBackground" src={sectionBackground} fill className="object-cover" />
          </div>
          {sortedFlights.map((flight, index) => (
            <div className="z-10" key={index}>
              <FlightCard key={flight.id} flight={flight} onClick={handleBookNow} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FindFlight;
