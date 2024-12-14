import TicketPassengers from "@/components/admin/ticketPassengers";
import AdminProtectedRoute from "@/components/admin/AdminProtectedRoute";

const TicketPassengersPage = () => {
  return (
    <AdminProtectedRoute>
      <TicketPassengers />
    </AdminProtectedRoute>
  );
};

export default TicketPassengersPage;
