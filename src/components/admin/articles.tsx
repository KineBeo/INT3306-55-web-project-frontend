"use client";

import { useState, useEffect } from "react";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/modal";
import { FaTrash, FaEdit, FaSearch } from "react-icons/fa";
import { useOverlay } from "@/context/OverlayContext";
import { Article } from "@/data/article";
import api from "@/services/apiClient";
import { formatDateToDDMMYYYY } from "@/utils/formatDate";

const Articles = () => {
  const { setLoading } = useOverlay();
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const [isEditing, setIsEditing] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>();
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState<Article>({
    id: 0,
    title: "",
    description: "",
    content: "",
    image_url: "",
    status: "DRAFT",
    created_at: new Date().toLocaleDateString("en-GB", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }),
  });

  // Sample articles data
  const [articleList, setArticleList] = useState<Article[]>([]);

  useEffect(() => {
    setLoading(true);
    api.get("/article").then((response) => {
      const articles = response.data.map((article: Article) => ({
        id: article.id,
        title: article.title,
        description: article.description,
        content: article.content,
        image_url: article.image_url,
        status: article.status,
        created_at: formatDateToDDMMYYYY(article.created_at),
      }));
      setArticleList(articles.sort((a: Article, b: Article) => a.id - b.id));
      setLoading(false);
    });
  }, [setLoading, setArticleList]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
      article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const resetForm = () => {
    setIsEditing(false);
    setEditingArticle(null);
    setFormData({
      id: 0,
      title: "",
      description: "",
      content: "",
      image_url: "",
      status: "DRAFT",
      created_at: new Date().toLocaleDateString("en-GB", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }),
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isEditing && editingArticle) {
      try {
        setLoading(true);
        api
          .patch(`/article/${editingArticle.id}`, {
            title: formData.title,
            description: formData.description,
            content: formData.content,
            image_url: formData.image_url,
            status: formData.status,
          })
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          .then((_) => {
            const updatedArticles = articleList.map((article) =>
              article.id === editingArticle.id ? { ...formData, id: article.id } : article
            );
            setArticleList(updatedArticles);
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
          .post("/article", {
            title: formData.title,
            description: formData.description,
            content: formData.content,
            image_url: formData.image_url,
          })
          .then((response) => {
            const newArticle = {
              id: response.data.id,
              title: response.data.title,
              description: response.data.description,
              content: response.data.content,
              image_url: response.data.image_url,
              status: response.data.status,
              created_at: formatDateToDDMMYYYY(response.data.created_at),
            };
            setArticleList([...articleList, newArticle]);
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

  const handleDeleteArticle = (id: number) => {
    try {
      setLoading(true);
      api.delete(`/article/${id}`).then(() => {
        const updatedArticles = articleList.filter((article) => article.id !== id);
        setArticleList(updatedArticles);
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditArticle = (article: Article) => {
    setIsEditing(true);
    setEditingArticle(article);
    setFormData(article);
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
                  resetForm();
                  onOpen();
                }}
                className="bg-primary-500 text-white px-4 py-3 rounded-lg hover:bg-primary-600 transition-colors text-sm lg:text-base">
                Add New Article
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
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Content
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Image
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Create at
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider xl:block hidden">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-200">
                {filteredArticles.map((article) => (
                  <tr key={article.id}>
                    <td className="px-4 py-3 whitespace-nowrap xl:hidden">
                      <div className="flex space-x-2 justify-center">
                        <button
                          onClick={() => handleEditArticle(article)}
                          className="text-primary-500 hover:text-primary-600">
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => {
                            setIsDeleteModalOpen(true);
                            setEditingArticle(article);
                          }}
                          className="text-red-500 hover:text-red-600">
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm md:text-base text-center">{article.id}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm md:text-base">{article.title}</td>
                    <td className="px-4 py-3">
                      <div className="truncate max-w-[250px] text-sm md:text-base">{article.description}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="truncate max-w-[400px] text-sm md:text-base">{article.content}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="truncate max-w-[200px] text-sm md:text-base">{article.image_url}</div>
                    </td>
                    <td
                      className={`px-4 py-3 whitespace-nowrap text-xs md:text-sm text-center ${
                        article.status === "DRAFT" ? "text-[#ec9543]" : "text-green-600"
                      }`}>
                      {article.status}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm md:text-base">{article.created_at}</td>
                    <td className="px-4 py-3 whitespace-nowrap xl:block hidden">
                      <div className="flex space-x-2 justify-center">
                        <button
                          onClick={() => handleEditArticle(article)}
                          className="text-primary-500 hover:text-primary-600">
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => {
                            setIsDeleteModalOpen(true);
                            setEditingArticle(article);
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
                  setEditingArticle(null);
                }}
                className="px-4 py-3 text-neutral-600 rounded-lg hover:bg-neutral-100 text-sm md:text-base">
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  handleDeleteArticle(editingArticle?.id || 0);
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
            <h3 className="text-lg md:text-xl font-bold">{isEditing ? "Edit Article" : "Add New Article"}</h3>
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
                <label className="block text-neutral-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg text-sm md:text-base"
                  rows={2}
                  required></textarea>
              </div>

              <div className="mb-4">
                <label className="block text-neutral-700 mb-2">Content</label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg text-sm md:text-base"
                  rows={4}
                  required></textarea>
              </div>

              <div className="mb-4">
                <label className="block text-neutral-700 mb-2">Image URL</label>
                <input
                  type="url"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg mb-2 text-sm md:text-base"
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
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
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

export default Articles;
