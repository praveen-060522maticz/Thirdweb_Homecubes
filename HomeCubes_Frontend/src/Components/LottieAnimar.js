import React, { useEffect, useState } from "react";
import Lottie from "react-lottie";
import axios from "axios";
import { imgFormats, videoFileFormats } from "../actions/common";

const LottieAnimation = ({ url, className }) => {

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
        <div>
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
                        <div>Loading Lottie animation...</div>
                    ))
                    :
                    videoFileFormats.includes(getFormat) ?
                        <video className={className} />
                        :
                        imgFormats.includes(getFormat) ?
                            <img className={className} src={url} />
                            :
                            <></>)
            }
        </div>

    </>
};


export default LottieAnimation;