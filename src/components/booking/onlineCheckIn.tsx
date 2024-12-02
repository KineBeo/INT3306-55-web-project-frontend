import ListBooking from "@/components/booking/listBooking";
import { flightTickets } from "@/data/fakeData";

const OnlineCheckIn = () => {

  return (
      <ListBooking flightTickets={flightTickets} status="Pending" showFilter={false} title="Online Check-In"/>
  );
};

export default OnlineCheckIn;
