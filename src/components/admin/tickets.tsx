/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/modal";
import { FaTrash, FaEdit, FaSearch } from "react-icons/fa";
import { useOverlay } from "@/context/OverlayContext";
import { Ticket, CreateTicket, UpdateTicket } from "@/data/ticket";
import api from "@/services/apiClient";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchFlights } from "@/redux/flight/thunks";
import { formatToDdMmYyyyHhMm } from "@/utils/formatDate";
import SuggestionInput from "./SuggestionInput";

const Tickets = () => {
  const { setLoading } = useOverlay();
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const [editNumber, setEditNumber] = useState(-1);
  const [editingTicket, setEditingTicket] = useState<UpdateTicket | null>();
  const [createTicket, setCreateTicket] = useState<CreateTicket>({
    outbound_flight_id: 0,
    return_flight_id: null,
    user_id: null,
    booking_date: null,
    ticket_type: "ONE_WAY",
    booking_class: "ECONOMY",
    description: "",
    total_passengers: 1,
    base_price: "1000",
    booking_status: "PENDING",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");

  const dispatch = useAppDispatch();
  const { flights } = useAppSelector((state) => state.flight);
  useEffect(() => {
    if (!flights.length) {
      dispatch(fetchFlights());
    }
  }, [dispatch, flights]);

  const findIdByValue = (map: Record<number, string>, value: string): number | undefined => {
    return Object.keys(map).find((key) => map[Number(key)] === value) as unknown as number | undefined;
  };

  const flightMap = flights.reduce((acc, flight) => {
    acc[flight.id] =
      "" +
      flight.flight_number +
      ", " +
      formatToDdMmYyyyHhMm(flight.departure_time) +
      " - " +
      formatToDdMmYyyyHhMm(flight.arrival_time) +
      ", " +
      flight.base_price;
    return acc;
  }, {} as Record<number, string>);

  // Sample tickets data
  const [ticketList, setTicketList] = useState<Ticket[]>([]);

  useEffect(() => {
    setLoading(true);
    api.get("/ticket").then((response) => {
      const tickets = response.data;
      setTicketList(tickets.sort((a: Ticket, b: Ticket) => a.id - b.id));
      setLoading(false);
      console.log(tickets);
    });
  }, [setLoading, setTicketList]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (editNumber !== -1 && editingTicket) {
      setEditingTicket({
        ...editingTicket,
        [e.target.name]: e.target.value,
        description: `${"type: " + editingTicket.ticket_type}, ${"class: " + editingTicket.booking_class}, ${
          "outbound: " + flightMap[editingTicket.outbound_flight_id]
        } - ${"return: " + (editingTicket.return_flight_id ? flightMap[editingTicket.return_flight_id] : "N/A")}`,
      });
    } else {
      setCreateTicket({
        ...createTicket,
        [e.target.name]: e.target.value,
        description: `${"type: " + createTicket.ticket_type}, ${"class: " + createTicket.booking_class}, ${
          "outbound: " + flightMap[createTicket.outbound_flight_id]
        } - ${
          "return: " + (createTicket.return_flight_id !== null ? flightMap[createTicket.return_flight_id] : "N/A")
        }`,
      });
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredTickets = ticketList.filter(
    (ticket) =>
      ticket.booking_class.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.booking_status.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.total_price.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const resetForm = () => {
    setEditNumber(-1);
    setEditingTicket(null);
    setCreateTicket({
      outbound_flight_id: 0,
      return_flight_id: null,
      user_id: null,
      booking_date: null,
      ticket_type: "ONE_WAY",
      booking_class: "ECONOMY",
      description: "",
      total_passengers: 1,
      base_price: "1000",
      booking_status: "PENDING",
    });
    setError("");
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editNumber != -1 && editingTicket) {
      setLoading(true);
      api
        .patch(`/ticket/${editNumber}`, editingTicket)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .then((_) => {
          const updatedTickets = ticketList.map((ticket) =>
            ticket.id === editNumber
              ? {
                  ...ticket,
                  outboundFlight: flights.find((ticket) => ticket.id === editingTicket.outbound_flight_id)!,
                  returnFlight: flights.find((ticket) => ticket.id === editingTicket.return_flight_id)!,
                  ticket_type: editingTicket.ticket_type,
                  booking_class: editingTicket.booking_class,
                  description: editingTicket.description,
                  booking_status: editingTicket.booking_status,
                }
              : ticket
          );
          setTicketList(updatedTickets);
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
      console.log(createTicket);
      setLoading(true);
      api
        .post("/ticket", createTicket)
        .then((response) => {
          const newFlight = response.data;
          setTicketList([...ticketList, newFlight]);
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

  const handleDeleteTicket = (id: number) => {
    setLoading(true);
    api
      .delete(`/ticket/${id}`)
      .then(() => {
        const updatedTickets = ticketList.filter((flight) => flight.id !== id);
        setTicketList(updatedTickets);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const setEditing = (ticket: Ticket) => {
    if (!ticket) {
      setEditNumber(-1);
      setEditingTicket(null);
      return;
    }
    setEditNumber(ticket.id);
    setEditingTicket({
      outbound_flight_id: ticket.outboundFlight.id,
      return_flight_id: ticket.returnFlight ? ticket.returnFlight.id : null,
      user_id: ticket.user ? ticket.user.id : null,
      booking_date: ticket.booking_date,
      ticket_type: ticket.ticket_type,
      booking_class: ticket.booking_class,
      description: ticket.description,
      total_passengers: ticket.total_passengers,
      base_price: ticket.base_price,
      booking_status: ticket.booking_status,
    });
  };

  const handleEditFLight = (ticket: Ticket) => {
    setError("");
    setEditing(ticket);
    onOpen();
  };

  const renderContent = () => {
    return (
      <div>
        <h2 className="text-xl md:text-2xl font-bold mb-4">Ticket Management</h2>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4 md:gap-0">
            <div className="relative order-1 md:order-0">
              <input
                type="text"
                placeholder="Search ticket..."
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
                Add New Ticket
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
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Class
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Outbound Flight
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Return Flight
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    User ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Total Price
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
                {filteredTickets.map((ticket, index) => (
                  <tr key={ticket.id}>
                    <td className="px-4 py-3 whitespace-nowrap xl:hidden">
                      <div className="flex space-x-2 justify-center">
                        <button
                          onClick={() => handleEditFLight(ticket)}
                          className="text-primary-500 hover:text-primary-600">
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => {
                            setEditing(ticket);
                            setIsDeleteModalOpen(true);
                          }}
                          className="text-red-500 hover:text-red-600">
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm md:text-base text-center">{index + 1}</td>
                    <td className="px-4 py-3 whitespace-nowrap max-w-[500px] truncate text-sm md:text-base">{ticket.description}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm md:text-base text-center">
                      {ticket.ticket_type}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm md:text-base text-center">
                      {ticket.booking_class}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm md:text-base truncate">
                      {flightMap[ticket.outboundFlight.id]}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm md:text-base truncate">
                      {flightMap[ticket.outboundFlight.id]}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm md:text-base">
                      {ticket.user ? ticket.user.fullname : ""}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm md:text-base">{ticket.total_price}</td>
                    <td
                      className={`px-4 py-3 whitespace-nowrap text-xs md:text-sm text-center ${
                        ticket.booking_status === "CONFIRMED"
                          ? "text-primary-500"
                          : ticket.booking_status === "PENDING"
                          ? "text-yellow-500"
                          : ticket.booking_status === "CANCELLED"
                          ? "text-red-500"
                          : ""
                      }`}>
                      {ticket.booking_status}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap xl:block hidden">
                      <div className="flex space-x-2 justify-center">
                        <button
                          onClick={() => handleEditFLight(ticket)}
                          className="text-primary-500 hover:text-primary-600">
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => {
                            setEditing(ticket);
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
                  setEditingTicket(null);
                }}
                className="px-4 py-3 text-neutral-600 rounded-lg hover:bg-neutral-100 text-sm md:text-base">
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  handleDeleteTicket(editNumber);
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
            <h3 className="text-lg md:text-xl font-bold">{editingTicket ? "Edit Ticket" : "Add New Ticket"}</h3>
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
                <label className="block text-neutral-700 mb-2">User</label>
                <input
                  type="text"
                  name="id"
                  value={editingTicket && editingTicket.user_id !== null ? editingTicket.user_id : ""}
                  disabled
                  className="w-full p-2 border rounded-lg text-sm md:text-base text-neutral-400 cursor-not-allowed"
                />
              </div>

              <div className="mb-4">
                <label className="block text-neutral-700 mb-2">Outbound Flight</label>
                <SuggestionInput
                  name="outbound_flight_id"
                  required={true}
                  classNames={{
                    input: "w-full p-2 border rounded-lg text-sm md:text-base",
                  }}
                  dataList={Object.values(flightMap)}
                  defaultValue={editingTicket ? flightMap[editingTicket.outbound_flight_id] : ""}
                  placeHolder="Select Flight"
                  onInputDone={(value) => {
                    const id = findIdByValue(flightMap, value);
                    if (id) {
                      handleInputChange({
                        target: { name: "outbound_flight_id", value: parseInt(id.toString()) },
                      } as any);
                    }
                  }}
                />
              </div>

              <div className="mb-4">
                <label className="block text-neutral-700 mb-2">Return Flight</label>
                <SuggestionInput
                  name="return_flight_id"
                  // required={true}
                  classNames={{
                    input: "w-full p-2 border rounded-lg text-sm md:text-base",
                  }}
                  dataList={Object.values(flightMap)}
                  disabled={createTicket.ticket_type === "ONE_WAY"}
                  defaultValue={
                    editingTicket && editingTicket.return_flight_id ? flightMap[editingTicket.return_flight_id] : ""
                  }
                  placeHolder="Select Flight"
                  onInputDone={(value) => {
                    const id = findIdByValue(flightMap, value);
                    if (id) {
                      handleInputChange({
                        target: { name: "return_flight_id", value: parseInt(id.toString()) },
                      } as any);
                    }
                  }}
                />
              </div>

              <div>
                <label className="block text-neutral-700 mb-2">Ticket Type</label>
                <select
                  name="ticket_type"
                  value={editingTicket ? editingTicket.ticket_type : "ONE_WAY"}
                  onChange={handleInputChange}
                  required
                  className={"w-full p-2 border rounded-lg text-sm md:text-base"}>
                  <option value="ONE_WAY">One way</option>
                  <option value="ROUND_TRIP">Round trip</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-700 mb-2">Booking Class</label>
                <select
                  name="booking_class"
                  value={editingTicket ? editingTicket.booking_class : "ECONOMY"}
                  onChange={handleInputChange}
                  required
                  className={"w-full p-2 border rounded-lg text-sm md:text-base"}>
                  <option value="ECONOMY">Economy</option>
                  <option value="BUSINESS">Business</option>
                  <option value="FIRST_CLASS">First Class</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-neutral-700 mb-2">Description</label>
                <input
                  type="text"
                  name="description"
                  disabled
                  value={
                    editingTicket
                      ? editingTicket.description
                      : `${"type: " + createTicket.ticket_type}, ${
                          "class: " + createTicket.booking_class
                        }, ${"outbound: "} - ${"return: "}`
                  }
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg text-sm md:text-base"
                  required
                />
              </div>

              <div>
                <label className="block text-neutral-700 mb-2">Status</label>
                <select
                  name="booking_status"
                  value={editingTicket ? editingTicket.booking_status : "PENDING"}
                  onChange={handleInputChange}
                  disabled={!editingTicket}
                  className={`w-full p-2 border rounded-lg text-sm md:text-base ${
                    editingTicket ? "" : "cursor-not-allowed text-neutral-400"
                  }`}>
                  <option value="PENDING">Pending</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="CANCELLED">Cancelled</option>
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
                  {editingTicket ? "Update" : "Submit"}
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

export default Tickets;
