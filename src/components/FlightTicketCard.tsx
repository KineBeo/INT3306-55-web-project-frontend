import React, { useState, useEffect } from "react";
import { FaPlane, FaUser, FaPlaneArrival, FaPlaneDeparture, FaChild, FaBaby } from "react-icons/fa";
import { BsCashStack, BsAirplane } from "react-icons/bs";
import { Ticket } from "@/types/ticket";
import { formatDateToYYYYMMDD2, formatTime, formatDateToDDMMYYYY } from "@/utils/formatDate";
import smallLogo from "@/images/small-logo.png";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";
import { FaCheckCircle, FaClock, FaTimesCircle, FaExclamationTriangle } from "react-icons/fa";
import Image from "next/image";
import dayjs from "dayjs";
import formatCurrency from "@/utils/formatCurrency";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { intervalToDuration } from "date-fns";
import "dayjs/locale/en";

dayjs.extend(localizedFormat);

interface FlightCardProps {
  flightTicket: Ticket;
  handleCheckIn?: () => void;
  handleCancel?: () => void;
}

const FlightTicketCard: React.FC<FlightCardProps> = ({ flightTicket, handleCheckIn, handleCancel }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isOpenCheckIn, setIsOpenCheckIn] = useState(false);
  const isRoundTrip = flightTicket.ticket_type === "ROUND_TRIP";
  const outboundFlight = flightTicket.outboundFlight;
  const returnFlight = flightTicket.returnFlight;
  const passenger = flightTicket.ticketPassengers[0];

  const [isOPenCancel, setIsOpenCancel] = useState(false);

  const duration_outbound = `${
    intervalToDuration({ start: new Date(outboundFlight.departure_time), end: new Date(outboundFlight.arrival_time) })
      .hours
  }h ${
    intervalToDuration({ start: new Date(outboundFlight.departure_time), end: new Date(outboundFlight.arrival_time) })
      .minutes ?? 0
  }m`;
  const duration_return = returnFlight
    ? `${
        intervalToDuration({ start: new Date(returnFlight.departure_time), end: new Date(returnFlight.arrival_time) })
          .hours
      }h ${
        intervalToDuration({ start: new Date(returnFlight.departure_time), end: new Date(returnFlight.arrival_time) })
          .minutes ?? 0
      }m`
    : "";

  useEffect(() => {
    setIsOpenCancel(false);
  }, [isOpen]);

  const getStatusColor = (status: "CONFIRMED" | "PENDING" | "CANCELLED") => {
    if (status === "CONFIRMED") return "text-green-600 bg-green-50 border-green-200";
    if (status === "PENDING") return "text-yellow-600 bg-yellow-50 border-yellow-200";
    if (status === "CANCELLED") return "text-red-600 bg-red-50 border-red-200";
  };

  const getStatusIcon = (status: "CONFIRMED" | "PENDING" | "CANCELLED") => {
    if (status === "CONFIRMED") return <FaCheckCircle className="text-green-600" />;
    if (status === "PENDING") return <FaClock className="text-[#ec9543]" />;
    if (status === "CANCELLED") return <FaTimesCircle className="text-red-600" />;
  };
  return (
    <>
      <Modal
        backdrop="opaque"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        scrollBehavior="inside"
        placement="center"
        size="xl"
        motionProps={{
          variants: {
            enter: {
              y: 0,
              opacity: 1,
              transition: {
                duration: 0.3,
                ease: "easeOut",
              },
            },
            exit: {
              y: -20,
              opacity: 0,
              transition: {
                duration: 0.2,
                ease: "easeIn",
              },
            },
          },
        }}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                <h3 className="font-semibold text-xl md:text-2xl text-primary-700">
                  {isOPenCancel ? (
                    <div className="flex space-x-4 items-center">
                      <div className="bg-red-50 p-3 rounded-full">
                        <FaExclamationTriangle className="text-red-600 text-xl" />
                      </div>
                      <p>Cancel Ticket & Refund</p>
                    </div>
                  ) : (
                    `${outboundFlight.departure_airport.city} - ${outboundFlight.arrival_airport.city}`
                  )}
                </h3>
              </ModalHeader>
              <ModalBody>
                {isOPenCancel ? (
                  <div className="flex flex-col gap-4">
                    <h4 className="text-lg font-semibold text-neutral-800 mb-4">Refund Calculation</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <p className="text-neutral-600">Original Ticket Price</p>
                        <p className="font-semibold">{formatCurrency(parseInt(flightTicket.total_price))} VND</p>
                      </div>
                      <div className="flex justify-between text-red-600">
                        <p>Cancellation Fee</p>
                        <p>-{formatCurrency(parseInt(flightTicket.total_price) * 0.2)} VND</p>
                      </div>
                      <div className="flex justify-between text-green-600 font-semibold">
                        <p>Total Refund Amount</p>
                        <p>
                          {formatCurrency(
                            parseInt(flightTicket.total_price) - parseInt(flightTicket.total_price) * 0.2
                          )}{" "}
                          VND
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4 md:flex-row">
                    <div className="flex flex-col gap-1">
                      <p className="text-sm text-neutral-600">
                        Departs on{" "}
                        {dayjs(outboundFlight.departure_time, "DD/MM/YYYY").locale("en").format("dddd, DD MMMM YYYY")}
                      </p>
                      <p className="text-sm text-neutral-600">
                        Arrives on{" "}
                        {dayjs(outboundFlight.arrival_time, "DD/MM/YYYY").locale("en").format("dddd, DD MMMM YYYY")}
                      </p>
                      <p className="text-sm text-neutral-700 font-semibold">Total duration: {duration_outbound}</p>

                      {/* Flight details */}
                      <div className="flex flex-col">
                        <div className="flex flex-col gap-2">
                          <div className="flex">
                            <div className="grid grid-flow-col auto-cols-auto p-4 items-center">
                              <p className="text-sm text-neutral-600 min-w-[56px]">1 Stop</p>
                              <div className="flex flex-col items-center gap-1 h-full">
                                <div className="bg-primary-700 rounded-full w-[6px] h-[6px]"></div>
                                <div className="bg-primary-700 rounded-full w-0.5 flex-1"></div>
                                <div className="bg-primary-700 rounded-full w-[6px] h-[6px]"></div>
                              </div>
                              <div className="flex flex-col gap-7 ml-4">
                                <div>
                                  <p className="font-semibold text-primary-700">
                                    {formatTime(outboundFlight.departure_time)}
                                  </p>
                                  <p className="text-neutral-700">{outboundFlight.departure_airport.city}</p>
                                  <p className="text-xs text-neutral-600">
                                    {outboundFlight.departure_airport.code} Airport
                                  </p>
                                </div>
                                <div>
                                  <p className="font-semibold text-primary-700">
                                    {formatTime(outboundFlight.arrival_time)}
                                  </p>
                                  <p className="font-normal text-neutral-700">{outboundFlight.arrival_airport.city}</p>
                                  <p className="text-xs text-neutral-600">
                                    {outboundFlight.arrival_airport.code} Airport
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-neutral-600">
                        Flight number <strong>{outboundFlight.flight_number}</strong>
                      </p>
                      <p className="text-xs text-neutral-600 flex gap-1">
                        Operated by QAirline <Image alt="logo" src={smallLogo} width={16} height={16} />
                      </p>
                      {/* <p className="text-xs text-neutral-600 uppercase">{outboundFlight.airplane.registration_number}</p> */}

                      {/* Return flight */}
                      {isRoundTrip && returnFlight && (
                        <>
                          <p className="text-sm text-neutral-700 font-semibold mt-4 pt-4 border-t-2 border-neutral-400">
                            Return Flight
                          </p>
                          <p className="text-sm text-neutral-600">
                            Departs on{" "}
                            {dayjs(returnFlight.departure_time, "DD/MM/YYYY").locale("en").format("dddd, DD MMMM YYYY")}
                          </p>
                          <p className="text-sm text-neutral-600">
                            Arrives on{" "}
                            {dayjs(returnFlight.arrival_time, "DD/MM/YYYY").locale("en").format("dddd, DD MMMM YYYY")}
                          </p>
                          <p className="text-sm text-neutral-700 font-semibold">Total duration: {duration_return}</p>

                          {/* Flight details */}
                          <div className="flex flex-col">
                            <div className="flex flex-col gap-2">
                              <div className="flex">
                                <div className="grid grid-flow-col auto-cols-auto p-4 items-center">
                                  <p className="text-sm text-neutral-600 min-w-[56px]">1 Stop</p>
                                  <div className="flex flex-col items-center gap-1 h-full">
                                    <div className="bg-primary-700 rounded-full w-[6px] h-[6px]"></div>
                                    <div className="bg-primary-700 rounded-full w-0.5 flex-1"></div>
                                    <div className="bg-primary-700 rounded-full w-[6px] h-[6px]"></div>
                                  </div>
                                  <div className="flex flex-col gap-7 ml-4">
                                    <div>
                                      <p className="font-semibold text-primary-700">
                                        {formatTime(returnFlight.departure_time)}
                                      </p>
                                      <p className="text-neutral-700">{returnFlight.departure_airport.city}</p>
                                      <p className="text-xs text-neutral-600">
                                        {returnFlight.departure_airport.code} Airport
                                      </p>
                                    </div>
                                    <div>
                                      <p className="font-semibold text-primary-700">
                                        {formatTime(returnFlight.arrival_time)}
                                      </p>
                                      <p className="font-normal text-neutral-700">
                                        {returnFlight.arrival_airport.city}
                                      </p>
                                      <p className="text-xs text-neutral-600">
                                        {returnFlight.arrival_airport.code} Airport
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <p className="text-xs text-neutral-600">
                            Flight number <strong>{returnFlight.flight_number}</strong>
                          </p>
                          <p className="text-xs text-neutral-600 flex gap-1">
                            Operated by QAirline <Image alt="logo" src={smallLogo} width={16} height={16} />
                          </p>
                          {/* <p className="text-xs text-neutral-600 uppercase">
                        {returnFlight.airplane.registration_number}
                      </p> */}
                        </>
                      )}
                    </div>
                    <div className="flex flex-col gap-1 border-t-2 md:border-l-2 md:border-t-0 pt-4 md:pt-0 md:pl-4 border-gray-200 text-sm">
                      <p className="text-primary-700">Passenger Info</p>
                      <div className="flex flex-col gap-1">
                        <p>{passenger.passenger_type.charAt(0) + passenger.passenger_type.slice(1).toLowerCase()}</p>
                        <div className="pl-6 flex flex-col gap-1">
                          <p className="text-neutral-600">Name: {passenger.full_name}</p>
                          <p className="text-neutral-600">Birthday: {formatDateToDDMMYYYY(passenger.birthday)}</p>
                          <p className="text-neutral-600">ID: {passenger.cccd}</p>
                          <p className="text-neutral-600">Country: {passenger.country_code}</p>

                          {passenger.associated_adult_id && (
                            <p className="text-neutral-600">
                              Associate with: {passenger.associated_adult_id.full_name}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <button
                  onClick={() => {
                    if (isOPenCancel) {
                      setIsOpenCancel(false);
                    } else onClose();
                  }}
                  className="text-sm md:text-md px-4 md:px-6 py-2 border-2 border-[#ec9543] text-white rounded-lg bg-[#ec9543] hover:bg-[#ffd4ab] hover:text-[#e78a34]">
                  {isOPenCancel ? "Cancel" : "Close"}
                </button>
                {flightTicket.booking_status === "PENDING" && (
                  <button
                    onClick={() => {
                      if (isOPenCancel && handleCancel) {
                        handleCancel();
                        flightTicket.booking_status = "CANCELLED";
                      } else setIsOpenCancel(true);
                    }}
                    className="text-sm md:text-md px-4 md:px-6 py-2 border-2 border-red-200 text-white rounded-lg bg-red-500 hover:bg-red-50 hover:text-red-600">
                    {isOPenCancel ? "Confirm" : "Cancel"}
                  </button>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Modal
        backdrop="opaque"
        isOpen={isOpenCheckIn}
        scrollBehavior="inside"
        placement="center"
        onClose={() => setIsOpenCheckIn(false)}
        size="xl">
        <ModalContent>
          <>
            <ModalHeader>
              <h3 className="font-semibold text-xl md:text-2xl text-primary-700">
                <div className="flex space-x-4 items-center">
                  <div className="bg-primary-100 p-3 rounded-full">
                    <FaCheckCircle className="text-primary-500 text-xl" />
                  </div>
                  <p>Confirm Online Check-in ?</p>
                </div>
              </h3>
            </ModalHeader>
            <ModalBody>
              <p className="text-neutral-600 text-base">
                Online check-in does not allow changes to the information once completed. Please double-check your
                details before proceeding with check-in.
              </p>
            </ModalBody>
            <ModalFooter>
              <button
                onClick={() => {
                  setIsOpenCheckIn(false);
                }}
                className="text-sm md:text-md px-4 md:px-6 py-2 border-2 border-[#ec9543] text-white rounded-lg bg-[#ec9543] hover:bg-[#ffd4ab] hover:text-[#e78a34]">
                Close
              </button>
              <button
                onClick={() => {
                  handleCheckIn && handleCheckIn();
                  setIsOpenCheckIn(false);
                }}
                className="text-sm md:text-md px-4 md:px-6 py-2 border-2 border-primary-100 text-white rounded-lg bg-primary-500 hover:bg-primary-50 hover:text-primary-6000">
                Confirm
              </button>
            </ModalFooter>
          </>
        </ModalContent>
      </Modal>
      <div className="shine-effect-container relative flex overflow-hidden flex-col 2xl:flex-row bg-white rounded-2xl shadow-lg p-3 md:p-4 lg:p-6 transition-all hover:shadow-xl">
        <div className="flex-1 flex flex-col 2xl:mr-16">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-4">
              <div className="bg-primary-50 p-2 md:p-3 rounded-full">
                <BsAirplane className="text-primary-6000 md:text-xl" />
              </div>
              <div>
                <h2 className="text-sm md:text-md text-neutral-700">
                  <span className="font-semibold">Flight: </span>
                  {isRoundTrip && returnFlight
                    ? outboundFlight.flight_number + " - " + returnFlight.flight_number
                    : outboundFlight.flight_number}
                </h2>
                <p className="text-neutral-600 text-xs md:text-sm md:mt-1">
                  {isRoundTrip && returnFlight
                    ? formatDateToYYYYMMDD2(outboundFlight.departure_time) +
                      " - " +
                      formatDateToYYYYMMDD2(returnFlight.departure_time)
                    : formatDateToYYYYMMDD2(outboundFlight.departure_time) +
                      " - " +
                      formatDateToYYYYMMDD2(outboundFlight.arrival_time)}
                </p>
              </div>
            </div>
          </div>
          <div className="flex-1 flex flex-col mt-3">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <FaPlaneDeparture className="hidden md:block text-primary-6000 text-2xl mr-2" />
                <div className="text-center">
                  <p className="text-sm md:text-lg font-semibold text-neutral-800">
                    {formatTime(outboundFlight.departure_time)}
                  </p>
                  <p className="text-xl md:text-3xl font-bold text-neutral-600">
                    {outboundFlight.departure_airport.code}
                  </p>
                  <p className="text-xs md:text-base text-neutral-600">{outboundFlight.departure_airport.city}</p>
                </div>
              </div>
              <div className="flex-1 flex flex-col items-center ">
                <p className="text-sm font-semibold text-neutral-500 mb-2">{duration_outbound}</p>
                <div className="w-full h-0.5 bg-primary-6000 relative">
                  <FaPlane className="text-primary-6000 text-xl absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2" />
                </div>
                <p className="text-sm text-neutral-500 mt-2">1 Stop</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="text-center">
                  <p className="text-sm md:text-lg font-semibold text-neutral-800">
                    {formatTime(outboundFlight.arrival_time)}
                  </p>
                  <p className="text-xl md:text-3xl font-bold text-neutral-600">
                    {outboundFlight.arrival_airport.code}
                  </p>
                  <p className="text-xs md:text-base text-neutral-600">{outboundFlight.arrival_airport.city}</p>
                </div>
                <FaPlaneArrival className="hidden md:block text-primary-6000 text-2xl ml-2" />
              </div>
            </div>
            {isRoundTrip && returnFlight && (
              <div className="flex items-center space-x-8 mt-2 pt-2 border-t-2 border-dashed border-gray-400">
                <div className="flex items-center space-x-2">
                  <FaPlaneDeparture className="hidden md:block text-primary-6000 text-2xl mr-2" />
                  <div className="text-center">
                    <p className="text-sm md:text-lg font-semibold text-neutral-800">
                      {formatTime(returnFlight.departure_time)}
                    </p>
                    <p className="text-xl md:text-3xl font-bold text-neutral-600">
                      {returnFlight.departure_airport.code}
                    </p>
                    <p className="text-xs md:text-base text-neutral-600">{returnFlight.departure_airport.city}</p>
                  </div>
                </div>
                <div className="flex-1 flex flex-col items-center ">
                  <p className="text-sm font-semibold text-neutral-500 mb-2">{duration_return}</p>
                  <div className="w-full h-0.5 bg-primary-6000 relative">
                    <FaPlane className="text-primary-6000 text-xl absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2" />
                    <p className="text-sm text-neutral-500 mt-2">1 Stop</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="text-center">
                    <p className="text-sm md:text-lg font-semibold text-neutral-800">
                      {formatTime(returnFlight.arrival_time)}
                    </p>
                    <p className="text-xl md:text-3xl font-bold text-neutral-600">
                      {returnFlight.arrival_airport.code}
                    </p>
                    <p className="text-xs md:text-base text-neutral-600">{returnFlight.arrival_airport.city}</p>
                  </div>
                  <FaPlaneArrival className="hidden md:block text-primary-6000 text-2xl ml-2" />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end border-t-2 2xl:border-t-0 2xl:border-l-4 border-dashed border-gray-400 2xl:pl-16 md:gap-1 2xl:w-[328px] 2xl:pt-0 pt-1 2xl:mt-0 mt-1">
          <div className="flex flex-col">
            <div
              className={`px-4 py-2 rounded-full border text-sm md:text-base${getStatusColor(
                flightTicket.booking_status
              )} flex items-center space-x-2 self-end mb-2 mt-2 lg:mt-0`}>
              {getStatusIcon(flightTicket.booking_status)}
              <span>{flightTicket.booking_status.charAt(0) + flightTicket.booking_status.slice(1).toLowerCase()}</span>
            </div>
            <p className="text-lg md:text-2xl lg:text-3xl font-bold text-primary-6000 text-right order-1 md:order-0">
              {formatCurrency(parseInt(flightTicket.total_price))} VND
            </p>

            <div className="flex flex-col items-end justify-end md:space-y-2 order-0 md:order-1">
              <div className="flex items-center justify-end space-x-2 text-sm">
                {passenger.passenger_type === "ADULT" ? (
                  <>
                    <FaUser className="text-neutral-400" />
                    <p className="text-neutral-600"> Adult</p>
                  </>
                ) : passenger.passenger_type === "CHILD" ? (
                  <>
                    <FaChild className="text-neutral-400" />
                    <p className="text-neutral-600"> Child</p>
                  </>
                ) : (
                  <>
                    <FaBaby className="text-neutral-400" />
                    <p className="text-neutral-600"> Infant</p>
                  </>
                )}
              </div>

              <div className="flex items-center justify-end space-x-2">
                <BsCashStack className="text-neutral-400" />
                <p className="text-neutral-600">{flightTicket.booking_class}</p>
              </div>
            </div>

            <div className="flex gap-2 justify-end mt-2 md:mt-4 order-2">
              <button
                onClick={onOpen}
                className="text-sm md:text-md px-4 md:px-6 py-2 border border-primary-6000 text-primary-6000 rounded-lg hover:bg-primary-100">
                View Details
              </button>
              {flightTicket.booking_status === "PENDING" && (
                <button
                  onClick={() => setIsOpenCheckIn(true)}
                  className="text-sm md:text-md px-4 md:px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-700">
                  Check-in
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FlightTicketCard;
