import { TabsContent } from "@/src/components/ui/tabs";
import getSupabaseServerClient from "@/src/lib/supabase/get-supabase-server-client";
import { constructMetadata } from "@/src/lib/utils";
import { cookies } from "next/headers";
import DeleteUserButton from "./components/DeleteUserButton";
import UpdateUserForm from "./components/UpdateUserForm";

import type { Metadata } from "next";

/**
 * Constructs metadata for the Profile page.
 */
export const metadata: Metadata = constructMetadata({
  title: "Carbnb | Dashboard | Profile",
  description: "Manage your account settings on Carbnb",
});

export const dynamic = "force-dynamic";

export const revalidate = 0;

/**
 * Profile page component.
 */
export default async function Profile() {
  // Supabase Client
  const cookieStore = cookies();

  const supabaseServerClient = getSupabaseServerClient(cookieStore);

  const {
    data: { user },
    error,
  } = await supabaseServerClient.auth.getUser();

  if (!user || error) return;
  return (
    <TabsContent value="/dashboard/profile" className="mt-0 flex-1" forceMount>
      <div className="flex h-full w-full flex-col">
        <UpdateUserForm user={user} />
        <div className="mb-1 mt-auto w-full space-y-1 text-center">
          <DeleteUserButton />
        </div>
      </div>
    </TabsContent>
  );
}
