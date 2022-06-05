export const LinkElement: React.FC<
  React.AnchorHTMLAttributes<HTMLAnchorElement>
> = ({ children, ...props }) => {
  return (
    <a {...props} className="underline text-blue-700 font-bold">
      {children}
    </a>
  );
};
