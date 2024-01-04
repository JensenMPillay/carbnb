"use client";
import AuthContainer from "@/src/components/AuthContainer";
import RegisterForm from "./components/RegisterForm";

type Props = {};

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
