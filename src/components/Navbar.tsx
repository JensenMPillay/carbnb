import { PersonIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import Logo from "./Logo";
import { ModeToggle } from "./ModeToggle";
import UserAccountNav from "./UserAccountNav";
import { Button } from "./ui/button";

type Props = {};

const Navbar = (props: Props) => {
  return (
    <nav className="flex h-24 w-full flex-row items-center justify-between px-4">
      <Link href="/">
        <Logo className="max-w-24" />
      </Link>
      <div className="flex flex-row items-center space-x-2">
        <ModeToggle />
        <Button variant="outline" size="icon">
          <Link href="/auth/sign">
            <PersonIcon className="h-5 w-5" />
            <span className="sr-only">Go to authentification page</span>
          </Link>
        </Button>
        <UserAccountNav />
      </div>
    </nav>
  );
};

export default Navbar;
