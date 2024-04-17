import React, { Component, useState, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import ReactDatatable from '@ashvin27/react-datatable';
import "react-toastify/dist/ReactToastify.css";
import { Link } from 'react-router-dom';
import { createProject, newsAndFeedFunc } from '../../axioscalls/admin';
import { useSelector } from 'react-redux';
import config from '../../lib/config'
import { toast } from 'react-toastify'
// import {TokenDetail} from '';

export default function ProjectList(props) {



    var location = useLocation();
    const { pathname, state } = location;
    const path = pathname.split("/")[1]
    console.log("pathname,stae", pathname, state, path)

    const { Categorys, UserAccountAddr, web3, web3p } = useSelector((state) => state.wallet_detail)


    const [tokenList, setTokenList] = useState([]);
    const [projects, setProjects] = useState("");


    useEffect(() => {
        getPrijects()
    }, [])

    const getPrijects = async () => {
        const resp = await newsAndFeedFunc({ action: "get", projectId: state?.record?._id });
        setProjects(resp?.data ?? [])
    }

    console.log("projects", projects);

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
            key: "feedTitle",
            text: "Feed Title",
            className: "NFT",
            align: "left",
        },
        {
            key: "feedDescription",
            text: "Feed Description",
            className: "NFT",
            align: "left",
        },
        {
            text: "Created At",
            className: "NFT",
            align: "left",
            cell: record =>
                <div>
                    {new Date(record?.createdAt).toLocaleDateString()}
                </div>
        },
        {
            text: "Edit",
            cell: record =>
                <div>
                    <Link to={{ pathname: "/feedsEdit", state: record }}  >
                        <button className='btn mb-2 allbtn' type='button'>Edit</button>
                    </Link>
                </div>
        },
        {
            text: "Hide/Show",
            // sortable: true,
            cell: record =>
                <div onClick={() => onDelete(record)} >

                    <img
                        className="img-xs rounded-circle"
                        src={!record.deleted ?
                            require("../../assets/images/eye.svg") :
                            require("../../assets/images/eye-crossed.png")}
                        alt="profile"
                    />
                </div>

        },

    ]

    const onDelete = async (rec) => {
        const resp = await newsAndFeedFunc({ action: "delete", deleted: !rec?.deleted, _id: rec._id });
        toast.success(!rec.deleted ? "hide successfully" : "Showed successfully")
        setTimeout(() => {
            getPrijects()
        }, 1000)
    }
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
                                <h4 className="card-title">News and feed List</h4>
                                {(UserAccountAddr.toLowerCase() == config.AdminAddress.toLowerCase()) && <Link to={{ pathname: "/feedsAdd", state: state?.record }} >
                                    <button className='btn mb-3 allbtn' type='button'>Add Feed or list</button>
                                </Link>}
                                <div className="table-responsive">
                                    <ReactDatatable

                                        records={projects}
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
