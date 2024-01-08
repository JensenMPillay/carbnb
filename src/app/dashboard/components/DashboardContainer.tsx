import { PropsWithChildren } from "react";

const DashboardContainer = ({ children }: PropsWithChildren) => {
  return (
    <main className="relative flex h-[calc(100vh-9rem)] bg-cover bg-center">
      {children}
    </main>
  );
};

export default DashboardContainer;
