/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/modal";
import { FaTrash, FaEdit, FaSearch } from "react-icons/fa";
import { useOverlay } from "@/context/OverlayContext";
import { TicketPassenger, UpdateTicketPassenger } from "@/data/ticketPassenger";
import { formatDateToYYYYMMDD, formatDateToDDMMYYYY } from "@/utils/formatDate";
import api from "@/services/apiClient";

const TicketPassengers = () => {
  const { setLoading } = useOverlay();
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const [editNumber, setEditNumber] = useState(-1);
  const [editingPassenger, setEditingPassenger] = useState<UpdateTicketPassenger | null>();
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  // Sample airports data
  const [passengerList, setPassengerList] = useState<TicketPassenger[]>([]);

  useEffect(() => {
    setLoading(true);
    api
      .get("/ticket-passenger")
      .then((response) => {
        const passengers = response.data;
        setPassengerList(passengers.sort((a: TicketPassenger, b: TicketPassenger) => a.id - b.id));
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [setLoading, setPassengerList]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (editNumber !== -1 && editingPassenger) {
      setEditingPassenger({
        ...editingPassenger,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredPassengers = passengerList.filter(
    (passenger) =>
      passenger.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      passenger.cccd.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const resetForm = () => {
    setEditNumber(-1);
    setEditingPassenger(null);
    setError("");
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editNumber != -1 && editingPassenger) {
      setLoading(true);
      api
        .patch(`/ticket-passenger/${editNumber}`, editingPassenger)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .then((_) => {
          const updatePassengers = passengerList.map((passenger) =>
            passenger.id === editNumber
              ? {
                  ...passenger,
                  passenger_type: editingPassenger.passenger_type,
                  associated_adult_id:
                    passengerList.find((passenger) => passenger.id === editingPassenger.associated_adult_id) || null,
                  full_name: editingPassenger.full_name,
                  birthday: editingPassenger.birthday,
                  cccd: editingPassenger.cccd,
                  country_code: editingPassenger.country_code,
                }
              : passenger
          );
          setPassengerList(updatePassengers);
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

  const handleDeletePassenger = (id: number) => {
    setLoading(true);
    api
      .delete(`/ticket-passenger/${id}`)
      .then(() => {
        const updatedPassengers = passengerList.filter((passenger) => passenger.id !== id);
        setPassengerList(updatedPassengers);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const setEditing = (passenger: TicketPassenger | null) => {
    if (!passenger) {
      setEditNumber(-1);
      setEditingPassenger(null);
      return;
    }
    setEditNumber(passenger.id);
    setEditingPassenger({
      passenger_type: passenger.passenger_type,
      full_name: passenger.full_name,
      birthday: passenger.birthday,
      cccd: passenger.cccd,
      country_code: passenger.country_code,
      associated_adult_id: passenger.associated_adult_id?.id || null,
      ticket_id: passenger.ticket.id,
    });
  };

  const handleEditPassenger = (passenger: TicketPassenger | null) => {
    setError("");
    setEditing(passenger);
    onOpen();
  };

  const renderContent = () => {
    return (
      <div>
        <h2 className="text-xl md:text-2xl font-bold mb-4">Ticket Passenger Management</h2>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4 md:gap-0">
            <div className="relative">
              <input
                type="text"
                placeholder="Search passenger..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-10 pr-4 py-2 border rounded-lg w-56 lg:w-64 text-sm md:text-base"
              />
              <FaSearch className="absolute left-3 top-3 text-neutral-400" />
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
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Fullname
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Passenger Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Birthday
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    ID Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Country Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Associated Adult
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Ticket
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider xl:block hidden">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-200">
                {filteredPassengers.map((passenger) => (
                  <tr key={passenger.id}>
                    <td className="px-4 py-3 whitespace-nowrap xl:hidden">
                      <div className="flex space-x-2 justify-center">
                        <button
                          onClick={() => handleEditPassenger(passenger)}
                          className="text-primary-500 hover:text-primary-600">
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => {
                            setEditing(passenger);
                            setIsDeleteModalOpen(true);
                          }}
                          className="text-red-500 hover:text-red-600">
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm md:text-base text-center">{passenger.id}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm md:text-base">{passenger.full_name}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm md:text-base text-center">
                      {passenger.passenger_type}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm md:text-base">{formatDateToDDMMYYYY(passenger.birthday)}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm md:text-base">{passenger.cccd}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm md:text-base text-center">
                      {passenger.country_code}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm md:text-base">
                      {passenger.associated_adult_id?.full_name}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm md:text-base text-center">
                      {passenger.ticket.id}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap xl:block hidden">
                      <div className="flex space-x-2 justify-center">
                        <button
                          onClick={() => handleEditPassenger(passenger)}
                          className="text-primary-500 hover:text-primary-600">
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => {
                            setEditing(passenger);
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
                  handleEditPassenger(null);
                }}
                className="px-4 py-3 text-neutral-600 rounded-lg hover:bg-neutral-100 text-sm md:text-base">
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  handleDeletePassenger(editNumber);
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
            <h3 className="text-lg md:text-xl font-bold">
              {editingPassenger ? "Edit Passenger" : "Add New Passenger"}
            </h3>
          </ModalHeader>
          <ModalBody>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-neutral-700 mb-2">ID</label>
                <input
                  type="text"
                  name="id"
                  value={editingPassenger ? editNumber : "Auto-generated"}
                  disabled
                  className="w-full p-2 border rounded-lg text-sm md:text-base text-neutral-400 cursor-not-allowed"
                />
              </div>

              <div className="mb-4">
                <label className="block text-neutral-700 mb-2">Fullname</label>
                <input
                  type="text"
                  name="full_name"
                  value={editingPassenger?.full_name}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg text-sm md:text-base"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-neutral-700 mb-2">Passenger Type</label>
                <select
                  name="passenger_type"
                  value={editingPassenger?.passenger_type}
                  onChange={handleInputChange}
                  required
                  className={"w-full p-2 border rounded-lg text-sm"}>
                  <option value="ADULT">Adult</option>
                  <option value="CHILD">Child</option>
                  <option value="INFANT">Infant</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-neutral-700 mb-2">Birthday</label>
                <input
                  type="date"
                  name="birthday"
                  value={editingPassenger ? formatDateToYYYYMMDD(editingPassenger.birthday) : ""}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg text-sm md:text-base"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-neutral-700 mb-2">ID Number</label>
                <input
                  type="text"
                  name="cccd"
                  value={editingPassenger?.cccd}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg text-sm md:text-base"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-neutral-700 mb-2">Country Code</label>
                <input
                  type="text"
                  name="country_code"
                  value={editingPassenger?.country_code}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg text-sm md:text-base"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-neutral-700 mb-2">Ticket ID</label>
                <input
                  type="number"
                  name="ticket_id"
                  value={editingPassenger?.ticket_id}
                  disabled
                  className="w-full p-2 border rounded-lg text-sm md:text-base"
                  required
                />
              </div>

              <div>
                <label className="block text-neutral-700 mb-2">Associated Adult ID</label>
                <input
                  type="number"
                  name="associated_adult_id"
                  value={editingPassenger?.associated_adult_id ?? ""}
                  disabled
                  className="w-full p-2 border rounded-lg text-sm md:text-base"
                  required
                />
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
                  {editingPassenger ? "Update" : "Submit"}
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

export default TicketPassengers;
