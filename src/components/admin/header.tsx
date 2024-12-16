"use client";

import Logo from "@/shared/Logo";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User as UserButton, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logout } from "@/redux/auth/authSlice";

const AdminHeader = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  return (
    <>
      <header className={`sticky top-0 z-40 py-3 md:py-0 shadow-sm border-1 border-neutral-50 bg-white`}>
        <div className="flex flex-row items-center xl:pr-8 pl-16 pr-4">
          <Link href="/dashboard">
            <h1 className="text-base md:text-2xl font-bold text-primary-500">
              <span className="text-neutral-800">Admin</span> Dashboard
            </h1>
          </Link>
          <div className="flex-1 flex items-center justify-end py-2 space-x-6 h-8 md:h-auto">
            {user ? (
              <Dropdown placement="bottom-start">
                <DropdownTrigger>
                  <UserButton
                    as="button"
                    avatarProps={{
                      isBordered: true,
                      src: "https://www.svgrepo.com/show/492675/avatar-girl.svg",
                    }}
                    name={user.fullname}
                    description={user.role}
                    classNames={{
                      name: "ml-1 md:text-sm text-xs md:block hidden",
                      description: "ml-1 text-xs md:block hidden",
                    }}
                  />
                </DropdownTrigger>
                <DropdownMenu aria-label="User Actions" variant="flat">
                  <DropdownItem
                    key="account"
                    onClick={() => {
                      router.push("/dashboard/account");
                    }}>
                    My Account
                  </DropdownItem>
                  <DropdownItem
                    key="signout"
                    color="danger"
                    onClick={() => {
                      dispatch(logout());
                      router.push("/dashboard");
                    }}>
                    Sign Out
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            ) : (
              <Link href="/dashboard/signin" className="text-sm md:text-base underline hover:text-primary-6000">
                Sign In
              </Link>
            )}

            <Logo className="w-12 hidden md:block" href="/" />
          </div>
        </div>
      </header>
    </>
  );
};
export default AdminHeader;
