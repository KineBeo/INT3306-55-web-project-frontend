"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import SearchForm from "@/components/SearchForm";
import sectionBackground from "@/images/section-background.png";
import becomeAnAuthorImg from "@/images/BecomeAnAuthorImg.png";
import Image from "next/image";
import ArticleCard from "@/components/ArticleCard";
import DestinationCard from "@/components/DestinationCard";
import { clearTicket, clearPassengers, clearTotalPrice } from "@/redux/ticket/ticketSlice";
import { useAppDispatch } from "@/redux/hooks";
import { usePathname } from "next/navigation";
import { slides, popularDestinations } from "@/data/fakeData";
import { Article } from "@/data/article";
import eventBus from "@/utils/eventBus";
import { formatDateToDDMMYYYY } from "@/utils/formatDate";
import { useOverlay } from "@/context/OverlayContext";
import api from "@/services/apiClient";
import LoadingButton from "@/shared/LoadingButton";

const Home = () => {
  const { setLoading } = useOverlay();
  const [activeSlide, setActiveSlide] = useState(0);
  const searchFormRef = useRef<HTMLDivElement>(null);
  const articlesRef = useRef<HTMLHeadingElement>(null);
  const dispatch = useAppDispatch();
  const currentPath = usePathname();

  useEffect(() => {
    // Kiểm tra khi route đã thay đổi
    if (currentPath === "/") {
      // Dispatch action clearFlight khi navigation hoàn tất
      dispatch(clearTicket());
      dispatch(clearPassengers());
      dispatch(clearTotalPrice());
    }
  }, [currentPath, dispatch]);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  const [articleList, setArticleList] = useState<Article[]>([]);
  const [visibleCount, setVisibleCount] = useState(4);

  useEffect(() => {
    setLoading(true);
    api.get("/article/published").then((response) => {
      const articles = response.data.map((article: Article) => ({
        ...article,
        created_at: formatDateToDDMMYYYY(article.created_at),
      }));
      setArticleList(articles.sort((a: Article, b: Article) => a.id - b.id));
      setLoading(false);
    });
  }, [setLoading, setArticleList]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleScrollIntoView = (ref: any) => {
    if (ref.current) {
      ref.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  const handleShowMore = () => {
    setVisibleCount((prevCount) => {
      if (prevCount >= articleList.length) {
        return 4;
      }
      return prevCount + 4;
    });

    handleScrollIntoView(articlesRef);
  };

  // Hàm cuộn đến SearchForm khi nút Book Now được nhấn
  const handleBookNow = () => {
    handleScrollIntoView(searchFormRef);
    eventBus.emit("bookNowClicked");
  };

  return (
    <div>
      <div className="flex flex-col items-center justify-center bg-white md:px-10 md:py-5 px-5 py-2">
        <div className="relative w-full md:h-[80vh] h-[40vh] overflow-hidden rounded-3xl">
          {slides.map((slide, index) => (
            <motion.div
              key={slide.id}
              initial={{ opacity: 0 }}
              animate={{
                opacity: index === activeSlide ? 1 : 0,
                scale: index === activeSlide ? 1 : 1.1,
              }}
              transition={{ duration: 0.7 }}
              className={`absolute w-full h-full ${index === activeSlide ? "z-20" : "z-10"}`}>
              <Image src={slide.image} alt={slide.title} loading="lazy" fill className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent">
                <div className="relative h-full flex items-center justify-start md:px-12 lg:px-20 px-6 z-10">
                  <div className="text-white max-w-xl relative">
                    <h1 className="text-2xl md:text-6xl font-bold mb-3 md:mb-6 leading-tight">{slide.title}</h1>
                    <p className="text-md md:text-2xl mb-5 md:mb-9">{slide.description}</p>
                    <button
                      onClick={handleBookNow}
                      className="bg-gradient-to-r from-primary-6000 to-primary-500 text-white px-6 md:px-8 py-3 rounded-full text-md md:text-lg font-semibold hover:bg-gradient-to-r hover:from-primary-700 hover:to-primary-6000 hover:shadow-lg">
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="relative w-full flex flex-col items-center bottom-8 lg:bottom-28 z-30">
          {/* Buttons */}
          <div className="flex space-x-3">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveSlide(index)}
                className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
                  index === activeSlide ? "bg-white scale-125" : "bg-white/50 scale-100"
                }`}
              />
            ))}
          </div>

          {/* SearchForm */}
          <div
            ref={searchFormRef}
            className="w-[70%] rounded-[2.5rem] shadow-xl px-10 py-8 bg-white mt-4 hidden lg:block border-small">
            <h2
              className="text-center text-3xl font-semibold mb-6 text-neutral-900"
              style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.2)" }}>
              Book Your Flight Tickets with Ease!
            </h2>
            <SearchForm />
          </div>
          <div className="flex flex-col justify-start w-full py-10 md:py-12 gap-2 md:gap-6">
            <h2 className="text-xl md:text-4xl font-bold text-neutral-900 md:px-12 lg:px-20">
              Suggestions for discovery
            </h2>
            <h4 className="text-neutral-500 text-sm md:text-lg font-medium md:px-12 lg:px-20">
              Popular places to recommends for you
            </h4>
            {/* Cards */}
            <div className="flex gap-6 justify-start md:justify-center overflow-x-auto md:overflow-visible md:flex-wrap md:px-10">
              {popularDestinations.map((dest) => (
                <div key={dest.id}>
                  <DestinationCard destination={dest} onClick={handleBookNow} />
                </div>
              ))}
            </div>
            <h2
              ref={articlesRef}
              tabIndex={-1}
              className="text-xl md:text-4xl font-bold text-neutral-900 md:px-12 lg:px-20 mt-6">
              Articles
            </h2>
            {/* Cards */}
            <div className="flex gap-6 justify-start md:justify-center overflow-x-auto md:overflow-visible md:flex-wrap md:px-10">
              {articleList.slice(0, visibleCount).map((article) => (
                <div key={article.id}>
                  <ArticleCard article={article} />
                </div>
              ))}
            </div>
            <div className="flex justify-center">
              {articleList.length > 0 && (
                <LoadingButton
                  onClick={handleShowMore}
                  text={visibleCount < articleList.length ? " -- Show me more --" : "-- Hide --"}
                  classNames={{
                    base: "flex justify-center item-center bg-white text-neutral-600 text-sm md:text-base px-8 py-3 rounded-lg font-semibold hover:bg-neutral-50 hover:shadow-xl border-3 border-primary-500",
                    loading: "bg-white",
                  }}
                />
              )}
            </div>
          </div>
          <div className="relative flex justify-between items-center rounded-3xl gap-6 md:px-12 lg:px-20 px-6 md:py-12 py-10 bg-gray-100 w-full">
            {/* Background image */}
            <div className="absolute inset-0">
              <Image alt="sectionBackground" src={sectionBackground} fill className="object-cover" />
            </div>

            {/* Left */}
            <div className="relative z-10 flex flex-col justify-center gap-1 md:gap-6 md:w-1/2">
              <h2 className="text-xl md:text-4xl font-bold text-neutral-900">Why did you choose us?</h2>
              <div className="text-sm md:text-md text-neutral-500 font-medium">
                Join us for a journey filled with unforgettable experiences. QAirline makes the process of booking
                flights seamless and stress-free. Whether you’re planning a quick getaway or a long-awaited adventure,
                our user-friendly platform ensures a fast, convenient, and efficient ticket booking experience tailored
                to your needs.
              </div>
            </div>

            {/* Right */}
            <div className="hidden md:block relative z-10 w-1/2">
              <Image alt="becomeAnAuthorImg" src={becomeAnAuthorImg} className="object-contain" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
