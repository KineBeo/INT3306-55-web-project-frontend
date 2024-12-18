"use client";

import { useState } from "react";
import FlightTicketCard from "@/components/FlightTicketCard";
import sectionBackground from "@/images/section-background.png";
import { useOverlay } from "@/context/OverlayContext";
import Image from "next/image";
import { Ticket } from "@/types/ticket";
import { useNotification } from "@/context/NotificationContext";
import api from "@/services/apiClient";

interface ListBookingProps {
  flightTickets: Ticket[];
  status?: "ALL" | "CONFIRMED" | "PENDING" | "CANCELLED";
  showFilter?: boolean;
  title?: string;
}

const ListBooking = ({ flightTickets, status, showFilter = true, title = "My Bookings" }: ListBookingProps) => {
  const { setLoading } = useOverlay();
  const { showNotification } = useNotification();

  const [filterStatus, setFilterStatus] = useState<"ALL" | "CONFIRMED" | "PENDING" | "CANCELLED">(status || "ALL");

  const filterFlightTickets =
    filterStatus === "ALL" ? flightTickets : flightTickets.filter((ticket) => ticket.booking_status === filterStatus);

  const handleCancel = async (ticket: Ticket) => {
    // Call API to cancel ticket
    try {
      setLoading(true);
      await api.patch(`/ticket/cancel/${ticket.id}`);
      // update ticket status
      ticket.booking_status = "CANCELLED";
      showNotification("Cancel ticket successfully");
      /* eslint-disable @typescript-eslint/no-unused-vars */
    } catch (error) {
      showNotification("Failed to cancel ticket", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async (ticket: Ticket) => {
    try {
      setLoading(true);
      await api.patch(`/ticket/check-in/${ticket.id}`);
      // update ticket status
      ticket.booking_status = "CONFIRMED";
      showNotification("Check-in successfully");
      /* eslint-disable @typescript-eslint/no-unused-vars */
    } catch (error) {
      showNotification("Failed to check-in", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col items-center justify-center bg-white lg:px-32 md:px-12 md:py-8 px-5 py-4 w-full gap-4 md:gap-10">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-neutral-800 w-full text-start">{title}</h2>
        {/* Filter Section */}
        {showFilter && (
          <div className="flex overflow-x-auto flex-nowrap space-x-2 md:space-x-4 w-full text-sm md:text-base">
            <button
              onClick={() => setFilterStatus("ALL")}
              className={`px-2 md:px-4 py-1 md:py-2 rounded-lg w-auto text-nowrap ${
                filterStatus === "ALL"
                  ? "bg-cyan-600 text-white"
                  : "bg-white text-neutral-600 border border-neutral-200"
              }`}>
              All Tickets
            </button>
            <button
              onClick={() => setFilterStatus("CONFIRMED")}
              className={`px-2 md:px-4 py-1 md:py-2 rounded-lg w-auto text-nowrap ${
                filterStatus === "CONFIRMED"
                  ? "bg-green-600 text-white"
                  : "bg-white text-neutral-600 border border-neutral-200"
              }`}>
              Confirmed
            </button>
            <button
              onClick={() => setFilterStatus("PENDING")}
              className={`px-2 md:px-4 py-1 md:py-2 rounded-lg w-auto text-nowrap ${
                filterStatus === "PENDING"
                  ? "bg-[#ec9543] text-white"
                  : "bg-white text-neutral-600 border border-neutral-200"
              }`}>
              Pending
            </button>
            <button
              onClick={() => setFilterStatus("CANCELLED")}
              className={`px-2 md:px-4 py-1 md:py-2 rounded-lg w-auto text-nowrap ${
                filterStatus === "CANCELLED"
                  ? "bg-red-600 text-white"
                  : "bg-white text-neutral-600 border border-neutral-200"
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
