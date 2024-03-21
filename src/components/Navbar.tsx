"use client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/src/components/ui/tooltip";
import useStore from "@/src/hooks/useStore";
import { MoonIcon, PersonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import useSessionStore from "../store/useSessionStore";
import Logo from "./Logo";
import UserAccountNav from "./UserAccountNav";
import { Button, buttonVariants } from "./ui/button";

type Props = {};

const Navbar = (props: Props) => {
  const [origin, setOrigin] = useState<string>("");
  // Get Real Pathname
  const pathname = usePathname();

  // Theme
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    let origin = pathname.slice(1);
    if (origin.includes("/")) origin = "";
    setOrigin(origin);

    return () => {};
  }, [pathname]);

  // Access to Store Data after Rendering (SSR Behavior)
  const session = useStore(useSessionStore, (state) => state.session);

  return (
    <nav className="flex h-24 w-full flex-row items-center justify-between px-4">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href="/">
              <Logo className="max-w-24" />
            </Link>
          </TooltipTrigger>
          <TooltipContent>
            <span>Home page</span>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <div className="flex flex-row items-center space-x-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                <SunIcon className="size-5 rotate-0 scale-100 text-foreground dark:-rotate-90 dark:scale-0" />
                <MoonIcon className="absolute size-5 rotate-90 scale-0 text-foreground dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <span>Toggle theme</span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        {!session || !session.user.user_metadata.isRegistered ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  className={buttonVariants({
                    variant: "outline",
                    size: "icon",
                  })}
                  href={`/auth/sign${origin ? "?origin=" + origin : ""}`}
                >
                  <PersonIcon className="size-5" />
                  <span className="sr-only">Sign In</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <span>Sign In</span>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <UserAccountNav user={session.user} />
        )}
      </div>
    </nav>
  );
};

export default Navbar;
