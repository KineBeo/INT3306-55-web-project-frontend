import Flights from "@/components/admin/flights";
import AdminProtectedRoute from "@/components/admin/AdminProtectedRoute";

const FlightsPage = () => {
  return (
    <AdminProtectedRoute>
      <Flights />
    </AdminProtectedRoute>
  );
};

export default FlightsPage;
