import AuthContainer from "@/src/app/auth/components/AuthContainer";
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
    <AuthContainer
      title="Almost there !"
      description="Complete your registration in just a few more steps"
    >
      <RegisterForm user={user} />
    </AuthContainer>
  );
}
