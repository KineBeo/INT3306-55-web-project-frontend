import ManageBooking from "@/components/booking/manageBooking";
import ProtectedRoute from "@/components/ProtectedRoute";

const ManageBookingPage = () => {
    return (
        <ProtectedRoute>
            <ManageBooking />
        </ProtectedRoute>
    );
};

export default ManageBookingPage;