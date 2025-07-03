import { useState } from "react";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import DefaultInputs from "../components/form/form-elements/DefaultInputs";
import SelectInputs from "../components/form/form-elements/SelectInputs";
// import TextAreaInput from "../components/form/form-elements/TextAreaInput";
import FileInputExample from "../components/form/form-elements/FileInputExample";

const steps = ["Client Info", "Product Selection", "Attachments"];

export default function NewRequestStepper() {
  const [currentStep, setCurrentStep] = useState(0);

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <DefaultInputs />;
      case 1:
        return <SelectInputs />;
      case 2:
        return <FileInputExample />;
      default:
        return null;
    }
  };

  return (
    <div>
      <PageMeta title="New Request Stepper" description="Multi-step form for new requests" />
      <PageBreadcrumb pageTitle="New Request" />

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Stepper Navigation */}
        <ol className="space-y-8 w-full lg:w-1/4">
          {steps.map((label, index) => (
            <li
              key={index}
              className={`relative flex-1 ${
                index < steps.length - 1 ? "after:content-[''] after:w-0.5 after:h-full after:bg-indigo-600 after:inline-block after:absolute after:-bottom-11 after:left-4 lg:after:left-5" : ""
              }`}
            >
              <button
                onClick={() => setCurrentStep(index)}
                className="flex items-center font-medium w-full"
              >
                <span
                  className={`w-8 h-8 border-2 rounded-full flex justify-center items-center mr-3 text-sm lg:w-10 lg:h-10 ${
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
                <div className="block">
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
        <div className="w-full lg:w-3/4 p-6 border border-gray-200 rounded-lg bg-white dark:border-gray-700 dark:bg-gray-800">
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
