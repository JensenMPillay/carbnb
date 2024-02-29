"use client";
import ToggleGroupFormField from "@/src/components/ToggleGroupFormField";
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
import { Skeleton } from "@/src/components/ui/skeleton";
import useLoading from "@/src/hooks/useLoading";
import { REGISTER_USER_MUTATION } from "@/src/lib/graphql/user";
import { showErrorNotif, showNotif } from "@/src/lib/notifications/toasters";
import {
  RegisterUserSchemaType,
  registerUserSchema,
} from "@/src/lib/schemas/user/RegisterUserSchema";
import useSessionStore from "@/src/store/useSessionStore";
import useStore from "@/src/store/useStore";
import { useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type Props = {};

const RegisterForm = (props: Props) => {
  const roles = ["RENTER", "LENDER"];

  // Session
  const { syncSession } = useSessionStore();

  // Access to Store Data after Rendering (SSR Behavior)
  const session = useStore(useSessionStore, (state) => state.session);

  // User
  const user = session?.user;

  // Router
  const router = useRouter();

  // Origin
  const searchParams = useSearchParams();
  const origin = searchParams.get("origin");

  // Loading Hook
  const { isLoading } = useLoading();

  // Form
  const registerForm = useForm<RegisterUserSchemaType>({
    resolver: zodResolver(registerUserSchema),
    defaultValues: { email: "", name: "", phone: "", role: "" },
  });

  // Mutation
  const [registerUser, { loading }] = useMutation(REGISTER_USER_MUTATION, {
    onCompleted: async (data) => {
      showNotif({
        description: "You'll be redirected shortly!",
      });
      await syncSession();
      router.push(`/api/auth/callback${origin ? "?origin=" + origin : ""}`);
    },
    onError: async (error) => {
      showErrorNotif({
        description: error.message,
      });
      console.error("Mutation Error : ", error);
    },
  });

  // onSubmit Callback
  const onSubmit: SubmitHandler<RegisterUserSchemaType> = async (
    data,
    event,
  ) => {
    event?.preventDefault();
    try {
      await registerUser({
        variables: data,
      });
    } catch (error) {
      console.error(`Error : ${error}`);
    }
  };

  // Prefill Form
  useEffect(() => {
    registerForm.reset({
      email: user?.email ?? "",
      name: user?.user_metadata?.full_name ?? "",
      phone: user?.phone ?? "",
      role: "",
    });
    return () => {};
  }, [user, registerForm]);
  return (
    <>
      {isLoading ? (
        <div className="mx-auto my-2 flex w-3/4 flex-col items-center md:my-3 lg:my-4">
          <Skeleton className="my-2 h-10 w-full md:my-4 lg:my-6" />
          <Skeleton className="my-2 h-10 w-full md:my-4 lg:my-6" />
          <Skeleton className="my-2 h-10 w-full md:my-4 lg:my-6" />
          <Separator orientation="horizontal" className="w-full" />
          <Skeleton className="mt-4 h-10 w-full md:mt-8 lg:mt-12" />
        </div>
      ) : (
        <Form {...registerForm}>
          <form
            onSubmit={registerForm.handleSubmit(onSubmit)}
            className="space-4 mx-auto w-3/4"
          >
            <FormField
              control={registerForm.control}
              name="email"
              render={({ field }) => (
                <FormItem className="mx-auto my-2 w-full md:my-4 lg:my-6">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="email@example.com"
                      type="email"
                      autoCapitalize="off"
                      autoComplete="email"
                      autoCorrect="off"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={registerForm.control}
              name="name"
              render={({ field }) => (
                <FormItem className="mx-auto my-2 w-full md:my-4 lg:my-6">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Name"
                      type="text"
                      autoCapitalize="on"
                      autoComplete="on"
                      autoCorrect="off"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={registerForm.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="mx-auto my-2 w-full md:my-4 lg:my-6">
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="0123456789"
                      type="tel"
                      autoCapitalize="off"
                      autoComplete="true"
                      autoCorrect="off"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <ToggleGroupFormField
              form={registerForm}
              fieldName="role"
              items={roles}
              type="single"
            />
            <Separator
              orientation="horizontal"
              className="mx-auto mt-2 w-full"
            />
            <div className="flex flex-col items-center justify-center py-2 md:py-3 lg:py-4">
              <p className="mx-auto my-4 text-center text-sm text-muted-foreground">
                By clicking below, you agree to our{" "}
                <Link
                  href="/terms"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Privacy Policy.
                </Link>
              </p>
              <Button
                className={buttonVariants({
                  className: "my-2 w-full",
                  variant: "default",
                })}
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <Loader className="size-6   text-inherit" />
                ) : (
                  "Register"
                )}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </>
  );
};

export default RegisterForm;
