"use client";
import { Button, buttonVariants } from "@/src/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { Loader } from "@/src/components/ui/loader";
import { Separator } from "@/src/components/ui/separator";
import { UPDATE_USER_MUTATION } from "@/src/lib/graphql/user";
import { showErrorNotif, showNotif } from "@/src/lib/notifications/toasters";
import {
  UpdateUserSchemaType,
  updateUserSchema,
} from "@/src/lib/schemas/user/UpdateUserSchema";
import getAccountLink from "@/src/lib/stripe/get-account-link";
import { cn } from "@/src/lib/utils";
import useUserStore from "@/src/store/useUserStore";
import { useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

/**
 * Component representing a form for updating user information.
 * @component
 * @param {object} props - The props object.
 * @param {User} props.user - The user object containing user information.
 * @example
 * <UpdateUserForm user={user} />
 */
const UpdateUserForm = ({ user }: { user: User }) => {
  // User
  const { email, user_metadata } = user;

  // User
  const { syncUser } = useUserStore();

  // Router
  const router = useRouter();

  // Form
  const updateUserForm = useForm<UpdateUserSchemaType>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: { email: "", name: "", phone: "" },
  });

  // Update Mutation
  const [updateUser, { loading }] = useMutation(UPDATE_USER_MUTATION, {
    onCompleted: async () => {
      showNotif({
        description: "User Info has been updated successfully!",
      });
      await syncUser();
      router.refresh();
    },
    onError: async (error) => {
      showErrorNotif({
        description: error.message,
      });
      console.error("Mutation Error : ", error);
    },
  });

  // onSubmit Callback
  const onSubmit: SubmitHandler<UpdateUserSchemaType> = async (data, event) => {
    event?.preventDefault();
    try {
      await updateUser({
        variables: data,
      });
    } catch (error) {
      console.error(`Error : ${error}`);
    }
  };

  const createAccountLink = async (stripeCustomerId: string) => {
    const accountLinkURL = await getAccountLink(stripeCustomerId);
    return (window.location.href = accountLinkURL);
  };

  // Sync Session after Stripe Registration
  useEffect(() => {
    syncUser();
  }, [syncUser]);

  // Prefill Form
  useEffect(() => {
    updateUserForm.reset({
      email: email ?? "",
      name: user_metadata.name ?? "",
      phone: user_metadata.phone ?? "",
    });
    return () => {};
  }, [email, user_metadata, updateUserForm]);

  return (
    <Form {...updateUserForm}>
      {user_metadata.role === "LENDER" &&
      user_metadata.stripeCustomerId &&
      !user_metadata.stripeVerified ? (
        <Button
          className={buttonVariants({
            className:
              "my-2 w-fit self-center bg-indigo-600 text-white hover:bg-indigo-500",
            variant: null,
            size: "default",
          })}
          onClick={() =>
            createAccountLink(user?.user_metadata.stripeCustomerId)
          }
        >
          Stripe Onboarding
        </Button>
      ) : null}
      <form
        onSubmit={updateUserForm.handleSubmit(onSubmit)}
        className="space-4 mx-auto w-3/4"
      >
        <FormField
          control={updateUserForm.control}
          name="email"
          render={({ field, fieldState }) => (
            <FormItem className="my-2 mr-auto w-full md:my-4 md:w-1/2 lg:my-6 lg:w-1/3">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="email@example.com"
                  type="email"
                  autoCapitalize="off"
                  autoComplete="email"
                  autoCorrect="off"
                  className={cn(
                    "text-muted-foreground focus:text-foreground",
                    fieldState.isTouched && "text-foreground",
                  )}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={updateUserForm.control}
          name="password"
          render={({ field }) => (
            <FormItem className="my-2 mr-auto w-full md:my-4 md:w-1/2 lg:my-6 lg:w-1/3">
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  placeholder=""
                  type="password"
                  autoCapitalize="off"
                  autoComplete="new-password"
                  autoCorrect="off"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={updateUserForm.control}
          name="name"
          render={({ field, fieldState }) => (
            <FormItem className="my-2 mr-auto w-full md:my-4 md:w-1/2 lg:my-6 lg:w-1/3">
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Name"
                  type="text"
                  autoCapitalize="on"
                  autoComplete="on"
                  autoCorrect="off"
                  className={cn(
                    "text-muted-foreground focus:text-foreground",
                    fieldState.isTouched && "text-foreground",
                  )}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={updateUserForm.control}
          name="phone"
          render={({ field, fieldState }) => (
            <FormItem className="my-2 mr-auto w-full md:my-4 md:w-1/2 lg:my-6 lg:w-1/3">
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input
                  placeholder="0123456789"
                  type="tel"
                  autoCapitalize="off"
                  autoComplete="true"
                  autoCorrect="off"
                  className={cn(
                    "text-muted-foreground focus:text-foreground",
                    fieldState.isTouched && "text-foreground",
                  )}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Separator orientation="horizontal" className="mx-auto w-full" />
        <div className="flex w-full flex-col items-center justify-center space-y-1 py-2 sm:flex-row sm:items-end sm:justify-end sm:space-x-2 sm:space-y-0 sm:py-3 lg:py-4">
          <Button
            className={buttonVariants({
              className: "",
              variant: "default",
            })}
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <Loader className="size-6 text-inherit" />
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default UpdateUserForm;
