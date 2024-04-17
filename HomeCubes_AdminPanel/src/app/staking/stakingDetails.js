import React, { Component, useState, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import ReactDatatable from '@ashvin27/react-datatable';
import "react-toastify/dist/ReactToastify.css";
import { Link } from 'react-router-dom';
import { collectionFunctions, createProject, getKycList, stakingFunctions } from '../../axioscalls/admin';
import config from '../../lib/config'
import { useSelector } from 'react-redux';
import { address_showing, calculateStakingDaysPassed, getDaysOfDesiredMonth } from '../../lib/common';
import Modal from "react-modal";
import { toast } from 'react-toastify'

import { Button, Form } from "react-bootstrap";
import Exportexcel from '../../components/tableButtonComp/Excelexport';
import Exportcsv from '../../components/tableButtonComp/Exportcsv';
import Exportpdf from '../../components/tableButtonComp/Exportpdf';
// import {TokenDetail} from '';

export default function StakingDetails(props) {

    var location = useLocation();
    const { pathname, state } = location;
    const path = pathname.split("/")[1]
    console.log("pathname,stae", pathname, state, path)

    const { UserAccountAddr, } = useSelector((state) => state.wallet_detail)
    const [arrData, setArrData] = useState([])
    const [stakeList, setstakeList] = useState("");



    useEffect(() => {
        getGalleryData()
    }, [])

    const getGalleryData = async () => {
        try {
            var resp = await stakingFunctions({ action: "getDetails", ...state });
            console.log("respresp", resp);
            setstakeList(resp?.data ?? []);
            setArrData(resp?.data ?? [])
        } catch (error) {
            console.log("nerr on getGalleryData", error);
        }
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
                <div>{address_showing(rec.walletAddress)}</div>
        },
        {
            // key: "NFTId",
            text: "Starting Date",
            className: "NFT",
            align: "left",
            cell: rec =>
                <div>{new Date(rec.startDate).toLocaleDateString()}</div>
        },
        {
            // key: "NFTId",
            text: "Last reward date",
            className: "NFT",
            align: "left",
            cell: rec =>
                <div>{rec.lastRewardDay ? new Date(rec.lastRewardDay).toLocaleDateString() : ""}</div>
        },
        {
            key: "lastReward",
            text: "Last reward",
            className: "NFT",
            align: "left",
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
            text: "No of days(Total staking days)",
            className: "NFT",
            align: "left",
            cell: ((rec) => {

                var timeDifference = new Date() - new Date(rec.startDate)
                var daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
                console.log("daysDifference", daysDifference);
                return (
                    <div>{daysDifference < 0 ? 0 : daysDifference}</div>
                )

            })

        },
        {
            // key: "Address",
            text: "No of days(In this season)",
            className: "NFT",
            align: "left",
            cell: ((rec) => {
                const poolDetail = getDaysOfDesiredMonth(state.Season);
                console.log("poolDetail", poolDetail, poolDetail.poolStartDate, poolDetail.dateFormat, rec.startDate, rec.endDate);
                const getStakedDate = calculateStakingDaysPassed(poolDetail.poolStartDate, poolDetail.dateFormat, rec.startDate, rec.endDate)
               console.log('getStakedDate---->',getStakedDate);
                return (
                    <div>{getStakedDate}</div>
                )

            })

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
        defaultSortAsc: true,
    };

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
                                <h4 className="card-title">Staking NFTs</h4>
                                <h4 className="card-title">{state?.projectTitle} ({state?.Season}) </h4>
                                <div className="table-responsive">
                                    {arrData.length != 0 && <Exportexcel excelData={arrData} fileName={`${state?.projectTitle} (${state?.Season})`} />}
                                    {arrData.length != 0 && <Exportpdf pdfData={arrData} fileName={`${state?.projectTitle} (${state?.Season})`} />}
                                    {/* {arrData.length != 0 && <Exportcsv csvData={arrData} fileName={`${state?.projectTitle} (${state?.Season})`} />} */}
                                    <ReactDatatable
                                        config={configdata}

                                        records={stakeList}
                                        columns={columns}
                                    />

                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>

    )

}
