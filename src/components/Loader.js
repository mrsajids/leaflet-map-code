import React from "react";
import "../App.css"; // Make sure to style the loader

const Loader = ({ isLoading }) => {
  return (
    isLoading && (
      <div className="map-loader">
        <div className="spinner"></div>
      </div>
    )
  );
};

export default Loader;
