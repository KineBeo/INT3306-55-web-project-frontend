import Airplanes from "@/components/admin/airplanes";
import AdminProtectedRoute from "@/components/admin/AdminProtectedRoute";

const AirplanesPage = () => {
  return (
    <AdminProtectedRoute>
      <Airplanes />
    </AdminProtectedRoute>
  );
};

export default AirplanesPage;
