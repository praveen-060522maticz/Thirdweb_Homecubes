import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'

const ImageSkeleton = () => {
    return (
        <SkeletonTheme baseColor="#202020" highlightColor="#444">
                <Skeleton count={1} />
        </SkeletonTheme>
    );
};

export default ImageSkeleton;