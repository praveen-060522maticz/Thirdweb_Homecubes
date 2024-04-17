import React, { useState } from "react";
import { parseHtmlString } from "../actions/common";


export const ReadMore = ({ descText }) => {
    const [description, setDescription] = useState(false);

    return (
        <>
            {description ? (
                <p className="mp_detailbrief mint_scrollText">
                    {parseHtmlString(descText)}
                </p>
            ) : (
                <p className="mp_detailbrief mint_scrollText">
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