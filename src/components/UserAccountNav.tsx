"use client";
import { PersonIcon } from "@radix-ui/react-icons";
import { User } from "@supabase/supabase-js";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabaseBrowserClient } from "../lib/supabase/supabase-browser-client";
import useSessionStore from "../store/useSessionStore";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
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

const UserAccountNav = ({ user }: UserAccountNavProps) => {
  // Session
  const { syncSession } = useSessionStore();

  // Router
  const router = useRouter();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="overflow-visible">
        <Button className="group aspect-square size-8 rounded-full border bg-accent transition-all duration-300 ease-in-out hover:bg-accent">
          <Avatar className="relative size-8 bg-background transition-all duration-300 ease-in-out group-hover:bg-accent">
            {user.user_metadata.image ? (
              <div className="relative aspect-square h-full w-full">
                <Image
                  fill
                  src={user.user_metadata.image}
                  alt="profile picture"
                  referrerPolicy="no-referrer"
                />
              </div>
            ) : (
              <AvatarFallback className="size-8 bg-background transition-all duration-300 ease-in-out group-hover:bg-accent">
                <span className="sr-only">Avatar</span>
                <PersonIcon className="size-5 text-foreground" />
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
              await syncSession();
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
