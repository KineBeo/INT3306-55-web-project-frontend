import React from "react";
import Link from "next/link";
interface SignInButtonProps {
  onClick?: () => void;
  href?: string;
}

const SignInButton: React.FC<SignInButtonProps> = ({ onClick, href }) => {
  return (
    <Link
      href={href ? href : ""}
      onClick={onClick}
      className="flex items-center px-4 py-2 border-2 border-gray-400 rounded-lg hover:bg-gray-100 focus:outline-none cursor:pointer">
      <span className="mr-2">
        <svg
          viewBox="0 0 200 200"
          width="1.25em"
          height="1.25em"
          xmlns="http://www.w3.org/2000/svg"
          role="presentation">
          <path d="M118.61 188.05c.7-.15 1.36-.36 2.05-.53c2.32-.55 4.62-1.13 6.87-1.85c.51-.17 1-.38 1.51-.55c2.4-.82 4.77-1.7 7.08-2.72c.31-.14.6-.3.91-.44c2.48-1.12 4.91-2.34 7.26-3.67c.14-.08.26-.16.4-.24c2.51-1.44 4.94-2.99 7.28-4.66c.01 0 .03-.02.04-.03C174.97 157.05 190 130.3 190 100c0-49.71-40.29-90-90-90s-90 40.29-90 90c0 30.31 15.03 57.06 37.99 73.36c.01 0 .03.02.04.03c2.35 1.67 4.78 3.22 7.28 4.66c.14.08.26.17.4.24c2.36 1.34 4.79 2.55 7.27 3.68c.31.14.6.3.9.43c2.31 1.01 4.68 1.9 7.08 2.72c.51.17 1 .39 1.51.55c2.25.72 4.55 1.3 6.87 1.85c.69.16 1.35.38 2.05.53c2.28.48 4.61.81 6.95 1.11c.75.1 1.48.26 2.24.34c3.1.32 6.23.5 9.42.5s6.32-.17 9.42-.5c.76-.08 1.49-.24 2.24-.34c2.34-.3 4.67-.63 6.95-1.11zM100 26.36c40.6 0 73.64 33.03 73.64 73.64c0 19.08-7.35 36.43-19.3 49.52c-14.45-12.93-33.42-20.88-54.34-20.88s-39.89 7.95-54.34 20.88c-11.94-13.09-19.3-30.44-19.3-49.52c0-40.6 33.03-73.64 73.64-73.64zM75.45 91.81V71.36c0-1.39.12-2.76.34-4.09C77.74 55.66 87.83 46.82 100 46.82c13.56 0 24.55 10.99 24.55 24.55v20.45c0 13.56-10.99 24.55-24.55 24.55s-24.55-10.99-24.55-24.55z"></path>
        </svg>
      </span>
      <span className="text-black font-medium">Sign in</span>
    </Link>
  );
};

export default SignInButton;
