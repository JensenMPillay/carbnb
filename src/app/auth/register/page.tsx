import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { supabaseServerClient } from "@/src/lib/supabase/supabase-server-client";
import { constructMetadata } from "@/src/lib/utils";
import { redirect } from "next/navigation";
import RegisterForm from "./components/RegisterForm";

type Props = {};

export const metadata = constructMetadata({
  title: "Carbnb | Register",
  description: "Complete your registration in just a few more steps",
});

export default async function Register({}: Props) {
  const {
    data: { session },
    error,
  } = await supabaseServerClient.auth.getSession();

  const user = session?.user;

  if (!user || user.user_metadata.name) return redirect("/");

  return (
    <>
      <CardHeader className="space-y-1">
        <CardTitle className="text-center text-2xl">Almost there !</CardTitle>
        <CardDescription className="text-center">
          Complete your registration in just a few more steps
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RegisterForm />
      </CardContent>
    </>
  );
}
