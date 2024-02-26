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
import { Separator } from "@/src/components/ui/separator";
import { Skeleton } from "@/src/components/ui/skeleton";
import useLoading from "@/src/hooks/useLoading";
import { UPDATE_USER_MUTATION } from "@/src/lib/graphql/user";
import { showErrorNotif, showNotif } from "@/src/lib/notifications/toasters";
import {
  UpdateUserSchemaType,
  updateUserSchema,
} from "@/src/lib/schemas/user/UpdateUserSchema";
import getAccountLink from "@/src/lib/stripe/get-account-link";
import { cn } from "@/src/lib/utils";
import useSessionStore from "@/src/store/useSessionStore";
import useStore from "@/src/store/useStore";
import { useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

const UpdateUserForm = () => {
  // Session
  const { syncSession } = useSessionStore();

  // Access to Store Data after Rendering (SSR Behavior)
  const session = useStore(useSessionStore, (state) => state.session);

  // User
  const user = session?.user;

  // Router
  const router = useRouter();

  // Loading Hook
  const { isLoading } = useLoading();

  // Form
  const updateUserForm = useForm<UpdateUserSchemaType>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: { email: "", name: "", phone: "" },
  });

  // Update Mutation
  const [updateUser] = useMutation(UPDATE_USER_MUTATION, {
    onCompleted: async (data) => {
      showNotif({
        description: "User Info has been updated successfully!",
      });
      await syncSession();
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

  // Prefill Form
  useEffect(() => {
    if (!user) return;

    const { email, user_metadata } = user;
    updateUserForm.reset({
      email: email ?? "",
      name: user_metadata.name ?? "",
      phone: user_metadata.phone ?? "",
    });
    return () => {};
  }, [user, updateUserForm]);

  return (
    <>
      {isLoading ? (
        <div className="mx-auto my-2 flex w-3/4 flex-col items-center md:my-3 lg:my-4">
          <Skeleton className="my-2 h-10 w-full md:my-4 lg:my-6" />
          <Skeleton className="my-2 h-10 w-full md:my-4 lg:my-6" />
          <Skeleton className="my-2 h-10 w-full md:my-4 lg:my-6" />
          <Skeleton className="my-2 h-10 w-full md:my-4 lg:my-6" />
          <Separator orientation="horizontal" className="w-full" />
          <Skeleton className="ml-auto mt-4 h-10 w-1/6 md:mt-8 lg:mt-12" />
        </div>
      ) : (
        <Form {...updateUserForm}>
          {user?.user_metadata.role === "LENDER" &&
          user?.user_metadata.stripeCustomerId &&
          !user?.user_metadata.stripeVerified ? (
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
              >
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      )}
    </>
  );
};

export default UpdateUserForm;
