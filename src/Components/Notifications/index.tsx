import { useEffect } from "react";
import { eventBus } from "../../Bus";
import { toast } from "react-hot-toast";

export const Notifications = () => {
  useEffect(() => {
    const fn = (data: any) => {
      const isError = data instanceof Error;
      if (isError) {
        return toast.error(data.message, { className: "toaster-notification" });
      }
      const isNotification = data instanceof Notification;
      if (isNotification) {
        const notification = data as Notification;
        switch (notification.getType()) {
          case "error":
            return toast.error(notification.getMessage(), {
              className: "toaster-notification",
            });
          case "success":
            return toast.success(notification.getMessage(), {
              className: "toaster-notification",
            });
          case "info":
            return toast(notification.getMessage(), {
              icon: "ℹ️",
              className: "toaster-notification",
            });
          default:
            return toast(notification.getMessage(), {
              className: "toaster-notification",
            });
        }
      }
    };

    eventBus.on("NOTIFICATION", fn);

    return () => {
      eventBus.off("NOTIFICATION", fn);
    };
  }, []);

  return <></>;
};

export class Notification {
  private type: "error" | "success" | "info" | "blank";
  private message: string;

  constructor(type: "error" | "success" | "info" | "blank", message: string) {
    this.type = type;
    this.message = message;
  }

  public getType() {
    return this.type;
  }

  public getMessage() {
    return this.message;
  }

  static buildNotification(
    type: "error" | "success" | "info" | "blank",
    message: string
  ) {
    return new Notification(type, message);
  }
}
