import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

function ReferalPage() {
    const { referral } = useParams()
    const navigate = useNavigate();

    useEffect(() => {
        sessionStorage.setItem("referral", referral);
        navigate("/")
    }, [])


    return (

        <>
        </ >

    )
}

export default ReferalPage