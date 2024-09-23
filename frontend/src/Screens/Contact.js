import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import BottomBar from '../Components/BottomBar'
import Header from '../Components/Header'
import { NavLink } from 'react-router-dom'
import Footer from '../Components/Footer'
import wallety from '../assets/lotties/wallet.json'
import Lottie from "lottie-react";
import { useState,useEffect } from "react"
import {addcontactdata} from '../actions/axioss/user.axios'
import { useHistory } from 'react-router-dom'
import { toast } from "react-toastify";
function Contact() {
// var history = useHistory()
// const [alldata,setAlldata]=useState([])
    const [Name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [comment, setComment] = useState("");


    const addcontactus = async () => {
        var errors = {};
        if (!Name) {
            errors.Name = "Name cannot be empty"
            return toast.error("Name cannot be empty")
        }

        if (!email) {
            errors.email = "email cannot be empty"
            return toast.error("email cannot be empty")
        }
        if (!comment) {
            errors.messages = "messages cannot be empty"
            return toast.error("messages cannot be empty")
        }
        var contactdata = {
            Name: Name,
            email: email,
            comment: comment,
            action:"add"
        }
        var resp = await addcontactdata(contactdata);
        console.log("contactdata",resp)
        if (resp?.status == true) {
            setName("")
            setEmail("")
            setComment("")
            toast.success(resp.msg)
            
        }

    }

    return (
        <>
            <BottomBar />
            <Header />

            <div className="contact_container">
            <img className='img-fluid' src={require('../assets/images/map.png')} />
            <Row className='justify-content-center mt_5'>
                        <Col lg={8}>
                            <Row className=''>
                                <div className='blogInfo_placecomment'>
                                    <p className='blogINfo_usercomment text-center mt_4'>Send us Message</p>

                                    <Row className='justify-content-between mt_4'>
                                        <Col lg={6} md={6} sm={6} xs={12} className='mb_2'>
                                            <p className='blogInfo_inplabel'>Full Name</p>
                                            <input type="text" className='blogInfo_input mt-2' id="Name" placeholder='Enter Name' value={Name} onChange={(e) => { setName(e.target.value) }} />
                                        </Col>
                                        <Col lg={6} md={6} sm={6} xs={12} className='mb_2 mt_2'>
                                            <p className='blogInfo_inplabel'>Email address</p>
                                            <input type="text" className='blogInfo_input mt-2' placeholder='Enter Email Address' value={email} onChange={(e) => { setEmail(e.target.value) }} />
                                        </Col>
                                        <Col lg={12} xs={12} className='mt_2'>
                                            <p className='blogInfo_inplabel'>Message</p>
                                            <textarea id="comment" className='blogInfo_textarea mt-2' name="comment" rows="4" cols="50" value={comment} onChange={(e) => { setComment(e.target.value) }} />
                                        </Col>

                                        <div className='text-center mt_4'>
                                            <button className='bodygradientBtn' onClick={addcontactus}>
                                                <Lottie animationData={wallety} className="header_walletLottie" loop={true} />

                                                Submit</button>
                                        </div>
                                        <Col lg={12} xs={12} className='mt_4 contact_bluebe'>
                                            <Row>
                                                <Col lg={6} md={6} sm={6} xs={12} className='contact_bluemobcen mb-3 mb-sm-0'>
                                                    <div>
                                                        <p className='contact_blackText'>Contact Information</p>
                                                        <div className='contact_mailDtl mt_1'>
                                                            <img className='contact_blckmail' src={require('../assets/images/blackmail.svg').default} />
                                                            <p className='contact_mailadd'>admin@homecube.io</p>
                                                        </div>
                                                    </div>

                                                </Col>
                                                <Col lg={6} md={6} sm={6} xs={12} className='contact_socialAll contact_bluemobcen'>
                                                    <div>
                                                        <p className='contact_blackText'>Social Media</p>
                                                        <div className='contact_socialwrapper mt_1'>
                                                            <NavLink to=''>
                                                                <img className='contact_blckmail' src={require('../assets/images/blacktele.svg').default} />
                                                            </NavLink>
                                                            <NavLink to=''>
                                                                <img className='contact_blckmail' src={require('../assets/images/blacktwitter.svg').default} />
                                                            </NavLink>
                                                            <NavLink to=''>
                                                                <img className='contact_blckmail' src={require('../assets/images/blackinsta.svg').default} />
                                                            </NavLink>
                                                            <NavLink to=''>
                                                                <img className='contact_blckmail' src={require('../assets/images/blackdiscard.svg').default} />
                                                            </NavLink>
                                                        </div>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </div>
                            </Row>

                        </Col>
                    </Row>
                </div>
          
            <Footer />
        </>
    )
}

export default Contact