import { useState } from "react";

const TutorialFrame = ({ tutorialTitle, iframeSrc }) => {
  const [loadedSrc, setLoadedSrc] = useState(null);
  if (loadedSrc !== iframeSrc)
    return (
      <div
        style={{
          minHeight: 646,
          borderRadius: 16,
          display: "grid",
          placeContent: "center",
          gap: 16,
          textAlign: "center",
          padding: 24,
          background: "var(--surface-02)",
        }}
      >
        <p>Try the {tutorialTitle} tutorial in an interactive CodeSandbox.</p>
        <button
          type="button"
          className="button button--primary"
          onClick={() => setLoadedSrc(iframeSrc)}
        >
          Load interactive {tutorialTitle} example
        </button>
        <p>Loading connects to CodeSandbox, a third-party service.</p>
      </div>
    );
  return (
    <iframe
      src={iframeSrc}
      loading="lazy"
      style={{
        width: "100%",
        height: 646,
        border: "0",
        borderRadius: "16px",
        overflow: "hidden",
      }}
      title={tutorialTitle}
      allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
      sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
    ></iframe>
  );
};

export default TutorialFrame;
