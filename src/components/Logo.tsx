"use client";
import logoDark from "@/public/carbnb-logo-dark.png";
import logoWhite from "@/public/carbnb-logo-white.png";
import { useTheme } from "next-themes";
import Image, { StaticImageData } from "next/image";
import { useEffect, useState } from "react";

type LogoProps = {
  className: string;
  color?: string;
};

/**
 * Logo component to display the application logo.
 * @component
 * @param {string} className The CSS class for styling the logo.
 * @param {string} [color] The color theme for the logo. Defaults to the theme set in the application (optional).
 * @example
 * <Logo className="h-8 w-8" color="dark" />
 */
const Logo = ({ className, color }: LogoProps) => {
  // Theme
  const { resolvedTheme } = useTheme();
  const [logoSrc, setLogoSrc] = useState<StaticImageData>(logoWhite);
  useEffect(() => {
    // Sync Logo to Theme
    setLogoSrc(resolvedTheme === "dark" ? logoWhite : logoDark);
  }, [resolvedTheme]);
  return (
    // Static Colors Cases
    color ? (
      color === "dark" ? (
        <Image src={logoDark} alt="logo-dark" className={className} priority />
      ) : (
        <Image
          src={logoWhite}
          alt="logo-white>"
          className={className}
          priority
        />
      )
    ) : (
      // Theme Case
      <Image src={logoSrc} alt="logo" className={className} priority />
    )
  );
};

export default Logo;
