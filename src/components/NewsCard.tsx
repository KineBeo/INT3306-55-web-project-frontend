import { BsGift } from "react-icons/bs";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Image from "next/image";

interface NewsProps {
  id: number;
  title: string;
  description: string;
  image: string;
  loading: boolean;
  handleRedeem: (id: number) => Promise<void>;
}

const NewsCard = ({ id, title, description, image, loading, handleRedeem }: NewsProps) => {
  return (
    <div
      key={id}
      className="flex-none w-60 md:w-72 snap-start"
      role="article"
      aria-label={`${title} news`}
    >
      <div className="bg-white rounded-xl border-2 shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl focus-within:ring-2 focus-within:ring-blue-500">
        <div className="relative md:h-48 h-40 overflow-hidden">
          <Image
            src={image}
            alt={title}
            loading="lazy"
            fill
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-3 md:p-6">
          {/* Title - Force to one line and truncate if too long */}
          <h3 className="text-md md:text-xl font-bold text-neutral-900 md:mb-2 truncate">{title}</h3>

          {/* Description - Force to one line and truncate if too long */}
          <p className="text-sm md:text-md text-neutral-600 mb-2 md:mb-4 truncate">{description}</p>

          <button
            onClick={() => handleRedeem(id)}
            disabled={loading}
            className="text-sm md:text-md w-full bg-primary-500 text-white py-3 rounded-lg font-semibold transition-all duration-300 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-700 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <AiOutlineLoading3Quarters className="animate-spin mr-2" />
            ) : (
              <BsGift className="mr-2" />
            )}
            {loading ? "Redeeming..." : "Redeem Now"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
