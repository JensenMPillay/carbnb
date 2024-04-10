"use client";
import { PersonIcon } from "@radix-ui/react-icons";
import { User } from "@supabase/supabase-js";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import supabaseBrowserClient from "../lib/supabase/supabase-browser-client";
import { cn } from "../lib/utils";
import useUserStore from "../store/useUserStore";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button, buttonVariants } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

type UserAccountNavProps = {
  user: User;
};

/**
 * UserAccountNav component renders the user account navigation menu.
 * @component
 * @param {object} props - The props object.
 * @param {User} props.user - The user object containing user information.
 * @example
 * <UserAccountNav user={user} />
 */
const UserAccountNav = ({ user }: UserAccountNavProps) => {
  // User
  const { syncUser } = useUserStore();

  // Router
  const router = useRouter();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="overflow-visible">
        <Button
          className={cn(
            buttonVariants({ variant: "default", size: "icon" }),
            "rounded-full border border-input hover:bg-accent hover:text-accent-foreground",
          )}
        >
          <Avatar className="relative size-6 bg-inherit">
            {user.user_metadata.image ? (
              <div className="relative h-full w-full">
                <Image
                  fill
                  src={user.user_metadata.image}
                  alt="profile picture"
                  referrerPolicy="no-referrer"
                />
              </div>
            ) : (
              <AvatarFallback className="size-6 bg-inherit">
                <PersonIcon className="size-5 text-foreground" />
                <span className="sr-only">Avatar</span>
              </AvatarFallback>
            )}
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="bg-background" align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-0.5 leading-none">
            {user.user_metadata.name && (
              <p className="text-sm font-medium">{user.user_metadata.name}</p>
            )}
            {user.email && (
              <p className="w-[200px] truncate text-xs text-zinc-500">
                {user.email}
              </p>
            )}
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/dashboard">Dashboard</Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="flex cursor-pointer justify-center focus:bg-transparent">
          <Button
            variant="outline"
            size="lg"
            onClick={async () => {
              await supabaseBrowserClient.auth.signOut();
              await syncUser();
              router.refresh();
              router.push("/");
            }}
          >
            Sign Out
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAccountNav;
