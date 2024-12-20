/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { FormEvent, useState, useEffect, useRef } from "react";
import Image from "next/image";
import Stepper from "@/components/Stepper";
import sectionBackground from "@/images/section-background.png";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useRouter, notFound } from "next/navigation";
import formatCurrency from "@/utils/formatCurrency";
import { BsArrowRight } from "react-icons/bs";
import { FaChild, FaUser, FaBaby, FaFlag, FaIdCard } from "react-icons/fa";
import { BsCalendar } from "react-icons/bs";
import { Input } from "@nextui-org/react";
import { DateInput } from "@nextui-org/react";
import { useOverlay } from "@/context/OverlayContext";
import { useNotification } from "@/context/NotificationContext";
import { CreateTicketPassenger } from "@/types/ticketPassenger";
import { CalendarDate } from "@nextui-org/react";
import DemoPay, { HandlePay } from "./demoPay";
import api from "@/services/apiClient";
import { formatTime, formatDateToYYYYMMDD2 } from "@/utils/formatDate";
import { intervalToDuration } from "date-fns";

const CheckingTicketInfo = () => {
  const router = useRouter();
  const { setLoading } = useOverlay();
  const { tickets, adults, children, infants, totalPrice } = useSelector((state: RootState) => state.tickets);

  const { showNotification } = useNotification();

  const [passengers, setPassengers] = useState<CreateTicketPassenger[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }[]>([]);
  const [valueDate, setValueDate] = useState<(CalendarDate | null)[]>([]);

  const payRef = useRef<HandlePay>(null);

  useEffect(() => {
    if (!tickets || adults === 0) {
      notFound();
    } else {
      const adultPassengers: CreateTicketPassenger[] = Array.from({ length: adults }).map(() => ({
        passenger_type: "ADULT",
        full_name: "",
        cccd: "",
        associated_adult_id: null,
        ticket_id: 0,
        birthday: "",
        country_code: "",
      }));

      const childrenPassengers: CreateTicketPassenger[] = Array.from({ length: children }).map(() => ({
        passenger_type: "CHILD",
        full_name: "",
        cccd: "",
        associated_adult_id: null,
        ticket_id: 0,
        birthday: "",
        country_code: "",
      }));

      const infantPassengers: CreateTicketPassenger[] = Array.from({ length: infants }).map(() => ({
        passenger_type: "INFANT",
        full_name: "",
        cccd: "",
        associated_adult_id: 0,
        ticket_id: 0,
        birthday: "",
        country_code: "",
      }));

      const initialPassengers = [...adultPassengers, ...childrenPassengers, ...infantPassengers];
      initialPassengers.forEach((passenger, index) => {
        passenger.ticket_id = tickets[index].id;
      });

      setPassengers(initialPassengers);

      setErrors(
        initialPassengers.map(() => ({
          full_name: "",
          cccd: "",
          birthday: "",
          country_code: "",
          associated_adult_id: "",
        }))
      );
      setValueDate(Array(adults + children + infants).fill(null));
    }
  }, [tickets, adults, children, infants, router]);

  const validateField = (field: keyof CreateTicketPassenger, value: string, isInfant: boolean) => {
    let error = "";
    if (!value.trim()) {
      error = "This field is required";
    }
    if (field === "associated_adult_id") {
      error = isInfant && !value ? "This field is required" : "";
    }
    return error;
  };

  const onInputChange = (index: number, field: keyof CreateTicketPassenger, value: string) => {
    const isInfant = index >= adults + children;

    setPassengers((prev) => prev.map((passenger, i) => (i === index ? { ...passenger, [field]: value } : passenger)));

    setErrors((prev) =>
      prev.map((error, i) => (i === index ? { ...error, [field]: validateField(field, value, isInfant) } : error))
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
    onInputChange(index, "birthday", formattedDate);
  };

  const validatePassengers = () => {
    const newErrors = passengers.map((passenger, index) => {
      const isInfant = index >= adults + children;
      return {
        full_name: validateField("full_name", passenger.full_name, isInfant),
        cccd: validateField("cccd", passenger.cccd, isInfant),
        birthday: validateField("birthday", passenger.birthday, isInfant),
        country_code: validateField("country_code", passenger.country_code, isInfant),
        associated_adult_id: validateField(
          "associated_adult_id",
          passenger.associated_adult_id?.toString() || "",
          isInfant
        ),
      };
    });

    setErrors(newErrors);
    return newErrors.every((error) => Object.values(error).every((message) => message === ""));
  };

  const onFinish = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const isValidPassenger = validatePassengers();
    const isValidPayment = payRef.current && payRef.current.validate();
    if (isValidPassenger && isValidPayment) {
      try {
        setLoading(true);

        // create adult first
        const adultPassengers = passengers.slice(0, adults);
        const childrenPassengers = passengers.slice(adults, adults + children);
        const infantPassengers = passengers.slice(adults + children, adults + children + infants);

        let adult_id = 0;
        for (const passenger of adultPassengers) {
          const response = await api.post("/ticket-passenger", passenger);
          adult_id = response.data.id;
        }

        for (const passenger of childrenPassengers) {
          await api.post("/ticket-passenger", passenger);
        }

        for (const passenger of infantPassengers) {
          await api.post("/ticket-passenger", { ...passenger, associated_adult_id: adult_id });
        }

        for (const ticket of tickets) {
          await api.patch("/ticket/book/" + ticket.id);
        }
        showNotification("Booking successfully");
        setTimeout(() => {
          router.replace("/");
        }, 500);
        /* eslint-disable @typescript-eslint/no-explicit-any */
      } catch (err: any) {
        showNotification(err.response.data.message, "error");
      } finally {
        setLoading(false);
      }
    }
  };

  const onCancle = () => {
    router.back();
  };

  const renderBookingSummary = () => {
    return (
      <div className="flex flex-col w-full p-4 md:p-8 gap-2 md:gap-4 bg-white rounded-2xl shadow-lg">
        <h3 className="text-lg md:text-2xl font-bold">Booking Summary</h3>
        <span className="text-neutral-600 italic md:text-md text-sm">
          Outbound Date: {formatDateToYYYYMMDD2(tickets[0].outboundFlight.departure_time)} &#45;{" "}
          {formatDateToYYYYMMDD2(tickets[0].outboundFlight.departure_time)}
        </span>
        {tickets[0].returnFlight && tickets[0].ticket_type === "ROUND_TRIP" && (
          <span className="text-neutral-600 italic md:text-md text-sm">
            Return Date: {formatDateToYYYYMMDD2(tickets[0].returnFlight.departure_time)} &#45;{" "}
            {formatTime(tickets[0].returnFlight.departure_time)}
          </span>
        )}
        <div className=" border-t-2 border-dashed border-neutral-300"></div>
        <div className="flex justify-between">
          <div className="text-neutral-600">Outbound Flight</div>
          <div className="flex font-semibold">
            <span className="flex items-center">
              {tickets[0].outboundFlight.departure_airport.city}
              <BsArrowRight className="text-neutral-600 mx-2" />
              {tickets[0].outboundFlight.arrival_airport.city}
            </span>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="text-neutral-600">Departure</div>
          <div className="font-semibold">{formatTime(tickets[0].outboundFlight.departure_time)}</div>
        </div>
        <div className="flex justify-between">
          <div className="text-neutral-600">Arrival</div>
          <div className="font-semibold">{formatTime(tickets[0].outboundFlight.arrival_time)}</div>
        </div>
        <div className="flex justify-between">
          <div className="text-neutral-600">Duration</div>
          <div className="font-semibold">{`${
            intervalToDuration({
              start: new Date(tickets[0].outboundFlight.departure_time),
              end: new Date(tickets[0].outboundFlight.arrival_time),
            }).hours
          }h ${
            intervalToDuration({
              start: new Date(tickets[0].outboundFlight.departure_time),
              end: new Date(tickets[0].outboundFlight.arrival_time),
            }).minutes ?? 0
          }m`}</div>
        </div>

        {tickets[0].returnFlight && tickets[0].ticket_type === "ROUND_TRIP" && tickets[0].returnFlight && (
          <>
            <div className="px-8 border-t-2 border-dashed border-neutral-300"></div>
            <div className="flex justify-between">
              <div className="text-neutral-600">Return Flight</div>
              <div className="flex font-semibold">
                <span className="flex items-center">
                  {tickets[0].returnFlight.departure_airport.city}
                  <BsArrowRight className="text-neutral-600 mx-2" />
                  {tickets[0].returnFlight.arrival_airport.city}
                </span>
              </div>
            </div>
            <div className="flex justify-between">
              <div className="text-neutral-600">Departure</div>
              <div className="font-semibold">{formatTime(tickets[0].returnFlight.departure_time)}</div>
            </div>
            <div className="flex justify-between">
              <div className="text-neutral-600">Arrival</div>
              <div className="font-semibold">{formatTime(tickets[0].returnFlight.arrival_time)}</div>
            </div>
            <div className="flex justify-between">
              <div className="text-neutral-600">Duration</div>
              <div className="font-semibold">{`${
                intervalToDuration({
                  start: new Date(tickets[0].returnFlight.departure_time),
                  end: new Date(tickets[0].returnFlight.arrival_time),
                }).hours
              }h ${
                intervalToDuration({
                  start: new Date(tickets[0].returnFlight.departure_time),
                  end: new Date(tickets[0].returnFlight.arrival_time),
                }).minutes ?? 0
              }m`}</div>
            </div>
          </>
        )}

        <div className="flex justify-between">
          <div className="text-neutral-600">Adult</div>
          <div className="font-semibold flex items-center gap-1">
            {adults} x <FaUser className="text-neutral-600 pb-0.5" />{" "}
          </div>
        </div>
        {children > 0 && (
          <div className="flex justify-between">
            <div className="text-neutral-600">Child</div>
            <div className="font-semibold flex items-center gap-1">
              {children} x <FaChild className="text-neutral-600 pb-0.5" />{" "}
            </div>
          </div>
        )}
        {infants > 0 && (
          <div className="flex justify-between">
            <div className="text-neutral-600">Infant</div>
            <div className="font-semibold flex items-center gap-1">
              {infants} x <FaBaby className="text-neutral-600 pb-0.5" />{" "}
            </div>
          </div>
        )}
        <div className=" border-t-2 border-dashed border-neutral-300"></div>

        <div className="flex justify-between">
          <h3 className="text-lg md:text-2xl font-bold">Total Price</h3>
          <div className="text-lg md:text-2xl font-bold text-primary-500">{formatCurrency(totalPrice)} VND</div>
        </div>
      </div>
    );
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
                  {passengers.map((passenger, i) => (
                    <div key={i} className="flex flex-col gap-4 w-full p-4 md:p-8 bg-white rounded-2xl shadow-lg">
                      <h2 className="text-lg text-center md:text-left md:text-xl font-bold">
                        {i < adults
                          ? "Adult " + (i + 1).toString()
                          : i < adults + children
                          ? "Child " + (i + 1 - adults).toString()
                          : "Infant " + (i + 1 - adults - children)}
                      </h2>
                      <div className="flex flex-col gap-4 px-3 pb-2">
                        <div className="flex md:flex-row flex-col gap-4 items-start">
                          <Input
                            label="Full name"
                            labelPlacement="outside"
                            startContent={<FaUser className="text-neutral-400" />}
                            type="text"
                            variant="bordered"
                            name="full_name"
                            onChange={(e) => onInputChange(i, "full_name", e.target.value)}
                            isInvalid={!!errors[i].full_name}
                            errorMessage={errors[i].full_name}
                            isRequired
                            classNames={{
                              input: "border-0 focus:ring-0",
                              label:
                                " group-data-[filled-within=true]:ml-3 group-data-[filled-within=true]:text-xs group-data-[filled-within=true]:text-neutral-500",
                            }}
                          />

                          <Input
                            label="Indentity Card"
                            labelPlacement="outside"
                            startContent={<FaIdCard className="text-neutral-400" />}
                            type="text"
                            variant="bordered"
                            name="cccd"
                            onChange={(e) => onInputChange(i, "cccd", e.target.value)}
                            isInvalid={!!errors[i].cccd}
                            errorMessage={errors[i].cccd}
                            isRequired
                            classNames={{
                              input: "border-0 focus:ring-0",
                              label:
                                " group-data-[filled-within=true]:ml-3 group-data-[filled-within=true]:text-xs group-data-[filled-within=true]:text-neutral-500",
                            }}
                          />
                        </div>
                        <div className="flex md:flex-row flex-col gap-4 items-start">
                          <DateInput
                            className="mt-0.5"
                            label="Birthday"
                            labelPlacement="outside"
                            variant="bordered"
                            name="birthday"
                            value={valueDate[i]}
                            onChange={(date) => handleDateChange(i, date)}
                            isInvalid={!!errors[i].birthday}
                            errorMessage={errors[i].birthday}
                            startContent={<BsCalendar className="text-neutral-400" />}
                            classNames={{ label: "ml-3 text-xs text-neutral-500" }}
                          />

                          <Input
                            label="Country Code"
                            labelPlacement="outside"
                            startContent={<FaFlag className="text-neutral-400" />}
                            type="text"
                            variant="bordered"
                            name="country_code"
                            onChange={(e) => onInputChange(i, "country_code", e.target.value)}
                            isInvalid={!!errors[i].country_code}
                            errorMessage={errors[i].country_code}
                            isRequired
                            classNames={{
                              input: "border-0 focus:ring-0",
                              label:
                                " group-data-[filled-within=true]:ml-3 group-data-[filled-within=true]:text-xs group-data-[filled-within=true]:text-neutral-500",
                            }}
                          />

                          {/* <Select
                            defaultSelectedKeys={["Male"]}
                            label="Gender"
                            labelPlacement="outside"
                            startContent={<BsGenderAmbiguous className="text-neutral-400" />}
                            variant="bordered"
                            name="gender"
                            isRequired
                            onChange={(e) => onInputChange(i, "gender", e.target.value)}
                            isInvalid={!!errors[i].gender}
                            errorMessage={errors[i].gender}
                            classNames={{
                              base: "border-0 focus:ring-0",
                              label:
                                " group-data-[filled=true]:ml-3 group-data-[filled=true]:text-xs group-data-[filled=true]:text-neutral-500",
                            }}>
                            {["Male", "Female"].map((gender) => (
                              <SelectItem key={gender}>{gender}</SelectItem>
                            ))}
                          </Select> */}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col w-full md:w-2/3 gap-6">
                  {renderBookingSummary()}
                  <DemoPay ref={payRef} />

                  <button
                    type="submit"
                    className="text-white py-2 md:text-lg bg-primary-500 rounded-xl hover:bg-primary-700">
                    Book now
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
