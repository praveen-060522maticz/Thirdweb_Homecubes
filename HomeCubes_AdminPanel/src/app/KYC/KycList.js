import React, { Component, useState, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import ReactDatatable from '@ashvin27/react-datatable';
import "react-toastify/dist/ReactToastify.css";
import { Link } from 'react-router-dom';
import { collectionFunctions, createProject, getKycList } from '../../axioscalls/admin';
import config from '../../lib/config'
import { useSelector } from 'react-redux';
import { address_showing } from '../../lib/common';
import Modal from "react-modal";
import { toast } from 'react-toastify'

import { Button, Form } from "react-bootstrap";
// import {TokenDetail} from '';

export default function KycList(props) {

    var location = useLocation();
    const { pathname, state } = location;
    const path = pathname.split("/")[1]
    console.log("pathname,stae", pathname, state, path)

    const { UserAccountAddr, } = useSelector((state) => state.wallet_detail)

    const [selected, setselected] = useState("")
    const [kycList, setKycList] = useState("");
    const [show, setShow] = useState(false);
    const [comment, setComment] = useState('')


    useEffect(() => {
        getGalleryData()
    }, [])

    const getGalleryData = async () => {
        try {
            var resp = await getKycList({ action: "get" });
            console.log("respresp", resp);
            setKycList(resp.data ?? [])
        } catch (error) {
            console.log("nerr on getGalleryData", error);
        }
    }

    console.log("kycList", kycList);


    const setChangeStatus = async (status, id) => {
        console.log("sesefsfes", { action: "changeStatus", KycStatus: status, _id: id ?? selected, comment: comment });
        const setData = await getKycList({ action: "changeStatus", KycStatus: status, _id: id ?? selected, comment: comment });
        console.log("setData", setData);
        if (setData?.success == "success") { toast.success("Kyc updated"); window.location.reload() }
        else toast.error(setData?.msg ?? "Error")
    }

    const customStyles = {
        content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
        },
    };

    const columns = [
        {
            key: "",
            text: "S No",
            className: "NFT",
            align: "left",
            sortable: true,
            cell: (record, index) =>
                <div>{index + 1}
                </div>

        },
        {
            // key: "WalletAddress            ",
            text: "Wallet Address",
            className: "NFT",
            align: "left",
            cell: rec =>
                <div>{address_showing(rec.WalletAddress)}</div>
        },
        {
            key: "EmailId",
            text: "Email Address",
            className: "NFT",
            align: "left"
        },
        {
            key: "mobileNumber",
            text: "Mobile Number",
            className: "NFT",
            align: "left"
        },
        {
            key: "Nationality",
            text: "Nationality",
            className: "NFT",
            align: "left"
        },
        {
            key: "Address",
            text: "Address",
            className: "NFT",
            align: "left"
        },
        {
            key: "KycStatus",
            text: "Kyc Status",
            className: "NFT",
            align: "left"
        },
        {
            text: "Kyc File",
            className: "NFT",
            align: "left",
            cell: rec =>
                <div>
                    < a href={`${config.ImG}/user/${rec.WalletAddress}/kyc/${rec.kycFile}`} target='_blank' >
                        <img src={`${config.ImG}/user/${rec.WalletAddress}/kyc/${rec.kycFile}`} style={{ height: 50, width: 50 }} />
                    </a>
                </div>
        },
        {
            text: "Approve",
            align: "center",
            cell: record =>
                <>{record?.KycStatus == "submit" ?
                    <div className='accept_reject_img_div' onClick={() => { setselected(record._id); setChangeStatus("complete", record._id) }} >
                        <img src={require('../../assets/images/bluecheck.svg')} style={{ height: 25, width: 25 }} />
                    </div> : <></>
                }

                </>


        },
        {
            text: "Deny",
            cell: record =>
                <>
                    {record?.KycStatus == "submit"  ?
                        <div className="accept_reject_img_div" onClick={() => { setselected(record._id); setShow(true) }}>
                            {/* <div onClick={() => setChangeStatus("retry", record._id)}> */}
                            <img src={require('../../assets/images/close.svg')} style={{ height: 25, width: 25 }} />
                        </div> : <></>}
                </>


        },


    ]


    return (

        <>

            <div>
                <div className="page-header">
                    <nav aria-label="breadcrumb">

                    </nav>
                </div>
                <div className="row">

                    <div className="col-lg-12 grid-margin stretch-card">
                        <div className="card">
                            <div className="card-body">
                                <h4 className="card-title">Kyc List</h4>
                                <div className="table-responsive">
                                    <ReactDatatable

                                        records={kycList}
                                        columns={columns}
                                    />

                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <Modal
                isOpen={show}
                style={customStyles}
                contentLabel="Example Modal"
            >
                {/* <div className="steps_to_follow"> */}

                <div className="steps_to_follow">
                    <div className="title_close">
                        <button onClick={() => setShow(false)}>x</button>
                    </div>
                    <label>Comment for rejection</label>
                    <textarea rows="4" cols="50" className="form-control" value={comment} onChange={(e) => setComment(e.target.value)} id="exampleInputUsername1" placeholder="Comment" autoComplete="off" />
                </div>
                {/* </div> */}
                <Link >
                    <button className='btn mb-2 mt-3 allbtn' onClick={() => setChangeStatus("retry")} type='button'>Reject</button>
                </Link>
            </Modal >
        </>

    )

}
