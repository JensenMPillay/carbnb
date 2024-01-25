import { TabsContent } from "@/src/components/ui/tabs";
import { constructMetadata } from "@/src/lib/utils";
import DeleteUserButton from "./components/DeleteUserButton";
import UpdateUserForm from "./components/UpdateUserForm";

type Props = {};

export const metadata = constructMetadata({
  title: "Carbnb | Dashboard | Profile",
  description: "Manage your account settings on Carbnb",
});

function Profile({}: Props) {
  return (
    <TabsContent value="/dashboard/profile" className="mt-0 flex-1" forceMount>
      <div className="flex h-full w-full flex-col">
        <UpdateUserForm />
        <div className="mb-1 mt-auto w-full space-y-1 text-center">
          <DeleteUserButton />
        </div>
      </div>
    </TabsContent>
  );
}

export default Profile;
