import React, { Component, useState, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import ReactDatatable from "@ashvin27/react-datatable";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import { createProject } from "../../axioscalls/admin";
import { useSelector } from "react-redux";
import config from "../../lib/config";
// import {TokenDetail} from '';

export default function ProjectList(props) {
    var location = useLocation();
    const { pathname, state } = location;
    const path = pathname.split("/")[1];
    console.log("pathname,dhdrstae", pathname, state, path);

    const { Categorys, UserAccountAddr, web3, web3p } = useSelector(
        (state) => state.wallet_detail
    );

    const [projects, setProjects] = useState(state?.record?.CMS);


    const columns = [
        {
            key: "",
            text: "S No",
            className: "NFT",
            align: "left",
            sortable: true,
            cell: (record, index) => <div>{index + 1}</div>,
        },
        {
            key: "stepTitle",
            text: "Title",
            className: "NFT",
            align: "left",
        },
        {
            key: "stepDescription",
            text: "Description",
            className: "NFT",
            align: "left",
        },
        {
            key: "",
            text: "Edit",
            cell: (record) => {
                return (
                    <div>
                        <Link to={{ pathname: "/ProjectCmsEdit", state: { ...record, _id: state?.record?._id } }}>
                            <img
                                src={require("../../assets/images/pencil.svg")}
                                alt="profile"
                            />
                        </Link>
                    </div>
                );
            },
        },
    ];



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
        show_filter: false,
        show_pagination: true,
        show_info: false,
        defaultSortAsc: true,
    };

    return (
        <>
            <div>
                <div className="page-header">
                    <nav aria-label="breadcrumb"></nav>
                </div>
                <div className="row">
                    <div className="col-lg-12 grid-margin stretch-card">
                        <div className="card">
                            <div className="card-body">
                                <h4 className="card-title">Projects List</h4>
                                {UserAccountAddr.toLowerCase() ==
                                    config.AdminAddress.toLowerCase() && (
                                        <Link to={{ pathname: "/ProjectCmsAdd", state: state?.record }}>
                                            <button className="btn mb-3 allbtn" type="button">
                                                Add CMS
                                            </button>
                                        </Link>
                                    )}
                                <div className="table-responsive">
                                    <ReactDatatable
                                        records={projects}
                                        columns={columns}
                                        config={configdata}

                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
