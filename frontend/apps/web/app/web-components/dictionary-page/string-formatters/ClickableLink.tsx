export const ClickableLinkStyler = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <span className="hover:underline">{children}</span>;
};
