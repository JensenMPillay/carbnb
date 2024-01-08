import AuthContainer from "@/src/app/auth/components/AuthContainer";
import { constructMetadata } from "@/src/lib/utils";
import SignForm from "./components/SignForm";

export const metadata = constructMetadata({
  title: "Carbnb | Sign",
  description: "Join us or sign in to your account",
});

export default function Sign() {
  return (
    <AuthContainer
      title="User Hub"
      description="Join us or sign in to your account"
    >
      <SignForm />
    </AuthContainer>
  );
}
