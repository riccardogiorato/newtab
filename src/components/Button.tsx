export const Button: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement>
> = ({ children, ...props }) => {
  return (
    <button
      {...props}
      className="mx-auto rounded-xl justify-center items-center bg-white flex font-medium text-slate-700 hover:text-slate-800 drop-shadow-md hover:drop-shadow-xl transition"
    >
      {children}
    </button>
  );
};
