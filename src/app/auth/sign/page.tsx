import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { constructMetadata } from "@/src/lib/utils";
import SignForm from "./components/SignForm";

export const metadata = constructMetadata({
  title: "Carbnb | Sign",
  description: "Join us or sign in to your account",
});

export default function Sign() {
  return (
    <>
      <CardHeader className="space-y-1">
        <CardTitle className="text-center text-2xl">User Hub</CardTitle>
        <CardDescription className="text-center">
          Join us or sign in to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SignForm />
      </CardContent>
    </>
  );
}
