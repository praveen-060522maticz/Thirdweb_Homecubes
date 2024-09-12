import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'

function SideTab() {

    const location = useLocation().pathname

    console.log('locationlocation', location)



    return (
        <>
            <div className='sidetab_whole hc-sidetab'>
                <NavLink className={`sidetab_link ${location == "/" ? "active" : ""}`} to='/'>
                    <div className='singleTab'>
                        {location == '/' ? <img className='sidetab_logo' src={require('../assets/images/home_active.svg').default} /> : <img className='sidetab_logo' src={require('../assets/images/home.svg').default} />}
                        <p className='sidetab_laebl'>Homesdf</p>
                    </div>
                </NavLink>
                <NavLink className={`sidetab_link ${(location == '/minting' || location.includes("/mint/")) ? "active" : ""}`} to='/minting'>
                    <div className='singleTab'>
                        {(location == '/minting' || location.includes("/mint/")) ? <img className='sidetab_logo' src={require('../assets/images/initialsales_active.svg').default} /> : <img className='sidetab_logo' src={require('../assets/images/initialsales.svg').default} />}
                        <p className='sidetab_laebl'>Initial Sales</p>
                    </div>
                </NavLink>
                <NavLink className={`sidetab_link ${location == "/marketplace" ? "active" : ""}`} to='/marketplace'>
                    <div className='singleTab'>
                        {location == '/marketplace' ? <img className='sidetab_logo' src={require('../assets/images/marketplace.svg').default} /> : <img className='sidetab_logo' src={require('../assets/images/marketplace.svg').default} />}
                        <p className='sidetab_laebl'>Marketplace</p>
                    </div>
                </NavLink>
                <NavLink className={`sidetab_link ${location == "/"}`} to='/staking'>
                    <div className='singleTab'>
                        {location == '/staking' ? <img className='sidetab_logo' src={require('../assets/images/claimincome_active.svg').default} /> : <img className='sidetab_logo' src={require('../assets/images/claimincome.svg').default} />}
                        <p className='sidetab_laebl text-center'> Claim Income</p>
                    </div>
                </NavLink>
                <NavLink className={`sidetab_link ${location == "/"}`} to='/projects'>
                    <div className='singleTab'>
                        {location == '/projects' ? <img className='sidetab_logo' src={require('../assets/images/project_active.svg').default} /> : <img className='sidetab_logo' src={require('../assets/images/projects.svg').default} />}
                        <p className='sidetab_laebl'>All Properties</p>
                    </div>
                </NavLink>



                {/* <div className='d-flex justify-content-center'>
        <hr className='sidetab_divider'/>
        </div> */}
                {/* <div className='singleTab'>
            <img className='sidetab_logo' src={require('../assets/images/telegram.svg').default}/>
        </div>
        <div className='singleTab'>
            <img className='sidetab_logo' src={require('../assets/images/twitter.svg').default}/>
        </div>
        <div className='singleTab'>
            <img className='sidetab_logo' src={require('../assets/images/insta.svg').default}/>
        </div>
        <div className='singleTab'>
            <img className='sidetab_logo' src={require('../assets/images/discard.svg').default}/>
        </div> */}
            </div>

        </>
    )
}

export default SideTab