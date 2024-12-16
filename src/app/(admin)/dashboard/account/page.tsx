import AccountDetails from "@/components/account/accountDetails";
import ProtectedRoute from "@/components/ProtectedRoute";

const AdminAccountPage = () => {
  return (
    <ProtectedRoute>
      <AccountDetails />
    </ProtectedRoute>
  );
};

export default AdminAccountPage;
