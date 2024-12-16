"use client";

import ListBooking from "@/components/booking/listBooking";
import api from "@/services/apiClient";
import { Ticket } from "@/data/ticket";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/redux/hooks";
import { useOverlay } from "@/context/OverlayContext";

const ManageBooking = () => {
  const { setLoading } = useOverlay();
  const [flightTickets, setFlightTickets] = useState<Ticket[]>([]);
  const { user } = useAppSelector((state) => state.auth);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.get("/ticket/user/" + user?.id);
        setFlightTickets(response.data);
      } catch (error) {
        console.error("Failed to fetch flight tickets", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
    fetchData();
  }, [setLoading, user]);

  return <ListBooking flightTickets={flightTickets} status="ALL" title="My Bookings" />;
};

export default ManageBooking;
