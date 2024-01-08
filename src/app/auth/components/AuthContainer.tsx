"use client";
import authImage from "@/public/carbnb-auth-image.jpg";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

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
  const [imageSize, setImageSize] = useState<React.CSSProperties>({
    width: "0px",
    height: "0px",
  });
  const imageRef = useRef<HTMLImageElement>(null);

  // Sync Background to Image
  const updateImageSize = (): React.CSSProperties => {
    if (imageRef.current) {
      const gradientStyle: React.CSSProperties = {
        width: `${imageRef.current.width}px`,
        height: `${imageRef.current.height}px`,
      };
      return gradientStyle;
    }
    // Default
    return { width: "auto", height: "auto" } as React.CSSProperties;
  };

  useEffect(() => {
    const handleResize = () => {
      if (imageRef.current) {
        setImageSize({
          width: `${imageRef.current.width}px`,
          height: `${imageRef.current.height}px`,
        });
      }
      return true;
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    // Main
    <main className="flex h-[calc(100vh-9rem)] flex-row">
      {/* Image  */}
      <div className="relative hidden h-auto w-1/3 md:flex">
        <Image
          src={authImage}
          alt="auth-image"
          className="inset-0 h-auto w-auto"
          priority
          ref={imageRef}
        />
        {/* Gradient Layout  */}
        <div className="absolute inset-0 bg-gradientLayout" style={imageSize} />
      </div>
      <div className="h-full flex-1 px-8 md:px-10 lg:px-12">
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
