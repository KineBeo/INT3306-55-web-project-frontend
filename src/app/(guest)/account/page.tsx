import AccountDetails from "@/components/account/accountDetails";
import ProtectedRoute from "@/components/ProtectedRoute";

const AccountPage = () => {
  return (
    <ProtectedRoute>
      <AccountDetails />
    </ProtectedRoute>
  );
};

export default AccountPage;
