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
import { getReferralReports } from '../actions/axioss/user.axios'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import { address_showing } from '../actions/common'
import CopyToClipboard from 'react-copy-to-clipboard'
function ReferralReport() {
  let currDate = new Date()
  const { payload } = useSelector((state) => state.LoginReducer.User);
  const [refmodal, setRefmodal] = useState(false)
  const [startDate, setStartDate] = useState(new Date(currDate.setDate(currDate.getDate() - 10)));
  const [endDate, setEndDate] = useState(new Date());
  const [refReports, setRefReports] = useState([])
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


  useEffect(() => {
    if (payload?.WalletAddress) {
      fetchReferralReport()
    }
  }, [payload])

  const fetchReferralReport = async () => {
    try {
      const reqData = {
        walletAddress: payload?.WalletAddress,
        startDate,
        endDate
      }
      const reports = await getReferralReports(reqData)
      console.log("ReferralReport res", reports)
      if (reports?.success == "success") {
        setRefReports(reports?.data)
      } else {
        setRefReports(reports?.data)
        toast.error(reports?.msg)
      }
    } catch (error) {
      console.log("fetchReferralReport catch err", error)
    }
  }

  const extractDate = (isoTimes) => {
    let date = new Date(isoTimes);
    let formattedDate = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');
    return formattedDate
  }

  const extractTime = (isoTimes) => {
    let date = new Date(isoTimes);
    let formattedTime = String(date.getHours()).padStart(2, '0') + ':' + String(date.getMinutes()).padStart(2, '0') + ':' + String(date.getSeconds()).padStart(2, '0');
    return formattedTime
  }









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

            <Link to={`/profile/${payload?.WalletAddress}`} className="back_btn"><FaAngleLeft /> Back</Link>
            <div className='head_section'>
              <h1 className='head_txt'> Referral Report</h1>
              <div className='daterangesec'>
                <div className='daterange_input'>
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    // selectsStart
                    // startDate={startDate}
                    // endDate={endDate}
                  />
                  <FaAngleDown className='angledown' />
                </div>

                <div className='gapsec'>

                </div>
                <div className='daterange_input'>
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    // selectsEnd
                    // startDate={startDate}
                    // endDate={endDate}
                    // minDate={startDate}
                  />
                  <FaAngleDown className='angledown' />
                </div>


              </div>
              {/* <div className='submit_btnsec'>
                <button type='button' className='nftinfo_gradeientBtn' onClick={() => setRefmodal(true)}>Submit</button>
              </div> */}

              <div className='submit_btnsec'>
                <button type='button' className='nftinfo_gradeientBtn' onClick={fetchReferralReport}>Submit</button>
              </div> 



            </div>
            {/* <div className='tablesec'>
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

            </div> */}

          <div className='tablesec'>
              <p className='tablesec_head'>Report</p>
              <div className="nftInfo_table nftalltable hc-nftInfo__table">
                <div className="table-responsive">
                  {
                    refReports?.length > 0 ? 

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
                      {
                        refReports.map((item) => {
                          return (
                            <tr>
                              <td>{extractDate(item?.createdAt)}</td>
                              <td>{extractTime(item?.createdAt)}</td>
                              <td>
                                {address_showing(item?.transactionId)}
                                <CopyToClipboard
                                  onCopy={() => toast.success("Transaction ID successfully")}
                                  text={`${item?.transactionId}`}
                                >
                                  <i class="fa-regular fa-copy mx-2"></i>

                              </CopyToClipboard>
                                </td>
                              <td>{address_showing(item?.fromAddress)}</td>
                              <td>{item?.commissionAmt}</td>
                            </tr>
                          )
                        })
                      }
                      </tbody>
                  </table>
                  :
                  <p className='text-center fw-bold'>No Data Found</p>
                  }
                </div>
              </div>

            </div>





          </div>

        </div>


      </div>

      <div ref={footerRef}>
        <Footer />
      </div>

      {refmodal && <Referralmodal show={refmodal} handleClose={() => setRefmodal(false)} />}
    </>
  )
}

export default ReferralReport