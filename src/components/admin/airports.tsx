"use client";

import { useState, useEffect } from "react";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/modal";
import { FaTrash, FaEdit, FaSearch } from "react-icons/fa";
import { useOverlay } from "@/context/OverlayContext";
import { Airport } from "@/data/airport";
import api from "@/services/apiClient";

const Airports = () => {
  const { setLoading } = useOverlay();
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const [isEditing, setIsEditing] = useState(false);
  const [editingAirport, setEditingAirport] = useState<Airport | null>();
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState<Airport>({
    id: 0,
    code: "",
    name: "",
    city: "",
    country: "",
  });

  // Sample airports data
  const [airportList, setAirportList] = useState<Airport[]>([]);

  useEffect(() => {
    setLoading(true);
    api.get("/airport").then((response) => {
      const airports = response.data.map((airport: Airport) => ({
        id: airport.id,
        code: airport.code,
        name: airport.name,
        city: airport.city,
        country: airport.country,
      }));
      setAirportList(airports.sort((a: Airport, b: Airport) => a.id - b.id));
      setLoading(false);
    });
  }, [setLoading, setAirportList]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredAirports = airportList.filter(
    (airport) =>
      airport.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      airport.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const resetForm = () => {
    setIsEditing(false);
    setEditingAirport(null);
    setFormData({
      id: 0,
      code: "",
      name: "",
      city: "",
      country: "",
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isEditing && editingAirport) {
      try {
        setLoading(true);
        api
          .patch(`/airport/${editingAirport.id}`, {
            code: formData.code,
            name: formData.name,
            city: formData.city,
            country: formData.country,
          })
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          .then((_) => {
            const updateAirports = airportList.map((airport) =>
              airport.id === editingAirport.id ? { ...formData, id: airport.id } : airport
            );
            setAirportList(updateAirports);
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
          .post("/airport", {
            code: formData.code,
            name: formData.name,
            city: formData.city,
            country: formData.country,
          })
          .then((response) => {
            const newAirport = {
              id: response.data.id,
              code: response.data.code,
              name: response.data.name,
              city: response.data.city,
              country: response.data.country,
            };
            setAirportList([...airportList, newAirport]);
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

  const handleDeleteAirport = (id: number) => {
    try {
      setLoading(true);
      api.delete(`/airport/${id}`).then(() => {
        const updatedAirports = airportList.filter((airport) => airport.id !== id);
        setAirportList(updatedAirports);
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditAirport = (airport: Airport) => {
    setIsEditing(true);
    setEditingAirport(airport);
    setFormData(airport);
    onOpen();
  };

  const renderContent = () => {
    return (
      <div>
        <h2 className="text-xl md:text-2xl font-bold mb-4">Airport Management</h2>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4 md:gap-0">
            <div className="relative order-1 md:order-0">
              <input
                type="text"
                placeholder="Search airport..."
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
                Add New Airport
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
                    Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    City
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Country
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-200">
                {filteredAirports.map((airport) => (
                  <tr key={airport.id}>
                    <td className="px-4 py-3 whitespace-nowrap xl:hidden">
                      <div className="flex space-x-2 justify-center">
                        <button
                          onClick={() => handleEditAirport(airport)}
                          className="text-primary-500 hover:text-primary-600">
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => {
                            setIsDeleteModalOpen(true);
                            setEditingAirport(airport);
                          }}
                          className="text-red-500 hover:text-red-600">
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm md:text-base text-center">{airport.id}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm md:text-base">{airport.code}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm md:text-base">{airport.name}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm md:text-base">{airport.city}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm md:text-base">{airport.country}</td>
                    <td className="px-4 py-3 whitespace-nowrap xl:block hidden">
                      <div className="flex space-x-2 justify-center">
                        <button
                          onClick={() => handleEditAirport(airport)}
                          className="text-primary-500 hover:text-primary-600">
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => {
                            setIsDeleteModalOpen(true);
                            setEditingAirport(airport);
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
                  setEditingAirport(null);
                }}
                className="px-4 py-3 text-neutral-600 rounded-lg hover:bg-neutral-100 text-sm md:text-base">
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  handleDeleteAirport(editingAirport?.id || 0);
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
            <h3 className="text-lg md:text-xl font-bold">{isEditing ? "Edit Airport" : "Add New Airport"}</h3>
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
                <label className="block text-neutral-700 mb-2">Code</label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg text-sm md:text-base"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-neutral-700 mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg text-sm md:text-base"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-neutral-700 mb-2">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg text-sm md:text-base"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-neutral-700 mb-2">Country</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg text-sm md:text-base"
                  required
                />
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

export default Airports;
