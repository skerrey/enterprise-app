
interface ChartTabProps {
  onTabChange: (tab: "requests" | "budget" | "priority") => void;
  activeTab: "requests" | "budget" | "priority";
}

const ChartTab: React.FC<ChartTabProps> = ({ onTabChange, activeTab }) => {
  const getButtonClass = (option: "requests" | "budget" | "priority") =>
    activeTab === option
      ? "shadow-theme-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800"
      : "text-gray-500 dark:text-gray-400";

  return (
    <div className="flex items-center gap-0.5 rounded-lg bg-gray-100 p-0.5 dark:bg-gray-900">
      <button
        onClick={() => onTabChange("requests")}
        className={`px-3 py-2 font-medium w-full rounded-md text-theme-sm hover:text-gray-900 dark:hover:text-white ${getButtonClass(
          "requests"
        )}`}
      >
        Requests
      </button>

      <button
        onClick={() => onTabChange("budget")}
        className={`px-3 py-2 font-medium w-full rounded-md text-theme-sm hover:text-gray-900 dark:hover:text-white ${getButtonClass(
          "budget"
        )}`}
      >
        Budget
      </button>

      {/* <button
        onClick={() => onTabChange("priority")}
        className={`px-3 py-2 font-medium w-full rounded-md text-theme-sm hover:text-gray-900 dark:hover:text-white ${getButtonClass(
          "priority"
        )}`}
      >
        Priority
      </button> */}
    </div>
  );
};

export default ChartTab;