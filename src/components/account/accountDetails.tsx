"use client";

import { useState, useEffect } from "react";
import { FiPhone, FiMail, FiCalendar, FiUser } from "react-icons/fi";
import { UserInfo } from "@/data/auth";
import { useAppSelector } from "@/redux/hooks";
import api from "@/services/apiClient";
import { formatDateToDDMMYYYY } from "@/utils/formatDate";

const AccountDetails = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [userData, setUserData] = useState<UserInfo | null>(null);

  useEffect(() => {
    console.log(user);
    api.get("/user/id/" + user?.id).then((res) => {
      setUserData(res.data);
    });
  }, [user]);

  if (!userData) {
    return null;
  }

  return (
    <div className="bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8 w-full">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-neutral-900">Account Details</h2>
            </div>
          </div>

          <div className="border-t border-neutral-200">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-grow">
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700">
                          <FiUser className="inline mr-2" />
                          User ID
                        </label>
                        <p className="mt-1 text-sm text-neutral-500">{userData.id}</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-700">Full Name</label>
                        <p className="mt-1 text-sm text-neutral-500">{userData.fullname}</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-700">
                          <FiMail className="inline mr-2" />
                          Email Address
                        </label>
                        <p className="mt-1 text-sm text-neutral-500">{userData.email}</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-700">
                          <FiPhone className="inline mr-2" />
                          Phone Number
                        </label>
                        <p className="mt-1 text-sm text-neutral-500">{userData.phone_number}</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-700">
                          <FiUser className="inline mr-2" />
                          Role
                        </label>
                        <p className="mt-1 text-sm text-neutral-500">{userData.role}</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-700">
                          <FiCalendar className="inline mr-2" />
                          Birth Date
                        </label>
                        <p className="mt-1 text-sm text-neutral-500">{formatDateToDDMMYYYY(userData.birthday)}</p>
                      </div>

                      {/* Gender Field */}
                      <div>
                        <label className="block text-sm font-medium text-neutral-700">
                          <FiUser className="inline mr-2" />
                          Gender
                        </label>
                        <p className="mt-1 text-sm text-neutral-500">{userData.gender}</p>
                      </div>
                      {/* End Gender Field */}
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountDetails;
