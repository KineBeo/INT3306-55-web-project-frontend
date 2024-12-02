"use client";

import { useState } from "react";
import FlightTicketCard from "@/components/FlightTicketCard";
import sectionBackground from "@/images/section-background.png";
import { useOverlay } from "@/context/OverlayContext";
import Image from "next/image";
import { FlightTicket } from "@/data/types";
import { useNotification } from "@/context/NotificationContext";

interface ListBookingProps {
  flightTickets: FlightTicket[];
  status?: "All" | "Confirmed" | "Pending" | "Cancelled";
  showFilter?: boolean;
  title?: string;
}

const ListBooking = ({ flightTickets, status, showFilter = true, title = "My Bookings" }: ListBookingProps) => {
  const { setLoading } = useOverlay();
  const { showNotification } = useNotification();

  const [filterStatus, setFilterStatus] = useState<"All" | "Confirmed" | "Pending" | "Cancelled">(status || "All");

  const filterFlightTickets =
    filterStatus === "All" ? flightTickets : flightTickets.filter((ticket) => ticket.status === filterStatus);

  const handleCancel = async (ticket: FlightTicket) => {
    // Call API to cancel ticket
    flightTickets.find((t) => t.id === ticket.id)!.status = "Cancelled";
    await new Promise((resolve) => setTimeout(resolve, 500));
    showNotification("Cancel ticket successfully");
  };

  const handleCheckIn = async (ticket: FlightTicket) => {
    setLoading(true);
    flightTickets.find((t) => t.id === ticket.id)!.status = "Confirmed";
    await new Promise((resolve) => setTimeout(resolve, 500));
    setLoading(false);
    showNotification("Check-in successfully");
  };

  return (
    <div>
      <div className="flex flex-col items-center justify-center bg-white lg:px-32 md:px-12 md:py-8 px-5 py-4 w-full gap-4 md:gap-10">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 w-full text-start">{title}</h2>
        {/* Filter Section */}
        {showFilter && (
          <div className="flex space-x-4 w-full">
            <button
              onClick={() => setFilterStatus("All")}
              className={`px-4 py-2 rounded-lg ${
                filterStatus === "All" ? "bg-cyan-600 text-white" : "bg-white text-gray-600 border border-gray-200"
              }`}>
              All Tickets
            </button>
            <button
              onClick={() => setFilterStatus("Confirmed")}
              className={`px-4 py-2 rounded-lg ${
                filterStatus === "Confirmed"
                  ? "bg-green-600 text-white"
                  : "bg-white text-gray-600 border border-gray-200"
              }`}>
              Confirmed
            </button>
            <button
              onClick={() => setFilterStatus("Pending")}
              className={`px-4 py-2 rounded-lg ${
                filterStatus === "Pending" ? "bg-[#ec9543] text-white" : "bg-white text-gray-600 border border-gray-200"
              }`}>
              Pending
            </button>
            <button
              onClick={() => setFilterStatus("Cancelled")}
              className={`px-4 py-2 rounded-lg ${
                filterStatus === "Cancelled" ? "bg-red-600 text-white" : "bg-white text-gray-600 border border-gray-200"
              }`}>
              Cancelled
            </button>
          </div>
        )}

        {/* Flight List Section */}
        <div className="relative rounded-3xl lg:px-20 px-6 md:py-12 py-10 bg-gray-100 w-full flex flex-col gap-6">
          {/* Background image */}
          <div className="absolute inset-0">
            <Image alt="sectionBackground" src={sectionBackground} fill className="object-cover" />
          </div>
          {filterFlightTickets.map((flightTicket, index) => (
            <div className="z-10" key={index}>
              <FlightTicketCard
                key={flightTicket.id}
                flightTicket={flightTicket}
                handleCancel={() => {
                  handleCancel(flightTicket);
                }}
                handleCheckIn={() => {
                  handleCheckIn(flightTicket);
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ListBooking;
