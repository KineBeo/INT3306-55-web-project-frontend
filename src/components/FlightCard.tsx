import React from "react";
import { FaPlane, FaUser, FaPlaneArrival, FaPlaneDeparture, FaChild } from "react-icons/fa";
import { BsCashStack, BsAirplane } from "react-icons/bs";
import { Flight } from "@/data/types";
import formatCurrency from "@/utils/formatCurrency";
import smallLogo from "@/images/small-logo.png";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";
import Image from "next/image";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import "dayjs/locale/en";

dayjs.extend(localizedFormat);

interface FlightCardProps {
  flight: Flight;
  onClick?: () => void;
}

const FlightCard: React.FC<FlightCardProps> = ({ flight, onClick }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <>
      <Modal
        backdrop="opaque"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        scrollBehavior="inside"
        placement="center"
        size="sm"
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
                  {flight.sectors[0]} &#45; {flight.sectors[flight.sectors.length - 1]}
                </h3>
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-1">
                  <p className="text-sm text-gray-600">
                    Departs on {dayjs(flight.departureDate, "DD/MM/YYYY").locale("en").format("dddd, DD MMMM YYYY")}
                  </p>
                  <p className="text-sm text-gray-600">
                    Arrives on {dayjs(flight.arrivalDate, "DD/MM/YYYY").locale("en").format("dddd, DD MMMM YYYY")}
                  </p>
                  <p className="text-sm text-gray-700 font-semibold">Total duration: {flight.totalTime}</p>

                  {/* Flight details */}
                  <div className="flex flex-col">
                    {flight.sectors.map(
                      (sector, index) =>
                        index < flight.sectors.length - 1 && (
                          <div key={index} className="flex flex-col gap-2">
                            <div className="flex">
                              <div className="grid grid-flow-col auto-cols-auto p-4 items-center">
                                <p className="text-sm text-gray-600 min-w-[56px]">
                                  {flight.sectors.length > 2 ? `Stop ${index + 1}` : "1 Stop"}
                                </p>
                                <div className="flex flex-col items-center gap-1 h-full">
                                  <div className="bg-primary-700 rounded-full w-[6px] h-[6px]"></div>
                                  <div className="bg-primary-700 rounded-full w-0.5 flex-1"></div>
                                  <div className="bg-primary-700 rounded-full w-[6px] h-[6px]"></div>
                                </div>
                                <div className="flex flex-col gap-7 ml-4">
                                  <div>
                                    {index == 0 && (
                                      <p className="font-semibold text-primary-700">{flight.departureTime}</p>
                                    )}
                                    <p className="text-gray-700">{sector}</p>
                                    <p className="text-xs text-gray-600">{flight.sectorsCode[index]} Airport</p>
                                  </div>
                                  <div>
                                    {index == flight.sectors.length - 2 && (
                                      <p className="font-semibold text-primary-700">{flight.arrivalTime}</p>
                                    )}
                                    <p className="font-normal text-gray-700">{flight.sectors[index + 1]}</p>
                                    <p className="text-xs text-gray-600">{flight.sectorsCode[index + 1]} Airport</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            {index < flight.sectors.length - 2 && (
                              <p className="text-xs text-gray-700">Switching Sector</p>
                            )}
                          </div>
                        )
                    )}
                  </div>

                  <p className="text-xs text-gray-600">
                    Flight number <strong>{flight.flightCode}</strong>
                  </p>
                  <p className="text-xs text-gray-600 flex gap-1">
                    Operated by QAirline <Image alt="logo" src={smallLogo} width={16} height={16} />
                  </p>
                  <p className="text-xs text-gray-600 uppercase">{flight.aircraftModel}</p>
                </div>
              </ModalBody>
              <ModalFooter>
                <button
                  onClick={onClose}
                  className="text-sm md:text-md px-4 md:px-6 py-2 border-2 border-[#ec9543] text-white rounded-lg bg-[#ec9543] hover:bg-white hover:text-gray-600">
                  Close
                </button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <div
        key={flight.id}
        className="flex flex-col lg:flex-row bg-white rounded-2xl shadow-lg p-3 md:p-4 lg:p-6 transition-all hover:shadow-xl">
        <div className="flex-1 flex flex-col lg:mr-16">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-4">
              <div className="bg-primary-50 p-2 md:p-3 rounded-full">
                <BsAirplane className="text-primary-6000 md:text-xl" />
              </div>
              <div>
                <h2 className="font-semibold text-sm md:text-md md:font-bold text-gray-700">
                  Flight {flight.flightCode}
                </h2>
                <p className="text-gray-600 text-small md:mt-1">
                  {flight.departureDate} &#45; {flight.arrivalDate}
                </p>
              </div>
            </div>
          </div>
          <div className="flex-1 mt-3">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <FaPlaneDeparture className="hidden md:block text-primary-6000 text-2xl mr-2" />
                <div className="text-center">
                  <p className="md:text-lg font-semibold text-gray-800">{flight.departureTime}</p>
                  <p className="text-2xl md:text-3xl font-bold text-gray-600">{flight.sectorsCode[0]}</p>
                  <p className="text-gray-600">{flight.sectors[0]}</p>
                </div>
              </div>
              <div className="flex-1 flex flex-col items-center ">
                <p className="text-sm font-semibold text-gray-500 mb-2">{flight.totalTime}</p>
                <div className="w-full h-0.5 bg-primary-6000 relative">
                  <FaPlane className="text-primary-6000 text-xl absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2" />
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {flight.sectors.length - 1} {flight.sectors.length - 1 === 1 ? "stop" : "stops"}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="text-center">
                  <p className="md:text-lg font-semibold text-gray-800">{flight.arrivalTime}</p>
                  <p className="text-2xl md:text-3xl font-bold text-gray-600">
                    {flight.sectorsCode[flight.sectorsCode.length - 1]}
                  </p>
                  <p className="text-gray-600">{flight.sectors[flight.sectors.length - 1]}</p>
                </div>
                <FaPlaneArrival className="hidden md:block text-primary-6000 text-2xl ml-2" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col border-t-2 lg:border-t-0 lg:border-l-4 border-dashed border-gray-400 lg:pl-16 md:gap-1 lg:w-[324px]">
          <p className="text-xl md:text-2xl lg:text-3xl font-bold text-primary-6000 text-right order-1 md:order-0">
            {formatCurrency(flight.price)} VND
          </p>

          <div className="flex flex-col items-end justify-end md:space-y-2 order-0 md:order-1">
            <div className="flex items-center justify-end space-x-2">
              <FaUser className="text-gray-400" />
              <p className="text-gray-600">
                {flight.adults} {flight.adults > 1 ? "Adults" : "Adult"}
              </p>
              {flight.children > 0 && (
                <div className="flex items-center justify-end space-x-2">
                  ,
                  <FaChild className="text-gray-400" />
                  <p className="text-gray-600">
                    {flight.children} {flight.children > 1 ? "Children" : "Child"}
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end space-x-2">
              <BsCashStack className="text-gray-400" />
              <p className="text-gray-600">{flight.class}</p>
            </div>
          </div>

          <div className="flex gap-2 justify-end mt-2 md:mt-4 order-2">
            <button
              onClick={onOpen}
              className="text-sm md:text-md px-4 md:px-6 py-2 border border-primary-6000 text-primary-6000 rounded-lg hover:bg-primary-100">
              View Details
            </button>
            <button
              onClick={onClick}
              className="text-sm md:text-md px-4 md:px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-700">
              Book now
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FlightCard;
