import { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import ClientInfo from "./components/ClientInfo";
import ProductSelection from "./components/ProductSelection";
import Attachments from "./components/Attachments";
import { Summary } from "./components/Summary";
import { TForm } from "./types";
import axios from "axios";
import { useNotification } from "../../context/NotificationContext";
import { useNavigate } from "react-router";

const steps = ["Client Info", "Product Selection", "Attachments", "Review & Submit"];

export default function NewRequestStepper() {
  const [currentStep, setCurrentStep] = useState(0);
  const [loadingMock, setLoadingMock] = useState(false);
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState<TForm>({
    requestorName: "",
    requestorEmail: "",
    department: "",
    employeeID: "",
    onBehalfOf: "",
    requestTitle: "",
    description: "",
    requestedDate: "",
    dueDate: "",
    priority: "",
    products: [],
    budget: 0,
    costCenter: "",
    attachments: []
  });

  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const submitForm = async () => {
    try {
      setSending(true);
      await axios.post(`${import.meta.env.VITE_BACKEND_API}/api/Requests`, form);
      
      showNotification("Form submitted successfully!", {
        variant: "notification",
        color: "success",
        size: "md",
        timeout: 5000
      });

      setTimeout(() => {
        navigate("/approvals");
      }, 2000);

    } catch (error) {
      console.error("Error submitting form:", error);
      showNotification("Error submitting form. Please try again.", {
        variant: "notification",
        color: "error",
        size: "md",
        timeout: 5000
      });
    } finally {
      setSending(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <ClientInfo form={form} setForm={setForm} />;
      case 1:
        return <ProductSelection form={form} setForm={setForm} />;
      case 2:
        return <Attachments form={form} setForm={setForm} />;
      case 3:
        return <Summary form={form} />;
      default:
        return null;
    }
  };

  const generateFormData = async () => {
    try {
      setLoadingMock(true);
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_API}/api/GenerateFormData`);
      const parsedData = JSON.parse(res.data);
      setForm(parsedData);
    } catch (error) {
      console.error("Error fetching sample data:", error);
    } finally {
      setLoadingMock(false);
    }
  };

  const advanceStep = async (step: number) => {
    let canAdvance = true;
    switch (step) {
      case 0:
        canAdvance = true;
        break;
      case 1:
        if (!form.requestorName || !form.requestorEmail || !form.requestedDate) {
          showBadgeMessage("Please fill out all required fields in Client Info.");
          canAdvance = false;
        }
        break;
      case 2:
        if (!form.requestorName || !form.requestorEmail || !form.requestedDate || form.products.length === 0) {
          if (!form.requestorName || !form.requestorEmail || !form.requestedDate) {
            showBadgeMessage("Please fill out all required fields in Client Info.");
          } else if (!form.products || form.products.length === 0) {
            showBadgeMessage("Please select at least one product.");
          }
          canAdvance = false;
        }
        break;
      case 3:
        if (!form.requestorName || !form.requestorEmail || !form.requestedDate || form.products.length === 0) {
          if (!form.requestorName || !form.requestorEmail || !form.requestedDate) {
            showBadgeMessage("Please fill out all required fields in Client Info.");
          } else if (!form.products || form.products.length === 0) {
            showBadgeMessage("Please select at least one product.");
          }
          canAdvance = false;
        }
        break;
      default:
        canAdvance = true;
    }

    return canAdvance;
  };

  const showBadgeMessage = (message: string) => {
    showNotification(message, {
      variant: "notification",
      color: "error",
      size: "md",
      timeout: 5000
    });
  };


  return (
    <div>
      <PageMeta title="New Request Stepper" description="Multi-step form for new requests" />
      <PageBreadcrumb pageTitle="New Request" />
      {/* {badgeMessage && (
        <div 
          className="fixed bottom-4 right-4 z-50 fade-in-right" 
          onAnimationEnd={() => 
            setTimeout(() => {
              setBadgeMessage("");
            }, 5000)
          }
        >
          <Badge variant="notification" color="error" size="md">
            {badgeMessage}
          </Badge>
        </div>
      )} */}

      <div className="flex justify-end mb-1">
        <div>
          <button
            type="button"
            onClick={generateFormData}
            className={`flex items-center justify-between -mt-5 text-sm mb-1 bg-indigo-500 text-white py-0.5 rounded hover:bg-indigo-600
              ${loadingMock ? "cursor-not-allowed opacity-80  pr-4 pl-2" : " px-4"}`}
            title="Generate Sample Data"
            disabled={loadingMock}
          >
            {loadingMock && (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                className="animate-spin origin-center mr-1 -ml-1"
              >
                <path
                  d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"
                  fill="currentColor"
                />
              </svg>
            )}
            <span>Autofill</span>
          </button>
          <div className="text-center text-xs italic">Powered by AI</div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-2">
        {/* Stepper Navigation */}
        <ol className="lg:sticky top-24 space-y-8 w-full lg:w-1/5 flex lg:flex-col lg:h-[300px]">
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
                onClick={async() => {
                  const canAdvance = await advanceStep(index);
                  if (canAdvance) {
                    setCurrentStep(index);
                  }
                }}
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
                <div className="flex flex-col lg:space-y-0 space-y-2 items-start">
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
        <div className="w-full lg:w-4/5">
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
              onClick={async () => {
                const canAdvance = await advanceStep(currentStep);
                if (canAdvance) {
                  if (currentStep === steps.length - 1) {
                    setSending(true);
                    await submitForm();
                    setSending(false);
                  } else {
                    setCurrentStep((s) => s + 1);
                  }
                }
              }}
              disabled={sending}
              className={`px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50
                ${loadingMock ? "cursor-not-allowed opacity-80" : ""}`}
            >
              {loadingMock && currentStep === steps.length - 1 ? "Submitting..." : 
              currentStep === steps.length - 1 ? "Submit" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
