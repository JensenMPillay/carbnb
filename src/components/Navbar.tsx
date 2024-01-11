"use client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/src/components/ui/tooltip";
import { PersonIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import useSessionStore from "../store/useSessionStore";
import useStore from "../store/useStore";
import Logo from "./Logo";
import { ModeToggle } from "./ModeToggle";
import UserAccountNav from "./UserAccountNav";
import { Button } from "./ui/button";

type Props = {};

const Navbar = (props: Props) => {
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
        {!session || !session.user.user_metadata.name ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon">
                  <Link href="/auth/sign">
                    <PersonIcon className="h-5 w-5" />
                    <span className="sr-only">Sign In</span>
                  </Link>
                </Button>
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
