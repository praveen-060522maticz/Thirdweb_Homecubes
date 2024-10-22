import React, { useEffect, useState, useRef } from 'react'
import BottomBar from '../Components/BottomBar'
import Header from '../Components/Header'
import SideTab from '../Components/SideTab'
import Footer from '../Components/Footer'
import { Link, useParams } from 'react-router-dom'
import { FaAngleDown, FaAngleLeft } from "react-icons/fa6";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import Referralmodal from '../Modals/Referralmodal'
function ReferralReport() {
    const [refmodal,setRefmodal] = useState(false)
    const [startDate, setStartDate] = useState(new Date("2014/02/08"));
    const [endDate, setEndDate] = useState(new Date("2014/02/10"));
  const footerRef = useRef(null);
  const [isFixed, setIsFixed] = useState(true);
  const handleScroll = () => {

    const footerTop = footerRef.current.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    if (footerTop < windowHeight) {
      setIsFixed(false);


    } else {
      setIsFixed(true);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);







  return (
    <>
      <BottomBar />
      <Header />

      <div className="innercontent referral_report">
        <div className={isFixed ? "side_left fixed" : "side_left sticky"}  >
          <SideTab />
        </div>
        <div className="banner_section">
          <div className="inner-container__width">
           
                <Link to="/profile" className="back_btn"><FaAngleLeft /> Back</Link>
               <div className='head_section'>
                <h1 className='head_txt'> Referral Report</h1>
                <div className='daterangesec'>
                    <div className='daterange_input'>
                    <DatePicker
        selected={startDate}
        onChange={(date) => setStartDate(date)}
        selectsStart
        startDate={startDate}
        endDate={endDate}
      />
      <FaAngleDown className='angledown' />
                    </div>
                
      <div className='gapsec'>

      </div>
      <div className='daterange_input'>
      <DatePicker
        selected={endDate}
        onChange={(date) => setEndDate(date)}
        selectsEnd
        startDate={startDate}
        endDate={endDate}
        minDate={startDate}
      />
      <FaAngleDown className='angledown' />
      </div>
     

                </div>
                <div className='submit_btnsec'>
                <button type='button' className='nftinfo_gradeientBtn' onClick={()=>setRefmodal(true)}>Submit</button>
                </div>
              
 

               </div>
               <div className='tablesec'>
            <p className='tablesec_head'>Report</p>
            <div className="nftInfo_table nftalltable hc-nftInfo__table">
                                                <div className="table-responsive">
                                                    <table className="table">
                                                        <thead>
                                                            <tr>
                                                                <th>Date</th>
                                                                <th>Time</th>
                                                                <th>TXID</th>
                                                                <th>Referred Wallet Address</th>
                                                                <th>Commission Amount (USDT)</th>
                                                              
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                <td>21/03/2024</td>
                                                                <td>18:25</td>
                                                                <td>0x9nb879879879987</td>
                                                                <td>0x9nb879879879987</td>
                                                                <td>20.00 USDT</td>
                                                            </tr>
                                                            <tr>
                                                                <td>21/03/2024</td>
                                                                <td>18:25</td>
                                                                <td>0x9nb879879879987</td>
                                                                <td>0x9nb879879879987</td>
                                                                <td>20.00 USDT</td>
                                                            </tr>
                                                            <tr>
                                                                <td>21/03/2024</td>
                                                                <td>18:25</td>
                                                                <td>0x9nb879879879987</td>
                                                                <td>0x9nb879879879987</td>
                                                                <td>20.00 USDT</td>
                                                            </tr>
                                  
                                                         
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>

        </div>

           



          </div>
          
        </div>
        
       
      </div>

      <div ref={footerRef}>
        <Footer />
      </div>

    {refmodal &&   <Referralmodal show={refmodal} handleClose={()=>setRefmodal(false)}/>}
    </>
  )
}

export default ReferralReport