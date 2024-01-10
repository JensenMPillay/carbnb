import { RandomSVGComponent } from "@/src/components/VectorImages";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";

type AuthContainerProps = {
  title: string;
  description: string;
  children?: React.ReactNode;
};

const AuthContainer = ({
  title,
  description,
  children,
}: AuthContainerProps) => {
  return (
    // Main
    <main className="flex h-[calc(100vh-9rem)] flex-row overflow-auto">
      {/* Image  */}
      <div className="relative hidden h-auto flex-1 md:flex">
        <RandomSVGComponent className="w-full" />
      </div>
      <div className="max-h-fit flex-1 px-8 md:px-10 lg:px-12">
        <Card className="h-full overflow-auto py-12 md:py-16 lg:py-20">
          <CardHeader className="space-y-1">
            <CardTitle className="text-center text-2xl">{title}</CardTitle>
            <CardDescription className="text-center">
              {description}
            </CardDescription>
          </CardHeader>
          <CardContent>{children}</CardContent>
        </Card>
      </div>
    </main>
  );
};

export default AuthContainer;
