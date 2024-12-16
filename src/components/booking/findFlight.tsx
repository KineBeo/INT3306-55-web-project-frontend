"use client";

import SearchForm from "@/components/SearchForm";
import { useEffect, useRef, useState } from "react";
import PriceRangeFilter from "@/components/PriceRangeFilter";
import FlightCard from "@/components/FlightCard";
import SortButton from "@/components/SortButton";
import sectionBackground from "@/images/section-background.png";
import Stepper from "@/components/Stepper";
import { useRouter, useSearchParams } from "next/navigation";
import { useOverlay } from "@/context/OverlayContext";
import Image from "next/image";
import api from "@/services/apiClient";
import { Ticket } from "@/data/ticket";
import { useAppDispatch } from "@/redux/hooks";
import { setTicket, setPassengers, setTotalPrice } from "@/redux/ticket/ticketSlice";

type Groups = {
  [key: string]: Ticket[];
};

const FindFlight = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setLoading } = useOverlay();

  // params: departure, arrival, date, class, adults, children, infants
  const ticket_type = searchParams.get("ticket_type");
  const booking_class = searchParams.get("booking_class");
  const departure_airport_code = searchParams.get("departure_airport_code");
  const arrival_airport_code = searchParams.get("arrival_airport_code");
  const outbound_day = searchParams.get("outbound_day");
  const return_day = searchParams.get("return_day");
  const adults = parseInt(searchParams.get("adults") || "0");
  const children = parseInt(searchParams.get("children") || "0");
  const infants = parseInt(searchParams.get("infants") || "0");
  const totalPassengers = adults + children + infants;
  // ----------------------------

  const [ticketSearch, setTicketSearch] = useState<Groups>({});

  // call api to get
  useEffect(() => {
    const fetchData = async () => {
      const params = return_day
        ? {
            ticket_type: ticket_type,
            departure_airport_code: departure_airport_code,
            arrival_airport_code: arrival_airport_code,
            outbound_day: outbound_day,
            return_day: return_day,
          }
        : {
            ticket_type: ticket_type,
            departure_airport_code: departure_airport_code,
            arrival_airport_code: arrival_airport_code,
            outbound_day: outbound_day,
          };
      try {
        setLoading(true);
        const response = await api.get("/ticket/search", {
          params: params,
        });
        const data: Ticket[] = response.data;
        const filteredData = data.filter((ticket) => ticket.booking_class === booking_class);
        const groupsData: Groups = {};
        filteredData.forEach((ticket) => {
          const key = ticket.returnFlight
            ? `${ticket.outboundFlight.flight_number}-${ticket.returnFlight.flight_number}`
            : `${ticket.outboundFlight.flight_number}-null`;

          if (!groupsData[key]) {
            groupsData[key] = [];
          }

          groupsData[key].push(ticket);
        });

        const finalData = Object.entries(groupsData) // Chuyển đối tượng groups thành mảng các entry
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          .filter(([key, tickets]) => tickets.length >= totalPassengers) // Lọc những entry có số lượng tickets lớn hơn total Pass
          .reduce((acc, [key, tickets]) => {
            acc[key] = tickets.slice(0, totalPassengers);
            return acc;
          }, {} as Groups);

        setTicketSearch(finalData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [booking_class, setLoading, totalPassengers, ticket_type, departure_airport_code, arrival_airport_code, outbound_day, return_day]);

  const [priceRange, setPriceRange] = useState<number>(5000000);
  const [sortOrder, setSortOrder] = useState<string>("asc");

  const calculateTotalPrice = (tickets: Ticket[]): number => {
    return tickets.reduce((total, ticket) => total + parseFloat(ticket.total_price), 0);
  };

  const sortedTickets = Object.entries(ticketSearch)
    .map(([key, tickets]) => ({
      key,
      tickets,
      totalPrice: calculateTotalPrice(tickets), // Tính tổng giá cho mỗi group
    }))
    .sort((a, b) => (sortOrder === "asc" ? a.totalPrice - b.totalPrice : b.totalPrice - a.totalPrice)); // Sắp xếp theo giá trị tổng

  const searchFormRef = useRef<HTMLDivElement>(null);

  const handleBookNow = async (tickets: Ticket[]) => {
    setLoading(true);

    dispatch(setTicket(tickets));
    dispatch(setPassengers({ adults, children, infants }));
    dispatch(setTotalPrice(calculateTotalPrice(tickets)));
    // Chuyển trang
    router.push(`/booking/checking-ticket-info/`);
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
          {sortedTickets.map(({ tickets, totalPrice }, index) => (
            <div className="z-10" key={index}>
              <FlightCard
                key={index}
                tickets={tickets}
                totalPrice={totalPrice}
                adult={adults}
                child={children}
                infant={infants}
                onClick={() => handleBookNow(tickets)}></FlightCard>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FindFlight;
