"use client";

import { Button } from "@/src/components/ui/button";
import { Loader } from "@/src/components/ui/loader";
import { UPDATE_USER_MUTATION } from "@/src/lib/graphql/user";
import { showErrorNotif, showNotif } from "@/src/lib/notifications/toasters";
import useUserStore from "@/src/store/useUserStore";
import { useMutation } from "@apollo/client";
import { Role } from "@prisma/client";
import { useRouter } from "next/navigation";

/**
 * Component representing a button for changing user role.
 * @example
 * @param {object} props - The props object.
 * @param {Role} props.role - The role to be assigned to the user.
 * @example
 * <RoleButton role="LENDER">
 */
const RoleButton = ({ role }: { role: Role }) => {
  // User
  const { syncUser } = useUserStore();

  // Router
  const router = useRouter();

  // Update Mutation
  const [updateUser, { loading }] = useMutation(UPDATE_USER_MUTATION, {
    onCompleted: async () => {
      showNotif({
        description: "User Info has been updated successfully!",
      });
      await syncUser();
      router.refresh();
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
    <Button size="lg" className="mx-auto my-4 flex" onClick={onClickHandler}>
      {loading ? (
        <Loader className="size-6 capitalize text-inherit" />
      ) : (
        `Become a ${role}`
      )}
    </Button>
  );
};

export default RoleButton;
