import React, { useState } from "react";
import { Mosaic } from 'react-loading-indicators';

const ImageWithLoader = ({ src, alt, className, style, onClick }) => {
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
        <>
            {isLoading &&
                <div className="d-flex align-items-center justify-content-center w-100 h-100 ">
                    <Mosaic color="#16ebc3" size="small" text="" textColor="#091411" />
                </div>
            } {/* Loader while image is loading */}

            <img
                src={src}
                alt={alt}
                className={className}
                onClick={onClick}
                onLoad={handleImageLoad}
                onError={handleImageError}
                style={{ ...style, display: isLoading ? "none" : "block" }} // Show image when loading is complete
            />
        </>
    );
};

export default ImageWithLoader;
