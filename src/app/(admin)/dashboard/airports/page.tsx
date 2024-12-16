import Airports from "@/components/admin/airports";
import AdminProtectedRoute from "@/components/admin/AdminProtectedRoute";

const AirplanesPage = () => {
  return (
    <AdminProtectedRoute>
      <Airports />
    </AdminProtectedRoute>
  );
};

export default AirplanesPage;
