import React, { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

function SideTab() {

    const location = useLocation().pathname

    console.log('locationlocation', location)

    const [isScrolled, setIsScrolled] = useState(false);

    // Function to handle scroll event
    const handleScroll = () => {
        const scrollHeight = window.scrollY; // Current scroll position
        if (scrollHeight > 100) {
            setIsScrolled(true);
        }
        else {
            setIsScrolled(false);
        }
    };
    useEffect(() => {
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll); // Clean up event listener on unmount
        };
    }, []);

    const isHome = location == "/"
    const isInitialSale = location == '/minting' || location.includes("/mint/")
    const isMarketPlace = location == "/marketplace" || location.includes("/CollectionNfts/") || location.includes("/nftInfo/")
    const isStake = location.includes("/staking")
    const isProject = location == "/projects" || location.includes("/projectInfo/") || location.includes("/collectionInfo")

    return (
        <>
            {/* <div className='sidetab_whole hc-sidetab'> */}
            <div className={`${isScrolled && "active"} sidetab_whole hc-sidetab `}>
                <NavLink className={`sidetab_link ${isHome ? "active" : ""}`} to='/'>
                    <div className='singleTab'>
                        {isHome ? <img className='sidetab_logo' src={require('../assets/images/home_active.svg').default} /> : <img className='sidetab_logo' src={require('../assets/images/home.svg').default} />}
                        <p className='sidetab_laebl'>Home</p>
                    </div>
                </NavLink>
                <NavLink className={`sidetab_link ${isInitialSale ? "active" : ""}`} to='/minting'>
                    <div className='singleTab'>
                        {isInitialSale ? <img className='sidetab_logo' src={require('../assets/images/initialsales_active.svg').default} /> : <img className='sidetab_logo' src={require('../assets/images/initialsales.svg').default} />}
                        <p className='sidetab_laebl'>Initial Sales</p>
                    </div>
                </NavLink>
                <NavLink className={`sidetab_link ${isMarketPlace ? "active" : ""}`} to='/marketplace'>
                    <div className='singleTab'>
                        {isMarketPlace ? <img className='sidetab_logo' src={require('../assets/images/marketplace_active.svg').default} /> : <img className='sidetab_logo' src={require('../assets/images/marketplace.svg').default} />}
                        <p className='sidetab_laebl'>Marketplace</p>
                    </div>
                </NavLink>
                <NavLink className={`sidetab_link ${(isStake ? "active" : "")}`} to='/staking'>
                    <div className='singleTab'>
                        {(isStake ? "active" : "") ? <img className='sidetab_logo' src={require('../assets/images/claimincome_active.svg').default} /> : <img className='sidetab_logo' src={require('../assets/images/claimincome.svg').default} />}
                        <p className='sidetab_laebl text-center'> Claim Income</p>
                    </div>
                </NavLink>
                <NavLink className={`sidetab_link ${isProject ? "active" : ""}`} to='/projects'>
                    <div className='singleTab'>
                        {isProject ? <img className='sidetab_logo' src={require('../assets/images/property_white.svg').default} /> : <img className='sidetab_logo' src={require('../assets/images/property_green.svg').default} />}
                        <p className='sidetab_laebl'>All Properties</p>
                    </div>
                </NavLink>

            </div>

        </>
    )
}

export default SideTab