const TutorialFrame = ({ tutorialLink, tutorialTitle, iframeSrc }) => {
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <p>{tutorialTitle}</p>
        <a href={tutorialLink} style={{ fontWeight: 600 }}>
          Full Tutorial →
        </a>
      </div>{" "}
      <iframe
        src={iframeSrc}
        style={{
          width: "100%",
          height: "600px",
          border: "0",
          borderRadius: "4px",
          overflow: "hidden",
        }}
        title={tutorialTitle}
        allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
        sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
      ></iframe>
    </div>
  );
};

export default TutorialFrame;
