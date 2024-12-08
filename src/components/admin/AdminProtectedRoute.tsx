"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import { RootState } from "@/redux/store";
import { FaLock } from "react-icons/fa";

const AdminProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.persistedReducer.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(`/dashboard/signin?redirect=${pathname}`);
    }
  }, [isAuthenticated, router, pathname]);

    const renderNotAllowed = () => {
        return (
        <div className="py-12 px-4 sm:px-6 lg:px-8 flex justify-center">
          <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
            <div className="mb-6">
              <FaLock className="text-6xl text-red-500 mx-auto" />
            </div>
            <h2 className="text-2xl font-bold text-neutral-800 mb-4">Access Denied</h2>
            <p className="text-neutral-600 mb-6">Sorry, your account doesn&apos;t have permission to access this page.</p>
          </div>
        </div>
      );
    };
    
  return <>{isAuthenticated ? user?.role === "ADMIN" ? children : renderNotAllowed() : null}</>;
};

export default AdminProtectedRoute;
