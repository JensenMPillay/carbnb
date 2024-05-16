import Logo from "./Logo";

/**
 * Header component to display header content.
 * @component
 * @example
 * <Header />
 */
const Header = () => {
  return (
    <header className="flex w-full flex-col justify-center md:w-1/3">
      <Logo className="mx-auto w-36 md:min-w-48 lg:min-w-60" />
      <p className="rounded text-center text-base backdrop-blur-sm md:text-xl lg:text-2xl">
        Connect, Share, Roll:
        <br /> Your Collaborative Car Sharing Platform
      </p>
    </header>
  );
};

export default Header;
