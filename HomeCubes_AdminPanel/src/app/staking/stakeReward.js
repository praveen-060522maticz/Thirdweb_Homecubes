import React, { Component, useState, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import ReactDatatable from '@ashvin27/react-datatable';
import "react-toastify/dist/ReactToastify.css";
import { Link } from 'react-router-dom';
import { collectionFunctions, createProject, getKycList, stakingFunctions } from '../../axioscalls/admin';
import config from '../../lib/config'
import { useSelector } from 'react-redux';
import { LSgetItem, address_showing } from '../../lib/common';
import Modal from "react-modal";
import { toast } from 'react-toastify'
import * as XLSX from 'xlsx'
import { Button, Form } from "react-bootstrap";
// import {TokenDetail} from '';

export default function StakeReward(props) {

    var location = useLocation();
    const { pathname, state } = location;
    const path = pathname.split("/")[1]
    console.log("pathname,stae", pathname, state, path)

    const { UserAccountAddr, } = useSelector((state) => state.wallet_detail)

    const [selected, setselected] = useState("")
    const [stakeList, setstakeList] = useState([]);
    const [show, setShow] = useState(false);
    const [xlFile, setXlFile] = useState(null)


    const onChangeFile = async (e) => {
        var reading = e.target?.files[0]
        setXlFile(reading)
        var nfts = []
        const reader = new FileReader();
        reader.onload = async (evt) => {
            const bstr = evt.target.result;
            const wb = XLSX.read(bstr, { type: 'binary' });
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            const data = XLSX.utils.sheet_to_json(ws);
            console.log("Data>>>", data);
            setstakeList(data)
        }
        reader.readAsBinaryString(reading);
    }

    console.log("stakeList", stakeList);

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
            // sortable: true,
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
                <div>{address_showing(rec.walletAddress)}</div>
        },
        {
            // key: "NFTId",
            text: "Starting Date",
            className: "NFT",
            align: "left",
            cell: rec =>
                <div>{new Date(rec.startDate).toDateString()}</div>
        },
        {
            key: "Season",
            text: "Season",
            className: "NFT",
            align: "left"
        },
        {
            key: "poolId",
            text: "Pool Id",
            className: "NFT",
            align: "left"
        },
        {
            // key: "Address",
            text: "No of days",
            className: "NFT",
            align: "left",
            cell: ((rec) => {

                var timeDifference = new Date() - new Date(rec.startDate)
                var daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
                console.log("daysDifference", daysDifference);
                return (
                    <div>{daysDifference}</div>
                )

            })

        },
        {
            key: "amount",
            text: "Amount",
            className: "NFT",
            align: "left"
        },
    ]

    const configdata = {
        page_size: 10,
        length_menu: [10, 20, 50],
        filename: "Users",
        no_data_text: 'No user found!',

        language: {
            length_menu: "Show _MENU_ result per page",
            filter: "Filter in records...",
            info: "Showing _START_ to _END_ of _TOTAL_ records",
            pagination: {
                first: <i class="fa-solid fa-angles-left" />,
                previous: <i class="fa-solid fa-angle-left" />,
                next: <i class="fa-solid fa-chevron-right" />,
                last: <i class="fa-solid fa-angles-right" />
            }
        },
        show_length_menu: true,
        show_filter: true,
        show_pagination: true,
        show_info: false,
        defaultSortAsc: false,
    };

    const onSubmit = async () => {
        if (stakeList?.length == 0 || stakeList?.length == undefined) return toast.error("Please upload valid file.");
        const id = toast.loading("Reward uploading");
        const sendData = { rewardArr: JSON.stringify(stakeList), xlFile, action: "rewardDistribution", projectId: state?.projectId ?? "", Season: state?.Season, year: state?.year };
        const setData = await stakingFunctions(sendData);
        console.log("setData", setData, sendData);
        toast.update(id, { type: setData?.success, render: setData?.msg, isLoading: false, closeButton: true })
        setTimeout(() => {
            window.location.reload()
        }, 1000)
    }

    const getItem = LSgetItem("adminType")


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
                                {(getItem == "Super admin" || getItem == "Admin") && (UserAccountAddr.toLowerCase() ==
                                    config.AdminAddress.toLowerCase()) && <div class="upload-btn-wrapper ml-3 mb-3">
                                        <button class="btn">Upload files</button>
                                        <input
                                            type="file"
                                            name="myfile"
                                            accept=".xlsx, .xls"
                                            multiple={true}
                                            onChange={onChangeFile}
                                            className=""
                                        />
                                    </div>}

                                <h4 className="card-title">Stacked Rewards</h4>
                                <h4 className="card-title">{state?.projectTitle} ({state?.Season}) </h4>

                                <div className="table-responsive">

                                    <ReactDatatable
                                        config={configdata}
                                        records={stakeList}
                                        columns={columns}
                                    />

                                    {UserAccountAddr.toLowerCase() ==
                                        config.AdminAddress.toLowerCase() && <button className='btn mb-2 allbtn' type='button' onClick={() => onSubmit()} >SUBMIT</button>}

                                </div>

                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </>

    )

}
