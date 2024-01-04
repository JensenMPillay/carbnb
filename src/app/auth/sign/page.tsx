"use client";
import AuthContainer from "@/src/components/AuthContainer";
import SignForm from "./components/SignForm";

export default function Page() {
  return (
    <AuthContainer
      title="User Hub"
      description="Join us or sign in to your account"
    >
      <SignForm />
    </AuthContainer>
  );
}
