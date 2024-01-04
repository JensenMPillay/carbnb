import Logo from "./Logo";

type Props = {};

const Header = (props: Props) => {
  return (
    <header className="flex flex-1 flex-col justify-around">
      <Logo className="mx-auto w-48 lg:min-w-96" color="white" />
      <p className="rounded text-center text-base text-white backdrop-blur-sm md:text-xl lg:text-2xl">
        Connect, Share, Roll: Your Collaborative Car Sharing Platform
      </p>
    </header>
  );
};

export default Header;
