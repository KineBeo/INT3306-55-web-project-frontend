"use client";

import { useState, useEffect } from "react";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/modal";
import { FaTrash, FaEdit, FaSearch } from "react-icons/fa";
import { useOverlay } from "@/context/OverlayContext";
import { Airplane } from "@/data/airplane";
import api from "@/services/apiClient";

const Tickets = () => {
  const { setLoading } = useOverlay();
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const [isEditing, setIsEditing] = useState(false);
  const [editingAirplane, setEditingAirplane] = useState<Airplane | null>();
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState<Airplane>({
    id: 0,
    model_name: "",
    manufacturer: "",
    serial_number: "",
    registration_number: "",
    capacity: 0,
    economy_seats: 0,
    business_seats: 0,
    first_class_seats: 0,
    status: "INACTIVE",
  });

  // Sample airplanes data
  const [airplaneList, setAirplaneList] = useState<Airplane[]>([]);

  useEffect(() => {
    setLoading(true);
    api.get("/airplane").then((response) => {
      const airplanes = response.data.map((airplane: Airplane) => ({
        id: airplane.id,
        model_name: airplane.model_name,
        manufacturer: airplane.manufacturer,
        serial_number: airplane.serial_number,
        registration_number: airplane.registration_number,
        capacity: airplane.capacity,
        economy_seats: airplane.economy_seats,
        business_seats: airplane.business_seats,
        first_class_seats: airplane.first_class_seats,
        status: airplane.status,
      }));
      setAirplaneList(airplanes.sort((a: Airplane, b: Airplane) => a.id - b.id));
      setLoading(false);
    });
  }, [setLoading, setAirplaneList]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
    setIsEditing(false);
    setEditingAirplane(null);
    setFormData({
      id: 0,
      model_name: "",
      manufacturer: "",
      serial_number: "",
      registration_number: "",
      capacity: 0,
      economy_seats: 0,
      business_seats: 0,
      first_class_seats: 0,
      status: "INACTIVE",
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isEditing && editingAirplane) {
      try {
        setLoading(true);
        api
          .patch(`/airplane/${editingAirplane.id}`, {
            model_name: formData.model_name,
            manufacturer: formData.manufacturer,
            serial_number: formData.serial_number,
            registration_number: formData.registration_number,
            capacity: formData.capacity,
            economy_seats: formData.economy_seats,
            business_seats: formData.business_seats,
            first_class_seats: formData.first_class_seats,
            status: formData.status,
          })
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          .then((_) => {
            const updateAirplanes = airplaneList.map((airplane) =>
              airplane.id === editingAirplane.id ? { ...formData, id: airplane.id } : airplane
            );
            setAirplaneList(updateAirplanes);
          });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    } else {
      try {
        setLoading(true);
        api
          .post("/airplane", {
            model_name: formData.model_name,
            manufacturer: formData.manufacturer,
            serial_number: formData.serial_number,
            registration_number: formData.registration_number,
            capacity: formData.capacity,
            economy_seats: formData.economy_seats,
            business_seats: formData.business_seats,
            first_class_seats: formData.first_class_seats,
          })
          .then((response) => {
            const newAirplane = {
              id: response.data.id,
              model_name: response.data.model_name,
              manufacturer: response.data.manufacturer,
              serial_number: response.data.serial_number,
              registration_number: response.data.registration_number,
              capacity: response.data.capacity,
              economy_seats: response.data.economy_seats,
              business_seats: response.data.business_seats,
              first_class_seats: response.data.first_class_seats,
              status: response.data.status,
            };
            setAirplaneList([...airplaneList, newAirplane]);
          });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    resetForm();
    //close modal
    onClose();
  };

  const handleDeleteAirplane = (id: number) => {
    try {
      setLoading(true);
      api.delete(`/airplane/${id}`).then(() => {
        const updatedAirplanes = airplaneList.filter((airplane) => airplane.id !== id);
        setAirplaneList(updatedAirplanes);
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditAirplane = (airplane: Airplane) => {
    setIsEditing(true);
    setEditingAirplane(airplane);
    setFormData(airplane);
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
                    ID
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
                {filteredAirplanes.map((airplane) => (
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
                            setIsDeleteModalOpen(true);
                            setEditingAirplane(airplane);
                          }}
                          className="text-red-500 hover:text-red-600">
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm md:text-base text-center">{airplane.id}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm md:text-base text-center">{airplane.model_name}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm md:text-base text-center">{airplane.registration_number}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm md:text-base text-center">{airplane.capacity}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm md:text-base text-center">{airplane.economy_seats}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm md:text-base text-center">{airplane.business_seats}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm md:text-base text-center">{airplane.first_class_seats}</td>
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
                            setIsDeleteModalOpen(true);
                            setEditingAirplane(airplane);
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
                  handleDeleteAirplane(editingAirplane?.id || 0);
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
            <h3 className="text-lg md:text-xl font-bold">{isEditing ? "Edit Airplane" : "Add New Airplane"}</h3>
          </ModalHeader>
          <ModalBody>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-neutral-700 mb-2">ID</label>
                <input
                  type="text"
                  name="id"
                  value={isEditing ? formData.id : "Auto-generated"}
                  disabled
                  className="w-full p-2 border rounded-lg text-sm md:text-base text-neutral-400 cursor-not-allowed"
                />
              </div>

              <div className="mb-4">
                <label className="block text-neutral-700 mb-2">Model name</label>
                <input
                  type="text"
                  name="model_name"
                  value={formData.model_name}
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
                  value={formData.manufacturer}
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
                  value={formData.serial_number}
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
                  value={formData.registration_number}
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
                  value={formData.capacity}
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
                  value={formData.economy_seats}
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
                  value={formData.business_seats}
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
                  value={formData.first_class_seats}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg text-sm md:text-base"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-neutral-700 mb-2">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full p-2 border rounded-lg text-sm md:text-base ${
                    isEditing ? "" : "cursor-not-allowed"
                  }`}>
                  <option value="INACTIVE">InActive</option>
                  <option value="ACTIVE">Active</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2 mb-4">
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
                  {isEditing ? "Update" : "Submit"}
                </button>
              </div>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  };

  return (
    <div className="p-6 md:p-12">
      {renderContent()}
      {renderModal()}
      {renderDeleteModal()}
    </div>
  );
};

export default Tickets;
