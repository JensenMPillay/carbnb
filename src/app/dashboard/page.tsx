import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import { constructMetadata } from "@/src/lib/utils";
import DashboardContainer from "./components/DashboardContainer";

export const metadata = constructMetadata({
  title: "Carbnb | Dashboard",
  description: "Manage your car rental listings and bookings on Carbnb",
});

export default function Dashboard() {
  return (
    <DashboardContainer>
      <Tabs defaultValue="account" className="w-[400px]">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          Make changes to your account here.
        </TabsContent>
        <TabsContent value="password">Change your password here.</TabsContent>
      </Tabs>
    </DashboardContainer>
  );
}
