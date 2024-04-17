type SVGProps = React.SVGAttributes<SVGElement>;

/**
 * Component for rendering a transmission icon.
 * @component
 * @param className Optional additional CSS classes for customization (optional).
 * @param rest Any other additional attributes to pass to the SVG element (optional).
 * @example
 * <TransmissionIcon className="size-8" />
 */
export const TransmissionIcon = ({ className, ...rest }: SVGProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="800"
    height="800"
    fill="none"
    viewBox="0 0 24 24"
    className={className}
    {...rest}
  >
    <title className="sr-only">TransmissionIcon</title>
    <g fill="#4cc2ae">
      <path d="M2 4a2 2 0 112.75 1.855v5.395h6.5V5.855a2 2 0 111.5 0v5.395H16c.964 0 1.612-.002 2.095-.066.461-.063.659-.17.789-.3.13-.13.237-.328.3-.79.064-.482.066-1.13.066-2.094V5.855a2 2 0 111.5 0v2.197c0 .898 0 1.648-.08 2.242-.084.628-.27 1.195-.726 1.65-.455.456-1.022.642-1.65.726-.594.08-1.343.08-2.242.08H12.75v5.395a2 2 0 11-1.5 0V12.75h-6.5v5.395a2 2 0 11-1.5 0V5.855A2 2 0 012 4z"></path>
      <path
        fillRule="evenodd"
        d="M17.25 15a.75.75 0 01.75-.75h2.286c1.375 0 2.464 1.134 2.464 2.5a2.502 2.502 0 01-1.641 2.358l1.53 2.5a.75.75 0 11-1.279.784l-1.923-3.142h-.687V22a.75.75 0 01-1.5 0v-7zm1.5 2.75h1.536c.518 0 .964-.433.964-1s-.446-1-.964-1H18.75v2z"
        clipRule="evenodd"
        opacity="0.5"
      ></path>
    </g>
  </svg>
);

/**
 * Component for rendering a fuel type icon.
 * @component
 * @param className Optional additional CSS classes for customization.
 * @param rest Any other additional attributes to pass to the SVG element.
 * @example
 * <FuelTypeIcon className="size-8" />
 */
export const FuelTypeIcon = ({ className, ...rest }: SVGProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="800"
    height="800"
    fill="none"
    viewBox="-2.4 -2.4 28.8 28.8"
    className={className}
    {...rest}
  >
    <title className="sr-only">FuelTypeIcon</title>
    <path
      fill="#4cc2ae"
      fillRule="evenodd"
      d="M2 13.087c0-2.096 0-3.145.553-3.94C3 8.506 3.718 8.157 5 7.681v-.62c0-1.306 0-1.958.338-2.408.087-.116.189-.22.302-.308C6.08 4 6.72 4 8 4h.818c.507 0 .761 0 .97.057a1.653 1.653 0 011.156 1.18l.072.293 3.002-1.07c3.636-1.298 5.454-1.947 6.718-1.032C22 4.342 22 6.305 22 10.233v5.65c0 2.884 0 4.326-.879 5.221C20.243 22 18.828 22 16 22H8c-2.828 0-4.243 0-5.121-.896C2 20.21 2 18.767 2 15.884v-2.797zm5.47-2.557a.75.75 0 111.06-1.06l1.5 1.5c.039.038.072.08.1.123C10.564 11 11.156 11 12 11c.831 0 1.418 0 1.85.09l1.62-1.62a.75.75 0 111.06 1.06l-1.62 1.62c.09.432.09 1.019.09 1.85 0 .831 0 1.418-.09 1.85l1.62 1.62a.75.75 0 11-1.06 1.06l-1.62-1.62c-.432.09-1.019.09-1.85.09-.831 0-1.418 0-1.85-.09l-1.62 1.62a.75.75 0 01-1.06-1.06l1.62-1.62C9 15.418 9 14.831 9 14c0-.844 0-1.436.093-1.87a.756.756 0 01-.123-.1l-1.5-1.5z"
      clipRule="evenodd"
    ></path>
  </svg>
);

/**
 * Component for rendering a year icon.
 * @component
 * @param className Optional additional CSS classes for customization (optional).
 * @param rest Any other additional attributes to pass to the SVG element (optional).
 * @example
 * <YearIcon className="size-8" />
 */
export const YearIcon = ({ className, ...rest }: SVGProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="800"
    height="800"
    fill="#4cc2ae"
    version="1.1"
    viewBox="0 0 254.532 254.532"
    xmlSpace="preserve"
    className={className}
    {...rest}
  >
    <title className="sr-only">YearIcon</title>
    <path d="M127.267.001C57.092.001 0 57.091 0 127.266s57.092 127.266 127.267 127.266 127.266-57.091 127.266-127.266S197.441.001 127.267.001zM38.646 158.994c.138-.014.273-.023.411-.038l48.101-5.039c.41-.043.825-.064 1.232-.064 5.951 0 11.081 4.642 11.679 10.568l5.221 51.762c.075.751.18 1.661.317 2.691-31.106-7.353-56.295-30.183-66.961-59.88zm88.452-7.478c-13.393 0-24.249-10.857-24.249-24.249 0-13.393 10.856-24.25 24.249-24.25s24.249 10.857 24.249 24.25c0 13.392-10.857 24.249-24.249 24.249zm21.828 67.358c.138-1.031.242-1.941.317-2.692l5.221-51.761c.598-5.922 5.724-10.561 11.67-10.561.409 0 .825.022 1.236.065l47.764 5.022c.249.026.495.045.743.069-10.668 29.687-35.852 52.507-66.951 59.858zm4.642-127.845c-7.229-2.545-16.63-3.947-26.471-3.947s-19.242 1.401-26.471 3.947L34.01 114.485c6.256-45.878 45.69-81.347 93.257-81.347 47.61 0 87.072 35.533 93.273 81.472l-66.972-23.581z"></path>
  </svg>
);

/**
 * Component for rendering a euro icon.
 * @component
 * @param className Optional additional CSS classes for customization.
 * @param rest Any other additional attributes to pass to the SVG element.
 * @example
 * <EuroIcon className="size-8" />
 */
export const EuroIcon = ({ className, ...rest }: SVGProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="800"
    height="800"
    fill="none"
    stroke="#4cc2ae"
    viewBox="0 0 24 24"
    className={className}
    {...rest}
  >
    <title className="sr-only">EuroIcon</title>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M16 8.944C15.183 7.762 13.904 7 12.465 7 10 7 8 9.239 8 12s2 5 4.465 5c1.439 0 2.718-.762 3.535-1.944M7 10.5h4m-4 3h4M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    ></path>
  </svg>
);
