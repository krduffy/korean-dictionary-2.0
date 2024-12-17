export const LineBreakArea = ({ marginSize = 40 }: { marginSize: number }) => {
  return (
    <div
      style={{
        width: "75%",
        height: "2px",
        flexShrink: 0,
        backgroundColor: "#444444",
        marginLeft: "12.5%",
        marginRight: "12.5%",
        marginTop: `${marginSize}px`,
        marginBottom: `${marginSize}px`,
      }}
    />
  );
};
