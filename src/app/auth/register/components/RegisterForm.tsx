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
import { RadioGroup, RadioGroupItem } from "@/src/components/ui/radio-group";
import { Separator } from "@/src/components/ui/separator";
import { Skeleton } from "@/src/components/ui/skeleton";
import useAuthForm from "@/src/hooks/useAuthForm";
import {
  RegisterUserSchemaType,
  registerUserSchema,
} from "@/src/lib/schemas/RegisterUserSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type Props = {};

const RegisterForm = (props: Props) => {
  const [userInfo, setUserInfo] = useState<RegisterUserSchemaType>({
    email: "",
    name: "",
    phone: "",
    role: "",
  });

  const registerForm = useForm<RegisterUserSchemaType>({
    resolver: zodResolver(registerUserSchema),
  });

  enum roles {
    LENDER = "LENDER",
    RENTER = "RENTER",
  }

  //   onSubmit Callback
  const onSubmit: SubmitHandler<RegisterUserSchemaType> = async (
    data,
    event,
  ) => {
    event?.preventDefault();
    try {
      // const userRegistered = await registerUser(data);
    } catch (error: any) {
      if (error instanceof Error) console.log(error.message);
    }
  };

  // useAuthForm Hook
  const { isFormLoading, session } = useAuthForm();

  // useAuthForm Callback
  useEffect(() => {
    if (session)
      setUserInfo((prevUserInfo) => ({
        ...prevUserInfo,
        email: session.user?.email ?? "",
        name: session?.user?.user_metadata?.full_name ?? "",
        phone: session.user?.phone ?? "",
      }));

    return () => {};
  }, [session]);

  return (
    <>
      {isFormLoading ? (
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
                      defaultValue={userInfo.email}
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
                      defaultValue={userInfo.name}
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
                      defaultValue={userInfo.phone}
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
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                      className="flex justify-around"
                    >
                      {Object.entries(roles).map(([key, value]) => {
                        return (
                          <FormItem
                            key={key}
                            className="flex items-center space-x-3 space-y-0"
                          >
                            <FormControl>
                              <RadioGroupItem value={value} />
                            </FormControl>
                            <FormLabel className="font-normal">{key}</FormLabel>
                          </FormItem>
                        );
                      })}
                    </RadioGroup>
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
