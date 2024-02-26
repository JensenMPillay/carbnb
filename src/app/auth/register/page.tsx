import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";

import getSupabaseServerClient from "@/src/lib/supabase/get-supabase-server-client";
import { constructMetadata } from "@/src/lib/utils";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import RegisterFormWrapper from "./components/RegisterFormWrapper";

type Props = {};

export const metadata = constructMetadata({
  title: "Carbnb | Register",
  description: "Complete your registration in just a few more steps",
});

export default async function Register({}: Props) {
  // Supabase Client
  const cookieStore = cookies();

  const supabaseServerClient = getSupabaseServerClient(cookieStore);

  const {
    data: { session },
    error,
  } = await supabaseServerClient.auth.getSession();

  const user = session?.user;

  if (!user) return redirect("/auth/sign");
  if (user.user_metadata.isRegistered) return redirect("/");

  return (
    <>
      <CardHeader className="space-y-1">
        <CardTitle className="text-center text-2xl">Almost there !</CardTitle>
        <CardDescription className="text-center">
          Complete your registration in just a few more steps
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RegisterFormWrapper />
      </CardContent>
    </>
  );
}
