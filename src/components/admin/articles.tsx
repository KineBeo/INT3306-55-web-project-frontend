"use client";

import React, { useState } from "react";
import { Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from "@nextui-org/modal";
import { FaUpload, FaTrash, FaEdit, FaSearch } from "react-icons/fa";
import Image from "next/image";
import { Article } from "@/data/types";
import { articles } from "@/data/fakeData";
// import { components } from "@/types/api";

// type A = components['schemas']['Article'];

const Articles = () => {
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const [isEditing, setIsEditing] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article>({ id: 0, title: "", image: "", description: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    image: "",
    description: "",
  });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Sample articles data
  const [articleList, setArticleList] = useState(articles);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredArticles = articleList.filter(
    (article) =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null; // Kiểm tra nếu file tồn tại
    setSelectedFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setPreviewImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isEditing) {
      const updatedArticles = articleList.map((article) =>
        article.id === editingArticle.id ? { ...formData, id: article.id } : article
      );
      setArticleList(updatedArticles);
      setIsEditing(false);
    } else {
      const newArticle = {
        id: articleList.length + 1,
        ...formData,
      };
      setArticleList([...articleList, newArticle]);
    }
    setFormData({ title: "", image: "", description: "" });
    setSelectedFile(null);
    setPreviewImage(null);
    //close modal
    onClose();
  };

  const handleDeleteArticle = (id: number) => {
    setArticleList(articleList.filter((article) => article.id !== id));
  };

  const handleEditArticle = (article: Article) => {
    setIsEditing(true);
    setEditingArticle(article);
    setFormData({
      title: article.title,
      image: article.image,
      description: article.description,
    });
    onOpen();
  };

  const renderContent = () => {
    return (
      <div>
        <h2 className="text-xl md:text-2xl font-bold mb-4">Article Management</h2>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4 md:gap-0">
            <div className="relative order-1 md:order-0">
              <input
                type="text"
                placeholder="Search articles..."
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
                  setFormData({ title: "", image: "", description: "" });
                  onOpen();
                }}
                className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors text-sm lg:text-base">
                Add New Article
              </button>
            </div>
          </div>

          <div className="overflow-auto">
            <table className="w-full divide-y divide-neutral-200">
              <thead className="bg-neutral-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider xl:hidden">
                    Actions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider xl:block hidden">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-200">
                {filteredArticles.map((article) => (
                  <tr key={article.id}>
                    <td className="px-6 py-4 whitespace-nowrap xl:hidden">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditArticle(article)}
                          className="text-primary-500 hover:text-primary-600">
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteArticle(article.id)}
                          className="text-red-500 hover:text-red-600">
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm md:text-base">{article.title}</td>
                    <td className="px-6 py-4">
                      <div className="truncate max-w-md text-sm md:text-base">{article.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap xl:block hidden">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditArticle(article)}
                          className="text-primary-500 hover:text-primary-600">
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteArticle(article.id)}
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
              <div className="mb-4">
                <label className="block text-neutral-700 mb-2">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg text-sm md:text-base"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-neutral-700 mb-2">Image URL</label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg mb-2 text-sm md:text-base"
                />
                <div className="- or -">
                  <p className="text-center text-neutral-500 my-2">OR</p>
                </div>
                <label className="flex items-center justify-center w-full p-2 border rounded-lg cursor-pointer hover:bg-neutral-50">
                  <FaUpload className="mr-2 text-sm md:text-base" />
                  Upload Image
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
                {previewImage && (
                  <div className="mt-2 flex justify-center">
                    <Image
                      src={previewImage}
                      alt="Preview"
                      width={128}
                      height={128}
                      className="rounded-lg object-cover"
                    />
                  </div>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-neutral-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg text-sm md:text-base"
                  rows={4}
                  required></textarea>
              </div>

              <div className="flex justify-end space-x-2 mb-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({ title: "", image: "", description: "" });
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

export default Articles;
