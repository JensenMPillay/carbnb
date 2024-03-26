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
import { DELETE_USER_MUTATION } from "@/src/lib/graphql/user";
import { showErrorNotif, showNotif } from "@/src/lib/notifications/toasters";
import supabaseBrowserClient from "@/src/lib/supabase/supabase-browser-client";
import useSessionStore from "@/src/store/useSessionStore";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

/**
 * Component representing a button to delete the user's account.
 * @component
 * @example
 * <DeleteUserButton />
 */
const DeleteUserButton = () => {
  // Open State
  const [open, setOpen] = useState<boolean>(false);

  // Session
  const { syncSession } = useSessionStore();

  // Router
  const router = useRouter();

  // Delete Mutation
  const [deleteUser] = useMutation(DELETE_USER_MUTATION, {
    onCompleted: async () => {
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
  const onClickHandler = async () => {
    setOpen(false);
    try {
      await deleteUser();
    } catch (error) {
      console.error(`Error : ${error}`);
    }
  };
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          className={buttonVariants({
            className: "w-3/4",
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
          <AlertDialogAction onClick={onClickHandler}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteUserButton;
