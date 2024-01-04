import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

type Props = {};

const SearchForm = (props: Props) => {
  return (
    <div className="flex h-fit w-1/2 min-w-fit flex-col items-start justify-center rounded-lg bg-transparent text-lg shadow-md backdrop-blur-sm md:text-base lg:flex-row lg:items-center lg:rounded-full lg:text-sm">
      <div className="group flex flex-1 flex-col rounded-t-lg px-4 py-2 transition-all duration-300 ease-in-out lg:h-fit lg:rounded-l-full">
        <label className="text-base uppercase text-muted-foreground transition-all duration-300 ease-in-out group-hover:text-white md:text-sm lg:text-xs">
          Location
        </label>
        <input
          className="border-none bg-transparent py-1 text-zinc-500 outline-none"
          type="text"
          placeholder="Where?"
        />
      </div>
      <div className="group relative flex flex-1 flex-col px-4 py-2 transition-all duration-300 ease-in-out before:absolute before:left-1/2 before:top-0 before:h-[1px] before:w-1/2 before:-translate-x-1/2 before:bg-accent-foreground lg:h-fit lg:before:left-0 lg:before:top-1/2 lg:before:h-1/2 lg:before:w-[1px] lg:before:-translate-y-1/2">
        <label className="text-base uppercase text-muted-foreground transition-all duration-300 ease-in-out group-hover:text-white md:text-sm lg:text-xs">
          Start
        </label>
        <input
          className="border-none bg-transparent py-1 text-zinc-500 outline-none"
          type="text"
          placeholder="When?"
        />
      </div>
      <div className="group relative flex flex-1 flex-col px-4 py-2 transition-all duration-300 ease-in-out before:absolute before:left-1/2 before:top-0 before:h-[1px] before:w-1/2 before:-translate-x-1/2 before:bg-accent-foreground lg:h-fit lg:before:left-0 lg:before:top-1/2 lg:before:h-1/2 lg:before:w-[1px] lg:before:-translate-y-1/2">
        <label className="text-base uppercase text-muted-foreground transition-all duration-300 ease-in-out group-hover:text-white md:text-sm lg:text-xs">
          End
        </label>
        <input
          className="border-none bg-transparent py-1 text-zinc-500 outline-none"
          type="text"
          placeholder="When?"
        />
      </div>
      <div className="group flex w-full flex-1 flex-col items-center justify-center rounded-b-lg px-6 py-2 lg:h-fit lg:rounded-r-full">
        <button className="max-w-fit cursor-pointer rounded-full bg-accent-foreground p-4 text-accent transition-all duration-300 ease-in-out group-hover:scale-125 group-hover:bg-accent group-hover:text-accent-foreground md:p-3 lg:right-3 lg:top-1/2 lg:p-2">
          <MagnifyingGlassIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default SearchForm;
