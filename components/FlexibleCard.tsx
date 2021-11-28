import { FC } from "react";

const FlexibleCard: FC = ({ children }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "8px",
        margin: "10px",
        borderRadius: "15px",
        backgroundColor: "var(--transparent-white)",
      }}
    >
      {children}
    </div>
  );
};

export default FlexibleCard;
