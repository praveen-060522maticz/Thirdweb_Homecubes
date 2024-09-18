import React, { useState } from "react";
import { parseHtmlString } from "../actions/common";


export const ReadMore = ({ descText }) => {
    const [description, setDescription] = useState(false);
    console.log("descText", descText);
    return (
        <>
            {description ? (
                <p className="hc-mint__banner--desc mt-3 mb-0">
                    {parseHtmlString(descText)}
                </p>
            ) : (
                <p className="hc-mint__banner--desc mt-3 mb-0">
                    {descText?.length > 100
                        ? parseHtmlString(descText)?.slice(0, 100)?.concat("...")
                        : parseHtmlString(descText)}
                </p>
            )}
            <button
                className="mp_readmoreBtn readmore_left mt-2"
                onClick={() => setDescription(!description)}
            >
                {description ? "Read Less" : "Read More"}
            </button>
        </>
    )
}