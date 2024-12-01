"use client";

import React from "react";
import I404Png from "@/images/404.png";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Page404 = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center p-4">
      <Image src={I404Png} alt="not-found" width={800} loading="lazy"/>
      <div className="text-center text-sm md:text-base text-neutral-800 dark:text-neutral-200 tracking-wider font-medium">
        The page you were looking for doesn&apos;t exist.
      </div>
      <div className="pt-8">
        <button className="bg-[#E98383] rounded-full p-3 text-white" onClick={() => router.push("/")}>Return Home Page</button>
      </div>
    </div>
  );
};

export default Page404;
