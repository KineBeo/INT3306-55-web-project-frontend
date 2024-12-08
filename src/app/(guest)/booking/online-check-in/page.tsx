import OnlineCheckIn from "@/components/booking/onlineCheckIn";
import ProtectedRoute from "@/components/ProtectedRoute";

const OnlineCheckInPage = () => {
  return (
    <ProtectedRoute>
      <OnlineCheckIn />
    </ProtectedRoute>
  );
};

export default OnlineCheckInPage;
