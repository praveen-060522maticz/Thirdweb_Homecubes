import React, { useEffect, useState } from "react";
import Lottie from "react-lottie";
import axios from "axios";
import { imgFormats, videoFileFormats } from "../lib/common";

const ImageComp = ({ url, className,style }) => {
console.log(' url, className,style---->', url, className,style);
    const [lottieData, setLottieData] = useState(null);
    // useEffect(() => {
    //     axios.get(url)
    //         .then(response => {
    //             console.log('response---->', response);
    //             setLottieData(response.data);
    //         })
    //         .catch(error => {
    //             console.error('Error fetching Lottie data:', error);
    //         });
    // }, [url]);


    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData:  url,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    };

    const getFormat = url?.split(".")?.splice(-1)?.[0]?.toLowerCase();

    return <>
        <div>
            {url &&
                (getFormat?.includes("json") ?
                    (lottieData ? (
                        <Lottie
                            options={defaultOptions}
                            style={style}
                            className={className}
                            
                        />
                    ) : (
                        <div>Loading Lottie animation...</div>
                    ))
                    :
                    videoFileFormats.includes(getFormat) ?
                        <video className={className} style={style}/>
                        :
                        imgFormats.includes(getFormat) ?
                            <img className={className} src={url} style={style} />
                            :
                            <></>)
            }
        </div>

    </>
};


export default ImageComp;