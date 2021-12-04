const Footer = () => {
  return (
    <div
      style={{
        position: "fixed",
        zIndex: 600,
        right: 0,
        bottom: 0,
        backgroundColor: "var(--transparent-white)",
        borderRadius: "10px",
        padding: "2px",
      }}
    >
      <p style={{ fontSize: "8px", color: "var(--transparent-black)", margin: "1px" }}>© WikiCollage 2022</p>
    </div>
  );
};

export default Footer;
