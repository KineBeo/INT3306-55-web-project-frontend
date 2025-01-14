"use client";

import React, { useState, useRef, useEffect } from "react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import LocationInput from "../LocationInput";
import InputNumber from "@/components/InputNumber";
import FlightDateRangeInput from "../FlightDateRangeInput";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useRouter, usePathname } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchAirports } from "@/redux/airport/thunks";
import { setSearch } from "@/redux/search/searchSlice";
import useOutsideClick from "@/hooks/useOutsideClick";

export interface GuestsObject {
  guestAdults: number;
  guestChildren: number;
  guestInfants: number;
}

const flightClassList = [
  {
    name: "Economy",
    value: "ECONOMY",
    href: "##",
  },
  {
    name: "Business",
    value: "BUSINESS",
    href: "##",
  },
  {
    name: "First Class",
    value: "FIRST_CLASS",
    href: "##",
  },
];

const SearchForm2Mobile = () => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { fromLocation, toLocation, ticketType, flightClass, outboundDate, returnDate, adults, children, infants } =
    useAppSelector((state) => state.search);
  const { airports } = useAppSelector((state) => state.airport);

  const [dropOffLocationType, setDropOffLocationType] = useState<"ONE_WAY" | "ROUND_TRIP">("ONE_WAY");
  const [flightClassState, setFlightClassState] = useState("ECONOMY");
  const [guestAdultsInputValue, setGuestAdultsInputValue] = useState(1);
  const [guestChildrenInputValue, setGuestChildrenInputValue] = useState(0);
  const [guestInfantsInputValue, setGuestInfantsInputValue] = useState(0);
  const [departure_airport_code, setDeparture_airport_code] = useState("");
  const [arrival_airport_code, setArrival_airport_code] = useState("");
  const [date, setDate] = useState<string[]>([]);

  useEffect(() => {
    setDropOffLocationType(ticketType);
    setFlightClassState(flightClass);
    setGuestAdultsInputValue(adults);
    setGuestChildrenInputValue(children);
    setGuestInfantsInputValue(infants);
    setDeparture_airport_code(fromLocation);
    setArrival_airport_code(toLocation);
  }, [ticketType, flightClass, adults, children, infants, fromLocation, toLocation]);

  useEffect(() => {
    if (!airports.length) {
      dispatch(fetchAirports());
    }
  }, [dispatch, airports]);

  const handleChangeData = (value: number, type: keyof GuestsObject) => {
    const newValue = {
      guestAdults: guestAdultsInputValue,
      guestChildren: guestChildrenInputValue,
      guestInfants: guestInfantsInputValue,
    };
    if (type === "guestAdults") {
      setGuestAdultsInputValue(value);
      newValue.guestAdults = value;
    }
    if (type === "guestChildren") {
      setGuestChildrenInputValue(value);
      newValue.guestChildren = value;
    }
    if (type === "guestInfants") {
      setGuestInfantsInputValue(value);
      newValue.guestInfants = value;
    }
  };

  const totalGuests = guestChildrenInputValue + guestAdultsInputValue + guestInfantsInputValue;

  const ref = useRef<HTMLDivElement>(null);
  const [showRadio, setShowRadio] = useState(false);
  useOutsideClick(ref, () => {
    setShowRadio(false);
  });

  const renderGuest = () => {
    return (
      <div>
        <Dropdown portalContainer={ref.current as HTMLElement} placement="bottom-start">
          <DropdownTrigger>
            <button
              className={`px-4 py-1.5 rounded-md inline-flex items-center font-medium hover:text-opacity-100 focus:outline-none text-xs`}>
              <span>{`${totalGuests || ""} Guests`}</span>
              <ChevronDownIcon
                className="text-opacity-70 ml-2 h-4 w-4 group-hover:text-opacity-80 transition ease-in-out duration-150"
                aria-hidden="true"
              />
            </button>
          </DropdownTrigger>
          <DropdownMenu shouldFocusWrap={false} closeOnSelect={false}>
            <DropdownItem textValue="Adults" className="no-hover no-focus">
              <InputNumber
                className="w-full"
                defaultValue={guestAdultsInputValue}
                onChange={(value) => handleChangeData(value, "guestAdults")}
                max={10}
                min={1}
                label="Adults"
                desc="Ages 13 or above"
              />
            </DropdownItem>
            <DropdownItem textValue="Children" className="no-hover no-focus">
              <InputNumber
                className="w-full mt-6"
                defaultValue={guestChildrenInputValue}
                onChange={(value) => handleChangeData(value, "guestChildren")}
                max={4}
                label="Children"
                desc="Ages 2–12"
              />
            </DropdownItem>
            <DropdownItem textValue="Infants" className="no-hover no-focus">
              <InputNumber
                className="w-full mt-6"
                defaultValue={guestInfantsInputValue}
                onChange={(value) => handleChangeData(value, "guestInfants")}
                max={4}
                label="Infants"
                desc="Ages 0–2"
              />
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    );
  };

  const [selectedKeys, setSelectedKeys] = useState(new Set(["Economy"]));

  const renderSelectClass = () => {
    return (
      <div>
        <Dropdown portalContainer={ref.current as HTMLElement} placement="bottom-start">
          <DropdownTrigger>
            <button
              className={`px-4 py-1.5 rounded-md inline-flex items-center font-medium hover:bg-gray-100 focus:outline-none text-xs`}>
              <span>{flightClassState.charAt(0).toUpperCase() + flightClassState.slice(1).toLowerCase()}</span>
              <ChevronDownIcon
                className="text-opacity-70 ml-2 h-4 w-4 group-hover:text-opacity-80 transition ease-in-out duration-150"
                aria-hidden="true"
              />
            </button>
          </DropdownTrigger>
          <DropdownMenu
            disallowEmptySelection
            selectionMode="single"
            selectedKeys={selectedKeys}
            onSelectionChange={(keys) => setSelectedKeys(new Set(keys as string))}>
            {flightClassList.map((item) => (
              <DropdownItem key={item.name} onClick={() => setFlightClassState(item.value)} className="custom-focus">
                {item.name}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      </div>
    );
  };

  const renderRadioBtn = () => {
    return (
      <div className="flex justify-start space-x-3">
        <div
          className={`py-1.5 px-4 flex items-center rounded-full text-xs cursor-pointer select-none ${
            dropOffLocationType === "ROUND_TRIP"
              ? "bg-black shadow-black/10 shadow-lg text-white"
              : "border border-neutral-300 hover:bg-gray-100"
          }`}
          onClick={() => setDropOffLocationType("ROUND_TRIP")}>
          Round-trip
        </div>
        <div
          className={`py-1.5 px-4 flex items-center rounded-full text-xs cursor-pointer select-none ${
            dropOffLocationType === "ONE_WAY"
              ? "bg-black text-white shadow-black/10 shadow-lg"
              : "border border-neutral-300 hover:bg-gray-100"
          }`}
          onClick={() => setDropOffLocationType("ONE_WAY")}>
          One-way
        </div>
      </div>
    );
  };
  const renderFlightType = () => {
    return (
      <div className="flex flex-col w-full" ref={ref}>
        <div
          onClick={() => setShowRadio(!showRadio)}
          className={`flex flex-1 relative z-10 [ nc-Header-field-padding--small ] flex-shrink-0 items-center space-x-3 cursor-pointer focus:outline-none text-left rounded-full border-1 lg:border-0 border-neutral-200 ${
            showRadio ? "nc-Header-field-focused--2" : ""
          }`}>
          <span className="mt-0.5 text-xs md:text-sm text-neutral-400 font-light ">Flight type</span>
          <span
            className={`flex-1 text-right lg:text-left w-full bg-transparent border-none focus:ring-0 p-0 focus:outline-none focus:placeholder-neutral-400 text-xs md:text-base font-semibold placeholder-neutral-800 truncate`}>
            {dropOffLocationType}, {flightClassState}, {totalGuests} Guests
          </span>
        </div>
        {showRadio && (
          <div className="text-xs md:text-base z-40 flex flex-col gap-2 w-full min-w-[300px] bg-white top-full mt-3 py-3 sm:py-5 px-4 md:px-7 rounded-3xl border-1 border-neutral-200 shadow-xl overflow-y-auto">
            <h4 className="font-semibold mb-1">Flight type:</h4>
            {renderRadioBtn()}
            <h4 className="font-semibold mb-1">Ticket class:</h4>
            <div className="flex justify-start gap-3">
              <div className="border border-neutral-300 rounded-full">{renderSelectClass()}</div>
              <div className="border border-neutral-300 rounded-full">{renderGuest()}</div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const onFinish = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!departure_airport_code || !arrival_airport_code || !date.length) {
      return;
    }
    if (dropOffLocationType === "ROUND_TRIP") {
      dispatch(
        setSearch({
          ticketType: dropOffLocationType,
          flightClass: flightClassState as "ECONOMY" | "BUSINESS" | "FIRST_CLASS",
          fromLocation: departure_airport_code,
          toLocation: arrival_airport_code,
          outboundDate: date[0],
          returnDate: date.length > 1 ? date[1] : "",
          adults: guestAdultsInputValue,
          children: guestChildrenInputValue,
          infants: guestInfantsInputValue,
        })
      );
      router.push(
        `/booking/find-flight?ticket_type=${dropOffLocationType}&booking_class=${flightClassState}&departure_airport_code=${departure_airport_code}&arrival_airport_code=${arrival_airport_code}&outbound_day=${date[0]}&return_day=${date[1]}&adults=${guestAdultsInputValue}&children=${guestChildrenInputValue}&infants=${guestInfantsInputValue}`
      );
    } else {
      dispatch(
        setSearch({
          ticketType: dropOffLocationType,
          flightClass: flightClassState as "ECONOMY" | "BUSINESS" | "FIRST_CLASS",
          fromLocation: departure_airport_code,
          toLocation: arrival_airport_code,
          outboundDate: date[0],
          returnDate: "",
          adults: guestAdultsInputValue,
          children: guestChildrenInputValue,
          infants: guestInfantsInputValue,
        })
      );
      router.push(
        `/booking/find-flight?ticket_type=${dropOffLocationType}&booking_class=${flightClassState}&departure_airport_code=${departure_airport_code}&arrival_airport_code=${arrival_airport_code}&outbound_day=${date[0]}&adults=${guestAdultsInputValue}&children=${guestChildrenInputValue}&infants=${guestInfantsInputValue}`
      );
    }
  };

  const renderForm = () => {
    return (
      <div>
        <form onSubmit={onFinish} className="w-full relative ">
          <div className="flex flex-col items-center gap-4 w-full px-6 md:px-20 py-2 md:py-4 bg-white overflow-scroll">
            {renderFlightType()}
            <LocationInput
              placeHolder="Add Location"
              desc="Flying from"
              className="flex-1 w-full"
              defaultLocationCode={pathname === "/booking/find-flight" ? fromLocation : ""}
              onInputDone={(value) => {
                setDeparture_airport_code(value);
              }}
            />
            <LocationInput
              placeHolder="Add Location"
              desc="Flying to"
              className="flex-1 w-full"
              defaultLocationCode={pathname === "/booking/find-flight" ? toLocation : ""}
              onInputDone={(value) => {
                setArrival_airport_code(value);
              }}
            />
            <FlightDateRangeInput
              selectsRange={dropOffLocationType !== "ONE_WAY"}
              className="flex-1 w-full"
              defaultStart={pathname === "/booking/find-flight" ? outboundDate : ""}
              defaultEnd={pathname === "/booking/find-flight" ? returnDate : ""}
              onInputDone={(dates) => {
                setDate(dates);
              }}
            />
            <button
              type="submit"
              className="p-2 flex self-end rounded-2xl bg-primary-500 text-white items-center text-sm md:text-base hover:bg-primary-6000">
              <MagnifyingGlassIcon className="w-8 h-8" />
              <span className="pl-2">Search</span>
            </button>
          </div>
        </form>
      </div>
    );
  };

  return renderForm();
};

export default SearchForm2Mobile;
