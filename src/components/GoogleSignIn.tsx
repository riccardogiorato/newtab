interface GoogleSignInProps {
  onClick: () => void;
}

export const GoogleSignIn: React.FC<GoogleSignInProps> = ({
  onClick,
  ...props
}) => {
  return (
    <button
      onClick={onClick}
      {...props}
      style={{
        width: "240px",
      }}
      className="mx-auto rounded-xl justify-center items-center text-white flex mt-4 font-medium bg-blue-500 hover:bg-blue-600"
    >
      <span className="flex justify-center items-center ">
        <svg
          width="16"
          height="16"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            margin: "16px",
          }}
        >
          <g clipPath="url(#clip0)">
            <path
              d="M11.7619 6.13764C11.7619 5.72977 11.7288 5.31971 11.6583 4.91846H5.9989V7.22895H9.23977C9.10529 7.97412 8.67317 8.63332 8.04043 9.05221V10.5514H9.97393C11.1093 9.50637 11.7619 7.9631 11.7619 6.13764Z"
              fill="#E1E1E6"
            />
            <path
              d="M5.99883 12.0002C7.61706 12.0002 8.98175 11.4688 9.97605 10.5517L8.04256 9.05253C7.50462 9.4185 6.81015 9.62574 6.00104 9.62574C4.43573 9.62574 3.10852 8.56971 2.63231 7.1499H0.637085V8.69537C1.65564 10.7215 3.73023 12.0002 5.99883 12.0002Z"
              fill="#E1E1E6"
            />
            <path
              d="M2.63017 7.14986C2.37884 6.40469 2.37884 5.59778 2.63017 4.8526V3.30713H0.637152C-0.213849 5.00252 -0.213849 6.99995 0.637152 8.69533L2.63017 7.14986Z"
              fill="#E1E1E6"
            />
            <path
              d="M5.99884 2.37434C6.85425 2.36111 7.681 2.683 8.30051 3.27385L10.0135 1.56082C8.92884 0.542264 7.48919 -0.0177213 5.99884 -8.39483e-05C3.73023 -8.39483e-05 1.65564 1.27862 0.637085 3.30692L2.6301 4.85239C3.10411 3.43038 4.43352 2.37434 5.99884 2.37434Z"
              fill="#E1E1E6"
            />
          </g>
          <defs>
            <clipPath id="clip0">
              <rect width="11.7619" height="12" fill="white" />
            </clipPath>
          </defs>
        </svg>
        <span className="ml-2.5">Sign in with Google</span>
      </span>
    </button>
  );
};
