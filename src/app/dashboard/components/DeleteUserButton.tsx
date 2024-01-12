"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/src/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/src/components/ui/button";
import { DELETE_USER_MUTATION } from "@/src/lib/apollo/user";
import { showErrorNotif, showNotif } from "@/src/lib/notifications/toasters";
import { supabaseBrowserClient } from "@/src/lib/supabase/supabase-browser-client";
import useSessionStore from "@/src/store/useSessionStore";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";
import { MouseEvent, useState } from "react";

type Props = {};

const DeleteUserButton = (props: Props) => {
  // Open State
  const [open, setOpen] = useState<boolean>(false);

  // Session
  const { syncSession } = useSessionStore();

  // Router
  const router = useRouter();

  // Delete Mutation
  const [deleteUser] = useMutation(DELETE_USER_MUTATION, {
    onCompleted: async (data) => {
      setOpen(false);
      showNotif({
        description: "User has been deleted successfully!",
      });
      await supabaseBrowserClient.auth.signOut();
      await syncSession();
      router.push("/");
    },
    onError: async (error) => {
      showErrorNotif({
        description: error.message,
      });
      console.error("Mutation Error : ", error);
    },
  });
  // Delete Callback
  const onClick = async (event: MouseEvent<HTMLButtonElement>) => {
    event?.preventDefault();
    try {
      await deleteUser();
    } catch (error) {
      console.error(`Error : ${error}`);
    }
  };
  return (
    <div className="mx-auto w-3/4">
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          <Button
            className={buttonVariants({
              className: "my-2 w-full",
              variant: "destructive",
            })}
            type="button"
          >
            Delete Account
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={(event) => onClick(event)}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DeleteUserButton;
