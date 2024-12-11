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
import { useAppDispatch } from "@/redux/hooks";
import { setFlight } from "@/redux/flightSlice";
import { Flight } from "@/data/types";
import { flightData } from "@/data/fakeData";

const FindFlight = () => {
  const router = useRouter();
  const [priceRange, setPriceRange] = useState<number>(5000000);
  const [sortOrder, setSortOrder] = useState<string>("asc");
  const { setLoading } = useOverlay();

  const sortedFlights = flightData
    .filter((flight) => flight.price <= priceRange)
    .sort((a, b) => (sortOrder === "asc" ? a.price - b.price : b.price - a.price));

  const searchFormRef = useRef<HTMLDivElement>(null);

  const dispatch = useAppDispatch();

  const handleBookNow = async (flight: Flight) => {
    setLoading(true);

    // Lưu flight vào Redux
    dispatch(setFlight(flight));

    // Chuyển trang
    await new Promise((resolve) => setTimeout(resolve, 500));
    router.push(`/booking/checking-ticket-info/${flight.id}`);
  };

  return (
    <div>
      <div className="flex flex-col items-center justify-center bg-white lg:px-32 md:px-12 md:py-5 px-5 py-4 w-full gap-4 md:gap-10">
        <div className="relative bg-gray-100 w-full flex flex-col items-center gap-4 md:gap-10 py-4 rounded-3xl">
          {/* Background image */}
          <div className="absolute inset-0">
            <Image alt="sectionBackground" src={sectionBackground} fill className="object-cover" />
          </div>
          <div
            ref={searchFormRef}
            className="w-[80%] rounded-[2.5rem] shadow-xl px-10 py-8 bg-white hidden lg:block border-small z-40">
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
        <div className="relative rounded-3xl lg:px-20 px-6 md:py-12 py-10 bg-gray-100 w-full flex flex-col gap-6">
          {/* Background image */}
          <div className="absolute inset-0">
            <Image alt="sectionBackground" src={sectionBackground} fill className="object-cover" />
          </div>
          {sortedFlights.map((flight, index) => (
            <div className="z-10" key={index}>
              <FlightCard key={flight.id} flight={flight} onClick={() => handleBookNow(flight)} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FindFlight;
