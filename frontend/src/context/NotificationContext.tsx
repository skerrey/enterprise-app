import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import Badge from "../components/ui/badge/Badge";

type BadgeVariant = "light" | "solid" | "notification";
type BadgeSize = "sm" | "md";
type BadgeColor = "primary" | "success" | "error" | "warning" | "info" | "light" | "dark";

type NotificationConfig = {
  variant?: BadgeVariant;
  color?: BadgeColor;
  size?: BadgeSize;
  timeout?: number; // in milliseconds, defaults to 5000
};

type NotificationState = {
  message: ReactNode;
  config: Required<NotificationConfig>;
  id: string;
} | null;

type NotificationContextType = {
  showNotification: (message: ReactNode, config?: NotificationConfig) => void;
  clearNotification: () => void;
  notification: NotificationState;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
};

type NotificationProviderProps = {
  children: ReactNode;
};

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notification, setNotification] = useState<NotificationState>(null);

  const showNotification = (message: ReactNode, config: NotificationConfig = {}) => {
    const defaultConfig: Required<NotificationConfig> = {
      variant: "notification",
      color: "error",
      size: "md",
      timeout: 5000,
      ...config
    };

    const newNotification: NotificationState = {
      message,
      config: defaultConfig,
      id: Date.now().toString() // Simple ID generation
    };

    setNotification(newNotification);
  };

  const clearNotification = () => {
    setNotification(null);
  };

  // Auto-dismiss effect
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        clearNotification();
      }, notification.config.timeout);

      return () => clearTimeout(timer);
    }
  }, [notification]);

  return (
    <NotificationContext.Provider value={{ showNotification, clearNotification, notification }}>
      {children}
      {notification && (
        <div 
          className="fixed bottom-4 right-4 z-50 fade-in-right"
          key={notification.id}
        >
          <Badge 
            variant={notification.config.variant}
            color={notification.config.color}
            size={notification.config.size}
          >
            {notification.message}
          </Badge>
        </div>
      )}
    </NotificationContext.Provider>
  );
};