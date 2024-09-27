import React, { useState } from "react";

const ImageWithLoader = ({ src, alt }) => {
  const [isLoading, setIsLoading] = useState(true); // Initial loading state

  // When the image is loaded successfully
  const handleImageLoad = () => {
    setIsLoading(false);
  };

  // In case the image fails to load
  const handleImageError = () => {
    setIsLoading(false); // Hide loader on error, you can handle it differently
  };

  return (
    <div style={{ position: "relative", width: "300px", height: "300px" }}>
      {isLoading && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#f0f0f0",
          }}
        >
          {/* Loader */}
          <div>Loading...</div>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        onLoad={handleImageLoad} // Triggered when image loads successfully
        onError={handleImageError} // Triggered if image fails to load
        style={{ display: isLoading ? "none" : "block", width: "100%", height: "100%" }}
      />
    </div>
  );
};

export default ImageWithLoader;
