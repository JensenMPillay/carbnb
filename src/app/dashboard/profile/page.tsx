import { TabsContent } from "@/src/components/ui/tabs";
import { supabaseServerClient } from "@/src/lib/supabase/supabase-server-client";
import { constructMetadata } from "@/src/lib/utils";
import DeleteUserButton from "./components/DeleteUserButton";
import UpdateUserForm from "./components/UpdateUserForm";
import getStripeAccountLink from "./components/getStripeAccountLink";

type Props = {};

export const metadata = constructMetadata({
  title: "Carbnb | Dashboard | Profile",
  description: "Manage your account settings on Carbnb",
});

export default async function Profile({}: Props) {
  const {
    data: { session },
    error,
  } = await supabaseServerClient.auth.getSession();

  const user = session?.user;

  // Get Stripe Link
  let stripeAccLink = "";
  if (
    user?.user_metadata.role === "LENDER" &&
    user?.user_metadata.stripeCustomerId
  ) {
    stripeAccLink = await getStripeAccountLink(
      user?.user_metadata.stripeCustomerId,
    );
  }

  return (
    <TabsContent value="/dashboard/profile" className="mt-0 flex-1" forceMount>
      <div className="flex h-full w-full flex-col">
        <UpdateUserForm stripeAccLink={stripeAccLink} />
        <div className="mb-1 mt-auto w-full space-y-1 text-center">
          <DeleteUserButton />
        </div>
      </div>
    </TabsContent>
  );
}
