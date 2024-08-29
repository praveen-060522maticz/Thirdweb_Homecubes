import React, { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

function ParentOutlet() {

    const navigate = useNavigate()
    // useEffect(() => {
    //     navigate("/Home")
    // }, [])
    return (
        <div>
            <Outlet />
        </div>
    )
}

export default ParentOutlet