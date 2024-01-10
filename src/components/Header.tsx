import Logo from "./Logo";

type Props = {};

const Header = (props: Props) => {
  return (
    <header className="flex flex-1 flex-col justify-center">
      <Logo className="mx-auto w-36 md:min-w-48 lg:min-w-60" />
      <p className="rounded text-center text-base backdrop-blur-sm md:text-xl lg:text-2xl">
        Connect, Share, Roll: Your Collaborative Car Sharing Platform
      </p>
    </header>
  );
};

export default Header;
