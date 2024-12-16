import { FaPlane } from "react-icons/fa";

const LoadingOverlay = () => {
  const dots = Array.from({ length: 12 }, (_, i) => i);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-[9999]">
      {/* Rotating dots */}
      {dots.map((dot, index) => (
        <div
          key={dot}
          className="absolute left-1/2 top-1/2 w-2 h-2 bg-primary-300 rounded-full "
          style={{
            animation: "rotateDotsAnimation 3s linear infinite",
            transformOrigin: "center",
            transform: `rotate(${index * 30}deg) translateY(-35px) translateX(-50%)`,
          }}
        />
      ))}
      {/* Plane moving along the circle */}
      <div className="absolute left-1/2 top-1/2 w-24 h-24 -translate-x-11 -translate-y-11 flex flex-col justify-center p-[0.1rem]">
        <div className="animate-spin duration-1000">
          <FaPlane className="text-white text-3xl transform -rotate-90 w-6 h-6" />
        </div>
      </div>

      <style jsx>{`
        @keyframes rotateDotsAnimation {
          from {
            opacity: 0.3;
          }
          50% {
            opacity: 1;
          }
          to {
            opacity: 0.3;
          }
        }
        @keyframes movePlaneAlongCircle {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingOverlay;
