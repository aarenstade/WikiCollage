const LoadingOverlay = () => {
  return (
    <div
      style={{
        zIndex: 500,
        position: "absolute",
        width: "100%",
        height: "500%",
        top: "var(--navbar-offset)",
        left: 0,
        backgroundColor: "var(--transparent-black)",
      }}
    >
      {/* TODO loading icon */}
      <p
        style={{ color: "white", position: "fixed", top: "calc(var(--navbar-offset) + 10px)", left: "calc(100vw / 2)" }}
      >
        Loading...
      </p>
    </div>
  );
};

export default LoadingOverlay;
