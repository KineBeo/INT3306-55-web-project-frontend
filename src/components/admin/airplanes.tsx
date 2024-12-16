/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/modal";
import { FaTrash, FaEdit, FaSearch } from "react-icons/fa";
import { useOverlay } from "@/context/OverlayContext";
import { Airplane, CreateAirplane, UpdateAirplane } from "@/data/airplane";
import api from "@/services/apiClient";

const Airplanes = () => {
  const { setLoading } = useOverlay();
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const [editNumber, setEditNumber] = useState(-1);
  const [editingAirplane, setEditingAirplane] = useState<UpdateAirplane | null>();
  const [createAirplane, setCreateAirplane] = useState<CreateAirplane>({
    model_name: "",
    manufacturer: "",
    serial_number: "",
    registration_number: "",
    capacity: 0,
    economy_seats: 0,
    business_seats: 0,
    first_class_seats: 0,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  // Sample airplanes data
  const [airplaneList, setAirplaneList] = useState<Airplane[]>([]);

  useEffect(() => {
    setLoading(true);
    api
      .get("/airplane")
      .then((response) => {
        const airplanes = response.data;
        setAirplaneList(airplanes.sort((a: Airplane, b: Airplane) => a.id - b.id));
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [setLoading, setAirplaneList]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (editNumber !== -1 && editingAirplane) {
      setEditingAirplane({
        ...editingAirplane,
        [e.target.name]: e.target.value,
      });
    } else {
      setCreateAirplane({
        ...createAirplane,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredAirplanes = airplaneList.filter(
    (airplane) =>
      airplane.model_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      airplane.manufacturer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      airplane.registration_number.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const resetForm = () => {
    setEditNumber(-1);
    setEditingAirplane(null);
    setCreateAirplane({
      model_name: "",
      manufacturer: "",
      serial_number: "",
      registration_number: "",
      capacity: 0,
      economy_seats: 0,
      business_seats: 0,
      first_class_seats: 0,
    });
    setError("");
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editNumber !== -1 && editingAirplane) {
      setLoading(true);
      api
        .patch(`/airplane/${editNumber}`, editingAirplane)
        .then((res) => {
          const updateAirplanes = airplaneList.map((airplane) =>
            airplane.id === editNumber
              ? res.data
              : airplane
          );
          setAirplaneList(updateAirplanes);
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
      setLoading(true);
      api
        .post("/airplane", createAirplane)
        .then((response) => {
          const newAirplane = response.data;
          setAirplaneList([...airplaneList, newAirplane]);
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

  const handleDeleteAirplane = (id: number) => {
    setLoading(true);
    api
      .delete(`/airplane/${id}`)
      .then(() => {
        const updatedAirplanes = airplaneList.filter((airplane) => airplane.id !== id);
        setAirplaneList(updatedAirplanes);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const setEditing = (airplane: Airplane) => {
    if (!airplane) {
      setEditNumber(-1);
      setEditingAirplane(null);
      return;
    }
    setEditNumber(airplane.id);
    setEditingAirplane({
      model_name: airplane.model_name,
      manufacturer: airplane.manufacturer,
      serial_number: airplane.serial_number,
      registration_number: airplane.registration_number,
      capacity: airplane.capacity,
      economy_seats: airplane.economy_seats,
      business_seats: airplane.business_seats,
      first_class_seats: airplane.first_class_seats,
      status: airplane.status,
    });
  };

  const handleEditAirplane = (airplane: Airplane) => {
    setError("");
    setEditing(airplane);
    onOpen();
  };

  const renderContent = () => {
    return (
      <div>
        <h2 className="text-xl md:text-2xl font-bold mb-4">Airplane Management</h2>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4 md:gap-0">
            <div className="relative order-1 md:order-0">
              <input
                type="text"
                placeholder="Search airplane..."
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
                Add New Airplane
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
                    Model Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Registeration Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Capacity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Economy Seats
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Business Seats
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    First Class Seats
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
                {filteredAirplanes.map((airplane, index) => (
                  <tr key={airplane.id}>
                    <td className="px-4 py-3 whitespace-nowrap xl:hidden">
                      <div className="flex space-x-2 justify-center">
                        <button
                          onClick={() => handleEditAirplane(airplane)}
                          className="text-primary-500 hover:text-primary-600">
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => {
                            setEditing(airplane);
                            setIsDeleteModalOpen(true);
                          }}
                          className="text-red-500 hover:text-red-600">
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm md:text-base text-center">{index + 1}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm md:text-base text-center">
                      {airplane.model_name}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm md:text-base text-center">
                      {airplane.registration_number}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm md:text-base text-center">
                      {airplane.capacity}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm md:text-base text-center">
                      {airplane.economy_seats}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm md:text-base text-center">
                      {airplane.business_seats}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm md:text-base text-center">
                      {airplane.first_class_seats}
                    </td>
                    <td
                      className={`px-4 py-3 whitespace-nowrap text-xs md:text-sm text-center ${
                        airplane.status === "INACTIVE" ? "text-[#ec9543]" : "text-green-600"
                      }`}>
                      {airplane.status}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap xl:block hidden">
                      <div className="flex space-x-2 justify-center">
                        <button
                          onClick={() => handleEditAirplane(airplane)}
                          className="text-primary-500 hover:text-primary-600">
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => {
                            setEditing(airplane);
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
                  setEditingAirplane(null);
                }}
                className="px-4 py-3 text-neutral-600 rounded-lg hover:bg-neutral-100 text-sm md:text-base">
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  handleDeleteAirplane(editNumber);
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
            <h3 className="text-lg md:text-xl font-bold">{editingAirplane ? "Edit Airplane" : "Add New Airplane"}</h3>
          </ModalHeader>
          <ModalBody>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-neutral-700 mb-2">Model name</label>
                <input
                  type="text"
                  name="model_name"
                  value={editingAirplane ? editingAirplane.model_name : createAirplane.model_name}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg text-sm md:text-base"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-neutral-700 mb-2">Manufacturer</label>
                <input
                  type="text"
                  name="manufacturer"
                  value={editingAirplane ? editingAirplane.manufacturer : createAirplane.manufacturer}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg text-sm md:text-base"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-neutral-700 mb-2">Serial number</label>
                <input
                  type="text"
                  name="serial_number"
                  value={editingAirplane ? editingAirplane.serial_number : createAirplane.serial_number}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg text-sm md:text-base"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-neutral-700 mb-2">Registration number</label>
                <input
                  type="text"
                  name="registration_number"
                  value={editingAirplane ? editingAirplane.registration_number : createAirplane.registration_number}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg text-sm md:text-base"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-neutral-700 mb-2">Capacity</label>
                <input
                  type="number"
                  name="capacity"
                  value={editingAirplane ? editingAirplane.capacity : createAirplane.capacity}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg text-sm md:text-base"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-neutral-700 mb-2">Economy seats</label>
                <input
                  type="number"
                  name="economy_seats"
                  value={editingAirplane ? editingAirplane.economy_seats : createAirplane.economy_seats}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg text-sm md:text-base"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-neutral-700 mb-2">Business seats</label>
                <input
                  type="number"
                  name="business_seats"
                  value={editingAirplane ? editingAirplane.business_seats : createAirplane.business_seats}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg text-sm md:text-base"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-neutral-700 mb-2">First class seats</label>
                <input
                  type="number"
                  name="first_class_seats"
                  value={editingAirplane ? editingAirplane.first_class_seats : createAirplane.first_class_seats}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg text-sm md:text-base"
                  required
                />
              </div>

              <div>
                <label className="block text-neutral-700 mb-2">Status</label>
                <select
                  name="status"
                  value={editingAirplane ? editingAirplane.status : "INACTIVE"}
                  onChange={handleInputChange}
                  disabled={!editingAirplane}
                  required
                  className={`w-full p-2 border rounded-lg text-sm ${
                    editingAirplane ? "" : "cursor-not-allowed text-neutral-400"
                  }`}>
                  <option value="INACTIVE">InActive</option>
                  <option value="ACTIVE">Active</option>
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
                  {editingAirplane ? "Update" : "Submit"}
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

export default Airplanes;
