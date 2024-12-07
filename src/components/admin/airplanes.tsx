"use client";

import React, { useState } from "react";
import { Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from "@nextui-org/modal";
import { FaTrash, FaEdit, FaSearch } from "react-icons/fa";
import { Airplane } from "@/data/types";
import { airplanes } from "@/data/fakeData";

const Airplanes = () => {
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const [isEditing, setIsEditing] = useState(false);
  const [editingAirplane, setEditingAirplane] = useState<Airplane>({
    id: 0,
    modelName: "",
    manufacturer: "",
    serialNumber: "",
    registrationNumber: "",
    capacity: 0,
    economySeats: 0,
    businessSeats: 0,
    firstClassSeats: 0,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    modelName: "",
    manufacturer: "",
    serialNumber: "",
    registrationNumber: "",
    capacity: 0,
    economySeats: 0,
    businessSeats: 0,
    firstClassSeats: 0,
  });

  const [airplaneList, setAirplaneList] = useState(airplanes);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      airplane.modelName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      airplane.manufacturer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      airplane.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isEditing) {
      const updatedAirplanes = airplaneList.map((airplane) =>
        airplane.id === editingAirplane.id ? { ...formData, id: airplane.id } : airplane
      );
      setAirplaneList(updatedAirplanes);
      setIsEditing(false);
    } else {
      const newAirplane = {
        id: airplaneList.length + 1,
        ...formData,
      };
      setAirplaneList([...airplaneList, newAirplane]);
    }
    setFormData({
      modelName: "",
      manufacturer: "",
      serialNumber: "",
      registrationNumber: "",
      capacity: 0,
      economySeats: 0,
      businessSeats: 0,
      firstClassSeats: 0,
    });
    //close modal
    onClose();
  };

  const handleDeleteAirplane = (id: number) => {
    setAirplaneList(airplaneList.filter((airplane) => airplane.id !== id));
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
                placeholder="Search airplanes..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-10 pr-4 py-2 border rounded-lg w-56 lg:w-64 text-sm md:text-base"
              />
              <FaSearch className="absolute left-3 top-3 text-neutral-400" />
            </div>
            <div className="order-0 md:order-1">
              <button
                onClick={() => {
                  setIsEditing(false);
                  setFormData({
                    modelName: "",
                    manufacturer: "",
                    serialNumber: "",
                    registrationNumber: "",
                    capacity: 0,
                    economySeats: 0,
                    businessSeats: 0,
                    firstClassSeats: 0,
                  });
                  onOpen();
                }}
                className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors text-sm lg:text-base">
                Add New Airplane
              </button>
            </div>
          </div>

          <div className="overflow-auto">
            <table className="w-full divide-y divide-neutral-200">
              <thead className="bg-neutral-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Model Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Manufacturer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Registration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Capacity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-200">
                {filteredAirplanes.map((airplane) => (
                  <tr key={airplane.id}>
                    <td className="px-6 py-4 whitespace-nowrap xl:hidden">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditAirplane(airplane)}
                          className="text-primary-500 hover:text-primary-600">
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteAirplane(airplane.id)}
                          className="text-red-500 hover:text-red-600">
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm md:text-base">{airplane.modelName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm md:text-base">{airplane.manufacturer}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm md:text-base">{airplane.registrationNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm md:text-base">{airplane.capacity}</td>
                    <td className="px-6 py-4 whitespace-nowrap xl:block hidden">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditAirplane(airplane)}
                          className="text-primary-500 hover:text-primary-600">
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteAirplane(airplane.id)}
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
            <h3 className="text-lg md:text-xl font-bold">{isEditing ? "Edit Article" : "Add New Article"}</h3>
          </ModalHeader>
          <ModalBody>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-4 mb-4">
                <div>
                  <label className="block text-neutral-700 mb-2">Model Name</label>
                  <input
                    type="text"
                    name="modelName"
                    value={formData.modelName}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 mb-2">Manufacturer</label>
                  <input
                    type="text"
                    name="manufacturer"
                    value={formData.manufacturer}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 mb-2">Serial Number</label>
                  <input
                    type="text"
                    name="serialNumber"
                    value={formData.serialNumber}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 mb-2">Registration Number</label>
                  <input
                    type="text"
                    name="registrationNumber"
                    value={formData.registrationNumber}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 mb-2">Total Capacity</label>
                  <input
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg"
                    required
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 mb-2">Economy Seats</label>
                  <input
                    type="number"
                    name="economySeats"
                    value={formData.economySeats}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg"
                    required
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 mb-2">Business Seats</label>
                  <input
                    type="number"
                    name="businessSeats"
                    value={formData.businessSeats}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg"
                    required
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 mb-2">First Class Seats</label>
                  <input
                    type="number"
                    name="firstClassSeats"
                    value={formData.firstClassSeats}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg"
                    required
                    min="0"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 mb-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      modelName: "",
                      manufacturer: "",
                      serialNumber: "",
                      registrationNumber: "",
                      capacity: 0,
                      economySeats: 0,
                      businessSeats: 0,
                      firstClassSeats: 0,
                    });
                    onClose();
                  }}
                  className="px-4 py-2 text-neutral-600 rounded-lg hover:bg-neutral-100 text-sm md:text-base">
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 text-sm md:text-base">
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
    <div className="p-6 md:p-12 w-full">
      {/* Main Content */}
      <div>{renderContent()}</div>

      {/* Modal */}
      <div>{renderModal()}</div>
    </div>
  );
};

export default Airplanes;
