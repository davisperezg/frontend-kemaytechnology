import React from "react";
import CircularProgress from "@mui/material/CircularProgress";

const Progress = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CircularProgress disableShrink />
    </div>
  );
};

export default Progress;
