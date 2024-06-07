const TutorialFrame = ({ tutorialTitle, iframeSrc }) => {
  return (
    <iframe
      src={iframeSrc}
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
