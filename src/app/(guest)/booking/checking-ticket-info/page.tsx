import CheckingTicketInfo from "@/components/booking/checkingTicketInfo";
import ProtectedRoute from "@/components/ProtectedRoute";

const CheckingTicketInfoPage = () => {
  return (
    <ProtectedRoute>
      <CheckingTicketInfo />
    </ProtectedRoute>
  );
};

export default CheckingTicketInfoPage;
