import React from "react";

type SVGProps = React.SVGAttributes<SVGElement>;

const Check = ({ className, ...rest }: SVGProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="115"
      height="115"
      viewBox="0 0 133 133"
      className={className}
      {...rest}
    >
      <g fill="none" fillRule="evenodd" stroke="none" strokeWidth="1">
        <circle cx="66.5" cy="66.5" r="54.5" fill="#4cc2ae"></circle>
        <circle cx="66.5" cy="66.5" r="54.5" stroke="#4cc2ae" strokeWidth="4">
          <animate
            fill="freeze"
            attributeName="stroke-dasharray"
            dur="0.38s"
            values="0, 345.576px;345.576px, 345.576px"
          ></animate>
        </circle>
        <path stroke="currentColor" strokeWidth="5.5" d="M41 70L56 85 92 49">
          <animate
            fill="freeze"
            attributeName="stroke-dasharray"
            dur="0.34s"
            values="0, 75px;75px, 75px"
          ></animate>
        </path>
      </g>
    </svg>
  );
};

export default Check;
