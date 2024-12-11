"use client";

import React, { useState, useRef, useEffect } from "react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import LocationInput from "@/components/Header/HeaderSearch/LocationInput";
import InputNumber from "@/components/InputNumber";
import FlightDateRangeInput from "@/components/Header/HeaderSearch/FlightDateRangeInput";
import ButtonSubmit from "@/shared/ButtonSubmit";
import { useRouter } from "next/navigation";
import { useOverlay } from "@/context/OverlayContext";
import { useAppDispatch } from "@/redux/hooks";
import { fetchAirports } from "@/redux/airport/thunks";

export interface GuestsObject {
  guestAdults: number;
  guestChildren: number;
  guestInfants: number;
}

const flightClass = [
  {
    name: "Economy",
    href: "##",
  },
  {
    name: "Business",
    href: "##",
  },
  {
    name: "Multiple",
    href: "##",
  },
];

interface SearchFormProps {
  align?: "start" | "center" | "end";
}

const SearchForm = ({ align }: SearchFormProps) => {
  const router = useRouter();
  const { setLoading } = useOverlay();

  const [dropOffLocationType, setDropOffLocationType] = useState<"roundTrip" | "oneWay" | "">("roundTrip");
  const [flightClassState, setFlightClassState] = useState("Economy");
  const [guestAdultsInputValue, setGuestAdultsInputValue] = useState(2);
  const [guestChildrenInputValue, setGuestChildrenInputValue] = useState(1);
  const [guestInfantsInputValue, setGuestInfantsInputValue] = useState(1);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchAirports());
  }, [dispatch]);

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

  const renderGuest = () => {
    return (
      <div>
        <Dropdown portalContainer={ref.current as HTMLElement}>
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

  const RenderSelectClass = () => {
    const [selectedKeys, setSelectedKeys] = useState(new Set(["Economy"]));

    return (
      <div>
        <Dropdown portalContainer={ref.current as HTMLElement}>
          <DropdownTrigger>
            <button
              className={`px-4 py-1.5 rounded-md inline-flex items-center font-medium hover:bg-gray-100 focus:outline-none text-xs`}>
              <span>{`${flightClassState}`}</span>
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
            {flightClass.map((item) => (
              <DropdownItem key={item.name} onClick={() => setFlightClassState(item.name)} className="custom-focus">
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
      <div className={`pb-3 flex space-x-3 ${align ? `justify-${align}` : "justify-center"}`}>
        <div
          className={`py-1.5 px-4 flex items-center rounded-full font-medium text-xs cursor-pointer select-none ${
            dropOffLocationType === "roundTrip"
              ? "bg-black shadow-black/10 shadow-lg text-white"
              : "border border-neutral-300 hover:bg-gray-100"
          }`}
          onClick={() => setDropOffLocationType("roundTrip")}>
          Round-trip
        </div>
        <div
          className={`py-1.5 px-4 flex items-center rounded-full font-medium text-xs cursor-pointer select-none ${
            dropOffLocationType === "oneWay"
              ? "bg-black text-white shadow-black/10 shadow-lg"
              : "border border-neutral-300 hover:bg-gray-100"
          }`}
          onClick={() => setDropOffLocationType("oneWay")}>
          One-way
        </div>

        <div className=" border-r border-slate-200"></div>

        <div className="border border-neutral-300 rounded-full">{RenderSelectClass()}</div>
        <div className="border border-neutral-300 rounded-full">{renderGuest()}</div>
      </div>
    );
  };

  const onFinish = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Gọi API
      router.push("/booking/find-flight");
      //   if (result.success) {
      //     router.push("/...");
      //   }
    } catch (error) {
      console.error("API call failed", error);
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  const renderForm = () => {
    return (
      <div ref={ref}>
        <form onSubmit={onFinish} className="w-full relative">
          {renderRadioBtn()}
          <div className="flex items-center w-full rounded-full border border-neutral-200 bg-white mt-4">
            <LocationInput placeHolder="Add Location" desc="Flying from" className="flex-1" />
            <div className="self-center border-r border-slate-200 h-8"></div>
            <LocationInput placeHolder="Add Location" desc="Flying to" className="flex-1" />
            <div className="self-center border-r border-slate-200 h-8"></div>
            <FlightDateRangeInput selectsRange={dropOffLocationType !== "oneWay"} className="flex-1" />
            <div className="pr-2 xl:pr-4">
              <ButtonSubmit />
            </div>
          </div>
        </form>
      </div>
    );
  };

  return renderForm();
};

export default SearchForm;
