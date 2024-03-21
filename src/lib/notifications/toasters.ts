import { toast } from "sonner";

type showNotifProps = {
  title?: string;
  description: string;
};

/**
 * Displays a success notification.
 * @param {Object} props - The notification properties.
 * @param {string} [props.title="Notification"] - The title of the notification.
 * @param {string} props.description - The description of the notification.
 * @return {void}
 * @example
 * showNotif({ description: "Notification message" });
 */
export const showNotif = ({
  title = "Notification",
  description,
}: showNotifProps) => {
  return toast.success(title, {
    description: description,
    action: {
      label: "Undo",
      onClick: () => {
        return true;
      },
    },
  });
};

/**
 * Displays an error notification.
 * @param {Object} props - The notification properties.
 * @param {string} [props.title="Something went wrong..."] - The title of the notification.
 * @param {string} props.description - The description of the notification.
 * @return {void}
 * @example
 * import { showErrorNotif } from "./path/to/notifications";
 *
 * showErrorNotif({ description: "Error message" });
 */
export const showErrorNotif = ({
  title = "Something went wrong...",
  description,
}: showNotifProps) => {
  return toast.error(title, {
    description: description,
    action: {
      label: "Undo",
      onClick: () => {
        return true;
      },
    },
  });
};

/**
 * Displays a warning notification.
 * @param {Object} props - The notification properties.
 * @param {string} [props.title="Caution !"] - The title of the notification.
 * @param {string} props.description - The description of the notification.
 * @return {void}
 * @example
 * import { showWarningNotif } from "./path/to/notifications";
 *
 * showWarningNotif({ description: "Warning message" });
 */
export const showWarningNotif = ({
  title = "Caution !",
  description,
}: showNotifProps) => {
  return toast.warning(title, {
    description: description,
    action: {
      label: "Undo",
      onClick: () => {
        return true;
      },
    },
  });
};
