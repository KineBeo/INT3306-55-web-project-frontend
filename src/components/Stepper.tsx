import React from "react";

interface StepperProps {
  steps?: { title: string; description: string }[];
  currentStep: number;
}

const defaultSteps = [
  {
    title: "Select flight",
    description: "Please select a flight",
  },
  {
    title: "Make a reservation",
    description: "Please fill in the information",
  },
//   {
//     title: "Payment",
//     description: "Pay to get your flight ticket",
//   },
];

const Stepper: React.FC<StepperProps> = ({ steps = defaultSteps, currentStep = 1 }) => {
  return (
    <div className="flex items-center justify-center w-full relative">
      <div className="flex flex-row items-center w-full">
        {steps.map((step, index) => {
          const isActive = index + 1 === currentStep;
          const isCompleted = index + 1 < currentStep;

          return (
            <div key={index} className="relative flex flex-col items-center w-full">
              {/* Connector */}
              {index < steps.length - 1 && (
                <div
                  className={`absolute top-4 left-[50%] right-[-50%] h-0.5 ${
                    isCompleted ? "bg-primary-500" : "bg-gray-300"
                  }`}></div>
              )}
              {/* Step Circle */}
              <div
                className={`flex items-center justify-center w-8 h-8 z-10 ${
                  isActive
                    ? "bg-primary-400 text-white"
                    : isCompleted
                    ? "bg-primary-6000 text-white"
                    : "bg-gray-300 text-gray-400"
                } rounded-full`}>
                {isCompleted ? (
                  <span className="text-sm font-bold">✔</span>
                ) : (
                  <div className={`w-3 h-3 rounded-full ${isActive ? "bg-gray-800" : "bg-white"}`}></div>
                )}
              </div>

              {/* Step Text */}
              <div className="text-center flex flex-col gap-2 mt-2">
                <p className={`text-sm font-medium ${isActive ? "text-gray-800" : "text-gray-500"}`}>{step.title}</p>
                <p className={`text-xs ${isActive ? "text-gray-600" : "text-gray-400"}`}>{step.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Stepper;
