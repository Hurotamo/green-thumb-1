import React from "react";

interface BgProps {
  children: React.ReactNode;
}

const BackgroundImage: React.FC<BgProps> = ({ children }) => {
  const backgroundStyle = {
    backgroundImage: `url('/images/bg1.jpeg')`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "100vh",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    // alignItems: "center",
  };

  return <div style={backgroundStyle}>{children}</div>;
};

export default BackgroundImage;
