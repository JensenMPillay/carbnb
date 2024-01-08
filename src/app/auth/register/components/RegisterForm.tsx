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
import { ToggleGroup, ToggleGroupItem } from "@/src/components/ui/toggle-group";
import { useSessionContext } from "@/src/context/SessionContext";
import useLoading from "@/src/hooks/useLoading";
import { REGISTER_USER_MUTATION } from "@/src/lib/apollo/user";
import { showErrorNotif, showNotif } from "@/src/lib/notifications/toasters";
import {
  RegisterUserSchemaType,
  registerUserSchema,
} from "@/src/lib/schemas/RegisterUserSchema";
import { supabaseBrowserClient } from "@/src/lib/supabase/supabase-browser-client";
import { useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@supabase/supabase-js";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type RegisterFormProps = {
  user: User;
};

const RegisterForm = ({ user }: RegisterFormProps) => {
  enum roles {
    LENDER = "LENDER",
    RENTER = "RENTER",
  }

  // Session
  const { setSession } = useSessionContext();

  // Router
  const router = useRouter();

  // Loading Hook
  const { isLoading } = useLoading();

  const registerForm = useForm<RegisterUserSchemaType>({
    resolver: zodResolver(registerUserSchema),
    defaultValues: { email: "", name: "", phone: "", role: "" },
  });

  const [registerUser] = useMutation(REGISTER_USER_MUTATION, {
    onCompleted: async (data) => {
      showNotif({
        description: "You'll be redirected shortly!",
      });
      const {
        data: { session: sessionData },
      } = await supabaseBrowserClient.auth.getSession();
      setSession(sessionData);
      router.refresh();
      router.replace("/dashboard");
    },
    onError: async (error) => {
      showErrorNotif({
        description: error.message,
      });
      console.error("Mutation Error : ", error);
      // Gérer l'erreur de la mutation
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

  // useAuthForm Callback
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
        <div className="my-2 flex flex-1 flex-col items-center space-y-10 md:my-3 lg:my-4">
          <Skeleton className="my-2 h-10 w-3/4 md:my-4 lg:my-6" />
          <Skeleton className="my-2 h-10 w-3/4 md:my-4 lg:my-6" />
          <Skeleton className="my-2 h-10 w-3/4 md:my-4 lg:my-6" />
          <Separator orientation="horizontal" className="w-3/4" />
          <Skeleton className="mt-4 h-10 w-3/4 md:mt-8 lg:mt-12" />
        </div>
      ) : (
        <Form {...registerForm}>
          <form
            onSubmit={registerForm.handleSubmit(onSubmit)}
            className="space-4"
          >
            <FormField
              control={registerForm.control}
              name="email"
              render={({ field }) => (
                <FormItem className="mx-auto my-2 w-3/4 md:my-4 lg:my-6">
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
                <FormItem className="mx-auto my-2 w-3/4 md:my-4 lg:my-6">
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
                <FormItem className="mx-auto my-2 w-3/4 md:my-4 lg:my-6">
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
            <FormField
              control={registerForm.control}
              name="role"
              render={({ field }) => (
                <FormItem className="mx-auto my-2 w-3/4 md:my-4 lg:my-6">
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <ToggleGroup
                      type="single"
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex justify-around"
                    >
                      {Object.entries(roles).map(([key, value]) => {
                        return (
                          <FormItem key={key}>
                            <FormControl>
                              <ToggleGroupItem value={value} aria-label={value}>
                                {value}
                              </ToggleGroupItem>
                            </FormControl>
                          </FormItem>
                        );
                      })}
                    </ToggleGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Separator orientation="horizontal" className="mx-auto w-3/4" />
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
              <div></div>
              <Button
                className={buttonVariants({
                  className: "my-2 w-3/4",
                  variant: "default",
                })}
                type="submit"
              >
                Register
              </Button>
            </div>
          </form>
        </Form>
      )}
    </>
  );
};

export default RegisterForm;
