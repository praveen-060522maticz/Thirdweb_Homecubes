import React, { Component, useState, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import ReactDatatable from '@ashvin27/react-datatable';
import "react-toastify/dist/ReactToastify.css";
import { Link } from 'react-router-dom';
import { collectionFunctions, createProject, getKycList, getReportsFunc, stakingFunctions } from '../../axioscalls/admin';
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

export default function ActivityReport(props) {

    var location = useLocation();
    const { pathname, state } = location;
    const path = pathname.split("/")[1]
    console.log("pathname,stae", pathname, state, path)

    const { UserAccountAddr, } = useSelector((state) => state.wallet_detail)
    const [arrData, setArrData] = useState([])
    const [stakeList, setstakeList] = useState([]);



    useEffect(() => {
        getGalleryData()
    }, [])

    const getGalleryData = async () => {
        try {
            var resp = await getReportsFunc({ action: "activityReport", ...state });
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
            // key: "To",
            text: "Wallet Address",
            className: "NFT",
            align: "left",
            cell: rec =>
                <div>{address_showing(rec.To)}</div>
        },
        {
            key: "Activity",
            text: "Type",
            className: "NFT",
            align: "left"
        },
        // {
        //     // key: "NFTId",
        //     text: "Last reward date",
        //     className: "NFT",
        //     align: "left",
        //     cell: rec =>
        //         <div>{rec.lastRewardDay ? new Date(rec.lastRewardDay).toLocaleDateString() : ""}</div>
        // },
        {
            key: "NFTPrice",
            text: "NFT Price",
            className: "NFT",
            align: "left",
        },
        {
            text: "Created At",
            className: "NFT",
            align: "left",
            cell: rec =>
                <div>{rec.createdAt ? new Date(rec.createdAt).toLocaleString() : ""}</div>
        },
        {
            key: "NFTId",
            text: "NFTId",
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
                                <h4 className="card-title">Marketplace Activty Report</h4>
                                {/* <h4 className="card-title">{state?.projectTitle} ({state?.Season}) </h4> */}
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
