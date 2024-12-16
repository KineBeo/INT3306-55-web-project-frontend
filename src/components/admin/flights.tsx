/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/modal";
import { FaTrash, FaEdit, FaSearch } from "react-icons/fa";
import { useOverlay } from "@/context/OverlayContext";
import { Flight, CreateFlight, UpdateFlight } from "@/data/flight";
import api from "@/services/apiClient";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchAirports } from "@/redux/airport/thunks";
import { fetchAirplanes } from "@/redux/airplane/thunks";
import { formatToDdMmYyyyHhMm, formatToYyyyMmDdTmm } from "@/utils/formatDate";
import SuggestionInput from "./SuggestionInput";

const Flights = () => {
  const { setLoading } = useOverlay();
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const [editNumber, setEditNumber] = useState(-1);
  const [editingFlight, setEditingFlight] = useState<UpdateFlight | null>();
  const [createFlight, setCreateFlight] = useState<CreateFlight>({
    flight_number: "",
    base_price: "",
    departure_time: "",
    arrival_time: "",
    delay_duration: "0",
    departure_airport_id: 0,
    arrival_airport_id: 0,
    airplane_id: 0,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");

  const dispatch = useAppDispatch();
  const { airports } = useAppSelector((state) => state.airport);
  const { airplanes } = useAppSelector((state) => state.airplane);
  useEffect(() => {
    if (!airports.length) {
      dispatch(fetchAirports());
    }
    if (!airplanes.length) {
      dispatch(fetchAirplanes());
    }
  }, [dispatch, airports, airplanes]);

  const findIdByValue = (map: Record<number, string>, value: string): number | undefined => {
    return Object.keys(map).find((key) => map[Number(key)] === value) as unknown as number | undefined;
  };

  const airportMap = airports.reduce((acc, airport) => {
    acc[airport.id] = "" + airport.code + " - " + airport.name + ", " + airport.city + ", " + airport.country;
    return acc;
  }, {} as Record<number, string>);

  const airplaneMap = airplanes.reduce((acc, airplane) => {
    acc[airplane.id] = "" + airplane.registration_number + " - " + airplane.model_name;
    return acc;
  }, {} as Record<number, string>);

  // Sample flights data
  const [flightList, setFlightList] = useState<Flight[]>([]);

  useEffect(() => {
    setLoading(true);
    api.get("/flight").then((response) => {
      const flights = response.data;
      setFlightList(flights.sort((a: Flight, b: Flight) => a.id - b.id));
      setLoading(false);
    });
  }, [setLoading, setFlightList]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    let status = "SCHEDULED";
    if (e.target.name === "delay_duration") {
      if (parseInt(e.target.value) > 0) {
        status = "DELAYED";
      }
    }
    if (editNumber !== -1 && editingFlight) {
      setEditingFlight({
        ...editingFlight,
        [e.target.name]: e.target.value,
        departure_time: e.target.name === "departure_time" ? new Date(e.target.value).toISOString() : editingFlight.departure_time,
        arrival_time: e.target.name === "arrival_time" ? new Date(e.target.value).toISOString() : editingFlight.arrival_time,
        status: status,
      });
    } else {
      setCreateFlight({
        ...createFlight,
        [e.target.name]: e.target.value,
        departure_time: e.target.name === "departure_time" ? new Date(e.target.value).toISOString() : createFlight.departure_time,
        arrival_time: e.target.name === "arrival_time" ? new Date(e.target.value).toISOString() : createFlight.arrival_time,
      });
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredFlights = flightList.filter(
    (flight) =>
      flight.flight_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      flight.departure_airport.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      flight.departure_airport.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      flight.arrival_airport.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      flight.arrival_airport.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      flight.airplane.registration_number.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const resetForm = () => {
    setEditNumber(-1);
    setEditingFlight(null);
    setCreateFlight({
      flight_number: "",
      base_price: "",
      departure_time: "",
      arrival_time: "",
      delay_duration: "0",
      departure_airport_id: 0,
      arrival_airport_id: 0,
      airplane_id: 0,
    });
    setError("");
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editNumber != -1 && editingFlight) {
      console.log(editingFlight);
      setLoading(true);
      api
        .patch(`/flight/${editNumber}`, editingFlight)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .then((_) => {
          const updatedFlights = flightList.map((flight) =>
            flight.id === editNumber
              ? {
                  ...flight,
                  flight_number: editingFlight.flight_number,
                  base_price: editingFlight.base_price,
                  departure_time: editingFlight.departure_time,
                  arrival_time: editingFlight.arrival_time,
                  delay_duration: editingFlight.delay_duration,
                  airplane: airplanes.find((airplane) => airplane.id === editingFlight.airplane_id)!,
                  departure_airport: airports.find((airport) => airport.id === editingFlight.departure_airport_id)!,
                  arrival_airport: airports.find((airport) => airport.id === editingFlight.arrival_airport_id)!,
                  status: editingFlight.status as "SCHEDULED" | "DELAYED" | "CANCELLED" | "COMPLETED",
                }
              : flight
          );
          setFlightList(updatedFlights);
          setLoading(false);
          resetForm();
          onClose();
        })
        .catch((err) => {
          setError(err.response.data.message);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      console.log(createFlight);
      setLoading(true);
      api
        .post("/flight", createFlight)
        .then((response) => {
          const newFlight = response.data;
          setFlightList([...flightList, newFlight]);
          setLoading(false);
          resetForm();
          onClose();
        })
        .catch((err) => {
          setError(err.response.data.message);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const handleDeleteFlight = (id: number) => {
    setLoading(true);
    api
      .delete(`/flight/${id}`)
      .then(() => {
        const updatedFlights = flightList.filter((flight) => flight.id !== id);
        setFlightList(updatedFlights);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const setEditing = (flight: Flight) => {
    if (!flight) {
      setEditNumber(-1);
      setEditingFlight(null);
      return;
    }
    setEditNumber(flight.id);
    setEditingFlight({
      departure_airport_id: flight.departure_airport.id,
      arrival_airport_id: flight.arrival_airport.id,
      airplane_id: flight.airplane.id,
      flight_number: flight.flight_number,
      base_price: flight.base_price,
      departure_time: flight.departure_time,
      arrival_time: flight.arrival_time,
      delay_duration: flight.delay_duration,
      status: flight.status,
    });
  };

  const handleEditFLight = (flight: Flight) => {
    setError("");
    setEditing(flight);
    onOpen();
  };

  const renderContent = () => {
    return (
      <div>
        <h2 className="text-xl md:text-2xl font-bold mb-4">Flight Management</h2>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4 md:gap-0">
            <div className="relative order-1 md:order-0">
              <input
                type="text"
                placeholder="Search flight..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-10 pr-4 py-2 border rounded-lg w-56 lg:w-64 text-sm md:text-base"
              />
              <FaSearch className="absolute left-3 top-3 text-neutral-400" />
            </div>
            <div className="order-0 md:order-1">
              <button
                onClick={() => {
                  resetForm();
                  onOpen();
                }}
                className="bg-primary-500 text-white px-4 py-3 rounded-lg hover:bg-primary-600 transition-colors text-sm lg:text-base">
                Add New Flight
              </button>
            </div>
          </div>

          <div className="overflow-x-scroll">
            <table className="divide-y divide-neutral-200">
              <thead className="bg-neutral-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider xl:hidden">
                    Actions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Flight Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Departure Airport
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Arrival Airport
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Airplane
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Departure Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Arrival Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Delay Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Base Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider xl:block hidden">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-200">
                {filteredFlights.map((flight, index) => (
                  <tr key={flight.id}>
                    <td className="px-4 py-3 whitespace-nowrap xl:hidden">
                      <div className="flex space-x-2 justify-center">
                        <button
                          onClick={() => handleEditFLight(flight)}
                          className="text-primary-500 hover:text-primary-600">
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => {
                            setEditing(flight);
                            setIsDeleteModalOpen(true);
                          }}
                          className="text-red-500 hover:text-red-600">
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm md:text-base text-center">{index + 1}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm md:text-base text-center">
                      {flight.flight_number}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm md:text-base">
                      {flight.departure_airport.name}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm md:text-base">{flight.arrival_airport.name}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm md:text-base text-center">
                      {flight.airplane.registration_number}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm md:text-base">
                      {formatToDdMmYyyyHhMm(flight.departure_time)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm md:text-base">
                      {formatToDdMmYyyyHhMm(flight.arrival_time)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm md:text-base text-center">
                      {flight.delay_duration}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm md:text-base text-center">
                      {flight.base_price}
                    </td>
                    <td
                      className={`px-4 py-3 whitespace-nowrap text-xs md:text-sm text-center ${
                        flight.status === "SCHEDULED"
                          ? "text-primary-500"
                          : flight.status === "DELAYED"
                          ? "text-yellow-500"
                          : flight.status === "CANCELLED"
                          ? "text-red-500"
                          : "text-green-500"
                      }`}>
                      {flight.status}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap xl:block hidden">
                      <div className="flex space-x-2 justify-center">
                        <button
                          onClick={() => handleEditFLight(flight)}
                          className="text-primary-500 hover:text-primary-600">
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => {
                            setEditing(flight);
                            setIsDeleteModalOpen(true);
                          }}
                          className="text-red-500 hover:text-red-600">
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const renderDeleteModal = () => {
    return (
      <Modal
        backdrop="opaque"
        isOpen={isDeleteModalOpen}
        onOpenChange={() => setIsDeleteModalOpen(!isDeleteModalOpen)}
        scrollBehavior="inside"
        placement="center"
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
        }}
        classNames={{
          closeButton: "hidden",
        }}>
        <ModalContent>
          <ModalHeader></ModalHeader>
          <ModalBody>
            <p>Are you sure you want to permanently delete this item? This action is irreversible.</p>
          </ModalBody>
          <ModalFooter>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setEditingFlight(null);
                }}
                className="px-4 py-3 text-neutral-600 rounded-lg hover:bg-neutral-100 text-sm md:text-base">
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  handleDeleteFlight(editNumber);
                  setIsDeleteModalOpen(false);
                }}
                className="px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm md:text-base">
                Delete
              </button>
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };

  const renderModal = () => {
    return (
      <Modal
        backdrop="opaque"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        scrollBehavior="inside"
        placement="center"
        isDismissable={false}
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
        }}
        classNames={{
          closeButton: "hidden",
        }}>
        <ModalContent>
          <ModalHeader>
            <h3 className="text-lg md:text-xl font-bold">{editingFlight ? "Edit Flight" : "Add New Flight"}</h3>
          </ModalHeader>
          <ModalBody>
            <form
              onSubmit={handleSubmit}
              onKeyDown={(e: React.KeyboardEvent<HTMLFormElement>) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                }
              }}>
              <div className="mb-4">
                <label className="block text-neutral-700 mb-2">Flight Number</label>
                <input
                  type="text"
                  name="flight_number"
                  value={editingFlight ? editingFlight.flight_number : createFlight.flight_number}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg text-sm md:text-base"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-neutral-700 mb-2">Departure Airport</label>
                <SuggestionInput
                  name="departure_airport_id"
                  required={true}
                  classNames={{
                    input: "w-full p-2 border rounded-lg text-sm md:text-base",
                  }}
                  dataList={Object.values(airportMap)}
                  defaultValue={editingFlight ? airportMap[editingFlight.departure_airport_id] : ""}
                  placeHolder="Select Airport"
                  onInputDone={(value) => {
                    const id = findIdByValue(airportMap, value);
                    if (id) {
                      handleInputChange({
                        target: { name: "departure_airport_id", value: parseInt(id.toString()) },
                      } as any);
                    }
                  }}
                />
              </div>

              <div className="mb-4">
                <label className="block text-neutral-700 mb-2">Arrival Airport</label>
                <SuggestionInput
                  name="arrival_airport_id"
                  required={true}
                  classNames={{
                    input: "w-full p-2 border rounded-lg text-sm md:text-base",
                  }}
                  dataList={Object.values(airportMap)}
                  defaultValue={editingFlight ? airportMap[editingFlight.arrival_airport_id] : ""}
                  placeHolder="Select Airport"
                  onInputDone={(value) => {
                    const id = findIdByValue(airportMap, value);
                    if (id) {
                      handleInputChange({
                        target: { name: "arrival_airport_id", value: parseInt(id.toString()) },
                      } as any);
                    }
                  }}
                />
              </div>

              <div className="mb-4">
                <label className="block text-neutral-700 mb-2">Airplane</label>
                <SuggestionInput
                  name="airplane_id"
                  required={true}
                  classNames={{
                    input: "w-full p-2 border rounded-lg text-sm md:text-base",
                  }}
                  dataList={Object.values(airplaneMap)}
                  defaultValue={editingFlight ? airplaneMap[editingFlight.airplane_id] : ""}
                  placeHolder="Select Airplane"
                  onInputDone={(value) => {
                    const id = findIdByValue(airplaneMap, value);
                    if (id) {
                      handleInputChange({ target: { name: "airplane_id", value: parseInt(id.toString()) } } as any);
                    }
                  }}
                />
              </div>

              <div className="mb-4">
                <label className="block text-neutral-700 mb-2">Departure Time</label>
                <input
                  type="datetime-local"
                  name="departure_time"
                  value={
                    editingFlight
                      ? formatToYyyyMmDdTmm(editingFlight.departure_time)
                      : formatToYyyyMmDdTmm(createFlight.departure_time)
                  }
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border rounded-lg text-sm md:text-base"
                />
              </div>

              <div className="mb-4">
                <label className="block text-neutral-700 mb-2">Arrival Time</label>
                <input
                  type="datetime-local"
                  name="arrival_time"
                  value={
                    editingFlight
                      ? formatToYyyyMmDdTmm(editingFlight.arrival_time)
                      : formatToYyyyMmDdTmm(createFlight.arrival_time)
                  }
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg text-sm md:text-base"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-neutral-700 mb-2">Delay Duration</label>
                <input
                  type="text"
                  name="delay_duration"
                  value={editingFlight ? editingFlight.delay_duration : createFlight.delay_duration}
                  onChange={handleInputChange}
                  disabled={!editingFlight}
                  onInput={(e) => {
                    const inputValue = e.currentTarget.value;
                    const newValue = inputValue.replace(/[^0-9]/g, "");
                    e.currentTarget.value = newValue;
                  }}
                  className={`w-full p-2 border rounded-lg text-sm md:text-base ${
                    editingFlight ? "" : "cursor-not-allowed text-neutral-400"
                  }`}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-neutral-700 mb-2">Base Price</label>
                <input
                  type="text"
                  name="base_price"
                  value={editingFlight ? editingFlight.base_price : createFlight.base_price}
                  onChange={handleInputChange}
                  onInput={(e) => {
                    const inputValue = e.currentTarget.value;
                    const newValue = inputValue.replace(/[^0-9]/g, "");
                    e.currentTarget.value = newValue;
                  }}
                  className={"w-full p-2 border rounded-lg text-sm md:text-base"}
                  required
                />
              </div>

              <div>
                <label className="block text-neutral-700 mb-2">Status</label>
                <select
                  name="status"
                  value={editingFlight ? editingFlight.status : "SCHEDULED"}
                  onChange={handleInputChange}
                  disabled={!editingFlight}
                  className={`w-full p-2 border rounded-lg text-sm md:text-base ${
                    editingFlight ? "" : "cursor-not-allowed text-neutral-400"
                  }`}>
                  <option value="SCHEDULED" className="">
                    Scheduled
                  </option>
                  <option value="DELAYED">Delayed</option>
                  <option value="CANCELLED">Cancelled</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>

              {error ? (
                Array.isArray(error) ? (
                  <div className="text-danger-500 text-sm mt-4 flex flex-col">
                    {error.map((err, index) => (
                      <span key={index}>{err.charAt(0).toUpperCase() + err.slice(1)}</span>
                    ))}
                  </div>
                ) : (
                  <div className="text-danger-500 text-sm mt-4 flex flex-col">
                    <span>{error.charAt(0).toUpperCase() + error.slice(1)}</span>
                  </div>
                )
              ) : (
                <></>
              )}

              <div className="flex justify-end space-x-2 my-4">
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    onClose();
                  }}
                  className="px-4 py-3 text-neutral-600 rounded-lg hover:bg-neutral-100 text-sm md:text-base">
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 text-sm md:text-base">
                  {editingFlight ? "Update" : "Submit"}
                </button>
              </div>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  };

  return (
    <div className="flex justify-center ">
      <div className="p-6 md:p-12 max-w-full">
        {renderContent()}
        {renderModal()}
        {renderDeleteModal()}
      </div>
    </div>
  );
};

export default Flights;
