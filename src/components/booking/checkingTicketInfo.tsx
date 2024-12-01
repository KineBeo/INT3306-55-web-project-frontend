"use client";

import React, { FormEvent, useState, useEffect } from "react";
import Image from "next/image";
import Stepper from "@/components/Stepper";
import sectionBackground from "@/images/section-background.png";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import formatCurrency from "@/utils/formatCurrency";
import { BsArrowRight } from "react-icons/bs";
import { FaChild, FaUser, FaPhone } from "react-icons/fa";
import { BsCalendar, BsGenderAmbiguous } from "react-icons/bs";
import { Input } from "@nextui-org/react";
import { DateInput } from "@nextui-org/react";
import { Select, SelectItem } from "@nextui-org/select";
import { useOverlay } from "@/context/OverlayContext";
import { useNotification } from "@/context/NotificationContext";
import { PassengerInfo } from "@/data/types";
import { CalendarDate } from "@nextui-org/react";

const CheckingTicketInfo = () => {
  const router = useRouter();
  const { setLoading } = useOverlay();
  const flight = useSelector((state: RootState) => state.flight.selectedFlight);
  const { showNotification } = useNotification();

  const [passengers, setPassengers] = useState<PassengerInfo[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }[]>([]);
  const [valueDate, setValueDate] = useState<(CalendarDate | null)[]>([]);

  useEffect(() => {
    if (!flight) {
      router.push("/not-found");
    } else {
      const totalPassengers = flight.adults + flight.children;
      const initialPassengers = Array(totalPassengers).fill({
        firstName: "",
        lastName: "",
        phone: "",
        gender: "male",
        dob: "",
      });
      setPassengers(initialPassengers);
      setErrors(
        initialPassengers.map(() => ({
          firstName: "",
          lastName: "",
          phone: "",
          dob: "",
          gender: "",
        }))
      );
      setValueDate(Array(flight.adults + flight.children).fill(null));
    }
  }, [flight, router]);

  if (!flight) {
    return null;
  }

  const validateField = (field: keyof PassengerInfo, value: string, isAdult: boolean) => {
    let error = "";
    if (!value.trim()) {
      error = `${field} is required`;
    }
    if (field === "phone") {
      error = isAdult && (!value || !/^\d{10}$/.test(value)) ? "Invalid phone number" : "";
    }
    return error;
  };

  const onInputChange = (index: number, field: keyof PassengerInfo, value: string) => {
    const isAdult = index < flight.adults;

    setPassengers((prev) => prev.map((passenger, i) => (i === index ? { ...passenger, [field]: value } : passenger)));

    setErrors((prev) =>
      prev.map((error, i) => (i === index ? { ...error, [field]: validateField(field, value, isAdult) } : error))
    );
  };

  const handleDateChange = (index: number, date: CalendarDate | null) => {
    setValueDate((prev) => prev.map((_, i) => (i === index ? date : prev[i])));
    let formattedDate = "";
    if (date) {
      const day = String(date?.day).padStart(2, "0");
      const month = String(date?.month).padStart(2, "0");
      const year = date?.year;
      formattedDate = `${day}-${month}-${year}`;
    }
    onInputChange(index, "dob", formattedDate);
  };

  const validatePassengers = () => {
    const newErrors = passengers.map((passenger, index) => {
      const isAdult = index < flight.adults;
      return {
        firstName: validateField("firstName", passenger.firstName, isAdult),
        lastName: validateField("lastName", passenger.lastName, isAdult),
        phone: validateField("phone", passenger.phone || "", isAdult),
        dob: validateField("dob", passenger.dob, isAdult),
        gender: "",
      };
    });

    setErrors(newErrors);
    return newErrors.every((error) => Object.values(error).every((message) => message === ""));
  };

  const onFinish = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (validatePassengers()) {
      setLoading(true);
      // Fake loading
      await new Promise((resolve) => setTimeout(resolve, 500));
      setLoading(false);
      showNotification("Booking successfully");
      setTimeout(() => {
        router.push("/");
      }, 500);
    }
  };

  const onCancle = () => {
    router.back();
  };

  return (
    <div>
      <div className="flex flex-col items-center justify-center bg-white md:px-12 md:py-5 px-5 py-4 w-full gap-4 md:gap-10">
        {/* stepper section */}
        <div className="w-full md:px-20 z-10 py-4">
          <Stepper currentStep={2} />
        </div>

        <div className="relative rounded-3xl lg:px-12 px-5 md:py-12 py-10 bg-gray-100 w-full flex flex-col gap-6">
          {/* Background image */}
          <div className="absolute inset-0">
            <Image alt="sectionBackground" src={sectionBackground} fill className="object-cover" />
          </div>
          {passengers.length > 0 && errors.length > 0 && valueDate.length > 0 && (
            <form className="z-10" onSubmit={onFinish}>
            <div className="flex w-full flex-col lg:flex-row gap-6 ">
              <div className="flex w-full flex-col gap-6">
                {Array.from({ length: flight.adults }).map((_, i) => (
                  <div key={i} className="flex flex-col gap-4 w-full p-4 md:p-8 bg-white rounded-2xl shadow-lg">
                    <h2 className="text-lg text-center md:text-left md:text-xl font-bold">Adult {i + 1}</h2>
                    <div className="flex flex-col gap-4 px-3 pb-2">
                      <div className="flex md:flex-row flex-col gap-4 items-start">
                        <Input
                          label="First name"
                          labelPlacement="outside"
                          startContent={<FaUser className="text-gray-400" />}
                          type="text"
                          variant="bordered"
                          name="firstName"
                          onChange={(e) => onInputChange(i, "firstName", e.target.value)}
                          isInvalid={!!errors[i].firstName}
                          errorMessage={errors[i].firstName}
                          isRequired
                          classNames={{
                            input: "border-0 focus:ring-0",
                            label:
                              " group-data-[filled-within=true]:ml-3 group-data-[filled-within=true]:text-xs group-data-[filled-within=true]:text-gray-500",
                          }}
                        />

                        <Input
                          label="Last name"
                          labelPlacement="outside"
                          startContent={<FaUser className="text-gray-400" />}
                          type="text"
                          variant="bordered"
                          name="lastName"
                          onChange={(e) => onInputChange(i, "lastName", e.target.value)}
                          isInvalid={!!errors[i].lastName}
                          errorMessage={errors[i].lastName}
                          isRequired
                          classNames={{
                            input: "border-0 focus:ring-0",
                            label:
                              " group-data-[filled-within=true]:ml-3 group-data-[filled-within=true]:text-xs group-data-[filled-within=true]:text-gray-500",
                          }}
                        />
                      </div>
                      <div className="flex md:flex-row flex-col gap-4 items-start">
                        <Input
                          label="Phone"
                          labelPlacement="outside"
                          startContent={<FaPhone className="text-gray-400" />}
                          type="tel"
                          variant="bordered"
                          name="phone"
                          maxLength={10}
                          onChange={(e) => onInputChange(i, "phone", e.target.value)}
                          isInvalid={!!errors[i].phone}
                          errorMessage={errors[i].phone}
                          isRequired
                          classNames={{
                            input: "border-0 focus:ring-0",
                            label:
                              " group-data-[filled-within=true]:ml-3 group-data-[filled-within=true]:text-xs group-data-[filled-within=true]:text-gray-500",
                          }}
                        />

                        <Select
                          defaultSelectedKeys={["Male"]}
                          label="Gender"
                          labelPlacement="outside"
                          startContent={<BsGenderAmbiguous className="text-gray-400" />}
                          variant="bordered"
                          name="gender"
                          isRequired
                          onChange={(e) => onInputChange(i, "gender", e.target.value)}
                          isInvalid={!!errors[i].gender}
                          errorMessage={errors[i].gender}
                          classNames={{
                            base: "border-0 focus:ring-0",
                            label:
                              " group-data-[filled=true]:ml-3 group-data-[filled=true]:text-xs group-data-[filled=true]:text-gray-500",
                          }}>
                          {["Male", "Female"].map((gender) => (
                            <SelectItem key={gender}>{gender}</SelectItem>
                          ))}
                        </Select>

                        <DateInput
                          className="mt-0.5"
                          label="Birthdate"
                          labelPlacement="outside"
                          variant="bordered"
                          name="dob"
                          value={valueDate[i]}
                          onChange={(date) => handleDateChange(i, date)}
                          isInvalid={!!errors[i].dob}
                          errorMessage={errors[i].gender}
                          isRequired
                          startContent={<BsCalendar className="text-gray-400" />}
                          classNames={{ label: "ml-3 text-xs text-gray-500" }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                {flight.children > 0 &&
                  Array.from({ length: flight.children }).map((_, i) => (
                    <div key={i} className="flex flex-col gap-4 w-full p-4 md:p-8 bg-white rounded-2xl shadow-lg">
                      <h2 className="text-lg md:text-xl text-center md:text-left font-bold">Child {i + 1}</h2>
                      <div className="flex flex-col gap-4 px-3 pb-2">
                        <div className="flex md:flex-row flex-col gap-4 items-start">
                          <Input
                            label="First name"
                            labelPlacement="outside"
                            startContent={<FaUser className="text-gray-400" />}
                            type="text"
                            variant="bordered"
                            name="firstName"
                            onChange={(e) => onInputChange(flight.adults + i, "firstName", e.target.value)}
                            isInvalid={!!errors[flight.adults + i].firstName}
                            errorMessage={errors[flight.adults + i].firstName}
                            isRequired
                            classNames={{
                              input: "border-0 focus:ring-0",
                              label:
                                " group-data-[filled-within=true]:ml-3 group-data-[filled-within=true]:text-xs group-data-[filled-within=true]:text-gray-500",
                            }}
                          />

                          <Input
                            label="Last name"
                            labelPlacement="outside"
                            startContent={<FaUser className="text-gray-400" />}
                            type="text"
                            variant="bordered"
                            name="lastName"
                            onChange={(e) => onInputChange(flight.adults + i, "lastName", e.target.value)}
                            isInvalid={!!errors[flight.adults + i].lastName}
                            errorMessage={errors[flight.adults + i].lastName}
                            isRequired
                            classNames={{
                              input: "border-0 focus:ring-0",
                              label:
                                " group-data-[filled-within=true]:ml-3 group-data-[filled-within=true]:text-xs group-data-[filled-within=true]:text-gray-500",
                            }}
                          />
                        </div>
                        <div className="flex md:flex-row flex-col gap-4 items-start">
                          <Select
                            defaultSelectedKeys={["Male"]}
                            label="Gender"
                            labelPlacement="outside"
                            startContent={<BsGenderAmbiguous className="text-gray-400" />}
                            variant="bordered"
                            name="gender"
                            isRequired
                            onChange={(e) => onInputChange(flight.adults + i, "gender", e.target.value)}
                            isInvalid={!!errors[flight.adults + i].gender}
                            errorMessage={errors[flight.adults + i].gender}
                            classNames={{
                              base: "border-0 focus:ring-0",
                              label:
                                " group-data-[filled=true]:ml-3 group-data-[filled=true]:text-xs group-data-[filled=true]:text-gray-500",
                            }}>
                            {["Male", "Female"].map((gender) => (
                              <SelectItem key={gender}>{gender}</SelectItem>
                            ))}
                          </Select>

                          <DateInput
                            className="mt-0.5"
                            label="Birthdate"
                            labelPlacement="outside"
                            variant="bordered"
                            name="dob"
                            value={valueDate[flight.adults + i]}
                            onChange={(date) => handleDateChange(flight.adults + i, date)}
                            isInvalid={!!errors[flight.adults + i].dob}
                            errorMessage={errors[flight.adults + i].dob}
                            isRequired
                            startContent={<BsCalendar className="text-gray-400" />}
                            classNames={{ label: "ml-3 text-xs text-gray-500" }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
              <div className="flex flex-col w-full md:w-2/3 gap-6">
                <div className="flex flex-col w-full p-4 md:p-8 gap-2 md:gap-4 bg-white rounded-2xl shadow-lg">
                  <h3 className="text-lg md:text-2xl font-bold">Booking Summary</h3>
                  <span className="text-gray-600 italic md:text-md text-sm">
                    {flight.departureDate} &#45; {flight.arrivalDate}
                  </span>
                  <div className=" border-t-2 border-dashed border-gray-300"></div>
                  <div className="flex justify-between">
                    <div className="text-gray-600">Flight</div>
                    <div className="flex font-semibold">
                      {flight.sectors.map((sector, index) => (
                        <span key={index} className="flex items-center">
                          {sector}
                          {index < flight.sectors.length - 1 && <BsArrowRight className="text-gray-600 mx-2" />}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div className="text-gray-600">Departure</div>
                    <div className="font-semibold">{flight.departureTime}</div>
                  </div>
                  <div className="flex justify-between">
                    <div className="text-gray-600">Arrival</div>
                    <div className="font-semibold">{flight.arrivalTime}</div>
                  </div>
                  <div className="flex justify-between">
                    <div className="text-gray-600">Duration</div>
                    <div className="font-semibold">{flight.totalTime}</div>
                  </div>
                  <div className="flex justify-between">
                    <div className="text-gray-600">Adult</div>
                    <div className="font-semibold flex items-center gap-1">
                      {flight.adults} x <FaUser className="text-gray-600 pb-0.5" />{" "}
                    </div>
                  </div>
                  {flight.children > 0 && (
                    <div className="flex justify-between">
                      <div className="text-gray-600">Child</div>
                      <div className="font-semibold flex items-center gap-1">
                        {flight.children} x <FaChild className="text-gray-600 pb-0.5" />{" "}
                      </div>
                    </div>
                  )}
                  <div className=" border-t-2 border-dashed border-gray-300"></div>

                  <div className="flex justify-between">
                    <h3 className="text-lg md:text-2xl font-bold">Total Price</h3>
                    <div className="text-lg md:text-2xl font-bold text-primary-500">{formatCurrency(flight.price)}</div>
                  </div>
                </div>
                <button
                  type="submit"
                  className="text-white py-2 md:text-lg bg-primary-500 rounded-xl hover:bg-primary-700">
                  Book
                </button>
                <button
                  onClick={onCancle}
                  className="text-white py-2 md:text-lg bg-[#E98383] rounded-xl hover:bg-danger-700">
                  Cancel
                </button>
              </div>
            </div>
          </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckingTicketInfo;
