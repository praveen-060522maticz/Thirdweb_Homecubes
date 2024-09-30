import React, { useEffect, useState } from "react";
import Lottie from "react-lottie";
import axios from "axios";
import { imgFormats, videoFileFormats } from "../actions/common";
import ImageWithLoader from "./ImageWithLoader";
import { Mosaic } from "react-loading-indicators";

const LottieAnimation = ({ url, className, divClassname }) => {
    console.log("urlurlurl", url);
    const [lottieData, setLottieData] = useState(null);
    useEffect(() => {
        axios.get(url)
            .then(response => {
                console.log('response---->', response);
                setLottieData(response.data);
            })
            .catch(error => {
                console.error('Error fetching Lottie data:', error);
            });
    }, [url]);


    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: lottieData,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    };

    const getFormat = url?.split(".")?.splice(-1)?.[0]?.toLowerCase();

    return <>
        <div className={divClassname ? divClassname : "h-100"}>
            {url &&
                (getFormat == "json" ?
                    (lottieData ? (
                        <Lottie
                            options={defaultOptions}
                            height={300}
                            width={300}
                            className={className}

                        />
                    ) : (
                        // <div>Loading Lottie animation...</div>
                        // <span class="loaderss"></span>
                        <div className="d-flex align-items-center justify-content-center w-100 h-100 ">
                            <Mosaic color="#16ebc3" size="small" text="" textColor="#091411" />
                        </div>
                    ))
                    :
                    videoFileFormats.includes(getFormat) ?
                        <video className={className} />
                        :
                        imgFormats.includes(getFormat) ?
                            // <img className={className} src={url} />
                            <ImageWithLoader className={className} src={url} />
                            :
                            <></>)
            }
        </div>

    </>
};


export default LottieAnimation;