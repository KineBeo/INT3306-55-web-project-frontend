import ListBooking from "@/components/booking/listBooking";
import { flightTickets } from "@/data/fakeData";

const ManageBooking = () => {

  return (
    <ListBooking flightTickets={flightTickets} status="All" title="My Bookings" />
  );
};

export default ManageBooking;
