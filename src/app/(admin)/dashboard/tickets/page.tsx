import Tickets from "@/components/admin/tickets";
import AdminProtectedRoute from "@/components/admin/AdminProtectedRoute";

const TicketsPage = () => {
  return (
    <AdminProtectedRoute>
      <Tickets />
    </AdminProtectedRoute>
  );
};

export default TicketsPage;
