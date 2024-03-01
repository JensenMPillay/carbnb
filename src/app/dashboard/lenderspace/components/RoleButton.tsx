"use client";

import { Button } from "@/src/components/ui/button";
import { Loader } from "@/src/components/ui/loader";
import { UPDATE_USER_MUTATION } from "@/src/lib/graphql/user";
import { showErrorNotif, showNotif } from "@/src/lib/notifications/toasters";
import useSessionStore from "@/src/store/useSessionStore";
import { useMutation } from "@apollo/client";
import { Role } from "@prisma/client";
import { useRouter } from "next/navigation";

const RoleButton = ({ role }: { role: Role }) => {
  // Session
  const { syncSession } = useSessionStore();

  // Router
  const router = useRouter();

  // Update Mutation
  const [updateUser, { loading }] = useMutation(UPDATE_USER_MUTATION, {
    onCompleted: async (data) => {
      showNotif({
        description: "User Info has been updated successfully!",
      });
      await syncSession();
      router.push("/dashboard");
    },
    onError: async (error) => {
      showErrorNotif({
        description: error.message,
      });
      console.error("Mutation Error : ", error);
    },
  });

  // onClick Callback
  const onClickHandler = async () => {
    try {
      await updateUser({
        variables: {
          role: role,
        },
      });
    } catch (error) {
      console.error(`Error : ${error}`);
    }
  };

  return (
    <Button size="lg" onClick={onClickHandler}>
      {loading ? <Loader className="size-6 text-inherit" /> : "Become a Lender"}
    </Button>
  );
};

export default RoleButton;
