"use client";

import React, { FC, useEffect, useRef, useState, useCallback } from "react";
import Logo from "@/shared/Logo";
import Link from "next/link";

const AdminHeader = () => {
  return (
    <>
      <header className={`sticky top-0 z-40 py-3 md:py-0 shadow-sm border-1 border-neutral-50 bg-white`}>
        <div className="flex flex-row items-center md:px-8 px-16">
          <Link href="/dashboard">
            <h1 className="text-base md:text-2xl font-bold text-primary-500">
              <span className="text-neutral-800">Admin</span> Dashboard
            </h1>
          </Link>
          <div className="flex-1 flex items-center justify-end py-2">
            <Logo className="w-12 hidden md:block" href="/dashboard" />
          </div>
        </div>
      </header>
    </>
  );
};
export default AdminHeader;
