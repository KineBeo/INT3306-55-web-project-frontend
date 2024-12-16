import FindFlight from "@/components/booking/findFlight";
import ProtectedRoute from "@/components/ProtectedRoute";

const FindFlightPage = () => {
  return (
    <ProtectedRoute>
      <FindFlight />
    </ProtectedRoute>
  );
};

export default FindFlightPage;
