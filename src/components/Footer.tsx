/**
 * Footer component to display footer content.
 * @component
 * @example
 * <Footer />
 */
const Footer = () => {
  return (
    <footer className="hidden h-12 w-full flex-row items-center justify-between px-4 md:flex">
      <div>Build By JM</div>
      <span>{new Date().getFullYear()} &copy; All Rights Reserved.</span>
    </footer>
  );
};

export default Footer;
