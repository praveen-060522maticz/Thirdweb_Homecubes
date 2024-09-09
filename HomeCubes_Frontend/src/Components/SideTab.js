import React from 'react'
import { NavLink } from 'react-router-dom'

function SideTab() {
    return (
        <>

            <div className='sidetab_whole hc-sidetab'>
                <NavLink className="sidetab_link" to='/'>
                    <div className='singleTab'>
                        <img className='sidetab_logo' src={require('../assets/images/home.svg').default} />
                        <p className='sidetab_laebl'>Home</p>
                    </div>
                </NavLink>
                <NavLink className="sidetab_link" to='/minting'>
                    <div className='singleTab'>
                        <img className='sidetab_logo' src={require('../assets/images/initialsales.svg').default} />
                        <p className='sidetab_laebl'>Initial Sales</p>
                    </div>
                </NavLink>
                <NavLink className="sidetab_link" to='/marketplace'>
                    <div className='singleTab'>
                        <img className='sidetab_logo' src={require('../assets/images/marketplace.svg').default} />
                        <p className='sidetab_laebl'>Marketplace</p>
                    </div>
                </NavLink>
                <NavLink className="sidetab_link" to='/staking'>
                    <div className='singleTab'>
                        <img className='sidetab_logo' src={require('../assets/images/claimincome.svg').default} />
                        <p className='sidetab_laebl text-center'> Claim Income</p>
                    </div>
                </NavLink>
                <NavLink className="sidetab_link" to='/projects'>
                    <div className='singleTab'>
                        <img className='sidetab_logo' src={require('../assets/images/projects.svg').default} />
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