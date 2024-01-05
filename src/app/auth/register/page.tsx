import AuthContainer from "@/src/components/AuthContainer";
import { constructMetadata } from "@/src/lib/utils";
import RegisterForm from "./components/RegisterForm";

type Props = {};

export const metadata = constructMetadata({
  title: "Carbnb | Register",
  description: "Complete your registration in just a few more steps",
});

export default function Page({}: Props) {
  return (
    <AuthContainer
      title="Almost there !"
      description="Complete your registration in just a few more steps"
    >
      <RegisterForm />
    </AuthContainer>
  );
}
