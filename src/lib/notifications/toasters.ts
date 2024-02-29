import { toast } from "sonner";

type showNotifProps = {
  title?: string;
  description: string;
};

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
