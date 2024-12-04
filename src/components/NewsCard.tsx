import { BsGift } from "react-icons/bs";
import Image from "next/image";
import { NewsData } from "@/data/types";
import { Modal, ModalContent, ModalBody, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/modal";

interface NewsProps {
  news: NewsData;
}

const NewsCard = ({ news }: NewsProps) => {
  const { id, title, description, image } = news;
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <div key={id} className="flex-none w-60 md:w-72 snap-start" role="article" aria-label={`${title} news`}>
      <div className="bg-white rounded-xl border-2 shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl focus-within:ring-2 focus-within:ring-blue-500">
        <div className="relative md:h-48 h-40 overflow-hidden">
          <Image src={image} alt={title} loading="lazy" fill className="w-full h-full object-cover" />
        </div>

        <div className="p-3 md:p-6">
          {/* Title - Force to one line and truncate if too long */}
          <h3 className="text-md md:text-xl font-bold text-neutral-900 md:mb-2 truncate">{title}</h3>

          {/* Description - Force to one line and truncate if too long */}
          <p className="text-sm md:text-md text-neutral-600 mb-2 md:mb-4 truncate">{description}</p>

          <button
            onClick={onOpen}
            className="text-sm md:text-md w-full bg-primary-500 text-white py-3 rounded-lg font-semibold transition-all duration-300 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-700 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
            <BsGift className="mr-2" />
            "View Details"
          </button>
          <Modal
            backdrop="opaque"
            isOpen={isOpen}
            onOpenChange={onOpenChange}
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
            closeButton: "hidden"
          }}>
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader>
                    <div className="relative w-full md:h-[200px] h-[150px]">
                      <Image src={image} alt={title} loading="lazy" fill className="w-full object-cover rounded-xl" />
                    </div>
                  </ModalHeader>
                  <ModalBody>
                    <div className="flex flex-col gap-1">
                      <p className="text-base lg:text-xl font-semibold text-neutral-800">
                        {title}
                      </p>
                      <p className="text-sm text-neutral-600">
                        {description}
                      </p>
                    </div>
                  </ModalBody>
                  <ModalFooter>
                    <button
                      onClick={onClose}
                      className="text-sm md:text-md px-4 md:px-6 py-2 border-2 border-[#ec9543] text-white rounded-lg bg-[#ec9543] hover:bg-white hover:text-neutral-600">
                      Close
                    </button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
