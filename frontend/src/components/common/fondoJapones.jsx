import React from "react";
import fondoJapones from "../../assets/images/fondo_japones.jpg";

const FondoJapones = ({ children }) => (
  <div
    style={{
      minHeight: "100vh",
      width: "100vw",
      backgroundImage: `url(${fondoJapones})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}
  >
    {children}
  </div>
);

export default FondoJapones;
