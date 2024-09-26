import React, {useState, useEffect} from 'react'
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
      else{
        setIsScrolled(false); 
      }
    };
    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
    
        return () => {
          window.removeEventListener('scroll', handleScroll); // Clean up event listener on unmount
        };
      }, []);
      

    return (
        <>
            {/* <div className='sidetab_whole hc-sidetab'> */}
            <div className={`${isScrolled && "active"} sidetab_whole hc-sidetab `}>
                <NavLink className={`sidetab_link ${location == "/" ? "active" : ""}`} to='/'>
                    <div className='singleTab'>
                        {location == '/' ? <img className='sidetab_logo' src={require('../assets/images/home_active.svg').default} /> : <img className='sidetab_logo' src={require('../assets/images/home.svg').default} />}
                        <p className='sidetab_laebl'>Home</p>
                    </div>
                </NavLink>
                <NavLink className={`sidetab_link ${(location == '/minting' || location.includes("/mint/" )) ? "active" : ""}`} to='/minting'>
                    <div className='singleTab'>
                        {(location == '/minting' || location.includes("/mint/")) ? <img className='sidetab_logo' src={require('../assets/images/initialsales_active.svg').default} /> : <img className='sidetab_logo' src={require('../assets/images/initialsales.svg').default} />}
                        <p className='sidetab_laebl'>Initial Sales</p>
                    </div>
                </NavLink>
                <NavLink className={`sidetab_link ${(location == "/marketplace"  ) ? "active" : ""}`} to='/marketplace'>
                    <div className='singleTab'>
                        {(location == '/marketplace') ? <img className='sidetab_logo' src={require('../assets/images/marketplace_active.svg').default} /> : <img className='sidetab_logo' src={require('../assets/images/marketplace.svg').default} />}
                        <p className='sidetab_laebl'>Marketplace</p>
                    </div>
                </NavLink>
                <NavLink className={`sidetab_link ${location == "/"}`} to='/staking'>
                    <div className='singleTab'>
                        {location == '/staking' ? <img className='sidetab_logo' src={require('../assets/images/claimincome_active.svg').default} /> : <img className='sidetab_logo' src={require('../assets/images/claimincome.svg').default} />}
                        <p className='sidetab_laebl text-center'> Claim Income</p>
                    </div>
                </NavLink>
                <NavLink className={`sidetab_link ${(location == "/projects" || location.includes("/projectInfo/" ) ) ? "active" : ""}`} to='/projects'>
                    <div className='singleTab'>
                        {(location == '/projects' || location.includes("/projectInfo/" )) ? <img className='sidetab_logo' src={require('../assets/images/property_white.svg').default} /> : <img className='sidetab_logo' src={require('../assets/images/property_green.svg').default} />}
                        <p className='sidetab_laebl'>All Properties</p>
                    </div>
                </NavLink>

            </div>

        </>
    )
}

export default SideTab