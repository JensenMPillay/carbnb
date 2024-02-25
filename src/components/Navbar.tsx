"use client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/src/components/ui/tooltip";
import { PersonIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import useSessionStore from "../store/useSessionStore";
import useStore from "../store/useStore";
import Logo from "./Logo";
import { ModeToggle } from "./ModeToggle";
import UserAccountNav from "./UserAccountNav";
import { buttonVariants } from "./ui/button";

type Props = {};

const Navbar = (props: Props) => {
  const [origin, setOrigin] = useState<string>("");
  // Get Real Pathname
  const pathname = usePathname();
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
        <ModeToggle />
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
