import { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import ClientInfo from "./components/ClientInfo";
import ProductSelection from "./components/ProductSelection";
import Attachments from "./components/Attachments";

const steps = ["Client Info", "Product Selection", "Attachments"];

export default function NewRequestStepper() {
  const [currentStep, setCurrentStep] = useState(0);

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <ClientInfo />;
      case 1:
        return <ProductSelection />;
      case 2:
        return <Attachments />;
      default:
        return null;
    }
  };

  return (
    <div>
      <PageMeta title="New Request Stepper" description="Multi-step form for new requests" />
      <PageBreadcrumb pageTitle="New Request" />

      <div className="flex flex-col lg:flex-row gap-2">
        {/* Stepper Navigation */}
        <ol className="space-y-8 w-full lg:w-1/4 flex lg:flex-col lg:h-[300px]">
          {steps.map((label, index) => (
            <li
              key={index}
              className={`relative flex-1 ${
                index < steps.length - 1 
                ? `
                after:content-[''] 
                lg:after:w-0.5 
                lg:after:h-full 
                after:h-0.5
                after:w-full
                after:bg-indigo-600 
                after:inline-block 
                after:absolute 
                after:-right-8
                after:top-1/2
                lg:after:left-5 
                lg:after:-bottom-11 
                `: ""
              }`}
            >
              <button
                onClick={() => setCurrentStep(index)}
                className="flex items-center font-medium w-full group"
              >
                <span
                  className={`w-10 h-10 border-2 rounded-full flex justify-center items-center mr-3 text-sm z-10
                    group-hover:bg-indigo-600 group-hover:text-white
                  ${
                    currentStep === index
                      ? "bg-indigo-600 text-white border-transparent"
                      : index < currentStep
                      ? "bg-indigo-100 text-indigo-600 border-indigo-600"
                      : "bg-gray-50 text-gray-500 border-gray-200"
                  }`}
                >
                  {index < currentStep ? (
                    <svg
                      className="w-5 h-5 stroke-current"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5 12L9.287 16.292c.334.334.5.5.707.5s.373-.166.707-.5L20 7"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </span>
                <div className="flex flex-col items-baseline space-y-2 lg:items-start">
                  <h4
                    className={`text-lg ${
                      currentStep === index ? "text-indigo-600" : "text-gray-900"
                    }`}
                  >
                    Step {index + 1}
                  </h4>
                  <span className="text-sm">{label}</span>
                </div>
              </button>
            </li>
          ))}
        </ol>

        {/* Step Content */}
        <div className="w-full lg:w-3/4">
          {renderStepContent()}

          <div className="flex justify-between mt-6">
            <button
              disabled={currentStep === 0}
              onClick={() => setCurrentStep((s) => s - 1)}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Back
            </button>
            <button
              disabled={currentStep === steps.length - 1}
              onClick={() => setCurrentStep((s) => s + 1)}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
