import React from 'react'
import { Breadcrumb } from 'react-bootstrap'
import { NavLink, useLocation } from 'react-router-dom'

function BreadPath() {
  const location = useLocation()
  console.log(location.pathname.split("/")[1],"pathooo");
  return (
    <div className='breadCrumb my-3'>
        <NavLink to='/' className='breadCrumb_initial'>Home</NavLink>
        <img src={require('../assets/images/threecube.svg').default} className='breadCrumb_separator'/>
        <div className='breadCrumb_initial active'>/{location.pathname.split("/")[1]}/</div>
    </div>
  )
}

export default BreadPath