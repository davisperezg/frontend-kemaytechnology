import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";

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
