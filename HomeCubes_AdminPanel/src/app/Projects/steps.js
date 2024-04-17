import React, { Component, useState, useEffect } from 'react';
import { useLocation, useHistory, useParams } from 'react-router-dom';
import ReactDatatable from '@ashvin27/react-datatable';
import "react-toastify/dist/ReactToastify.css";
import { Link } from 'react-router-dom';
import { createProject } from '../../axioscalls/admin';
import { useSelector } from 'react-redux';
import config from '../../lib/config'
import Lottie from "lottie-react";

// import {TokenDetail} from '';

export default function ProjectList(props) {



    var location = useLocation();
    const { pathname, state } = location;
    const path = pathname.split("/")[1]
    console.log("pathname,stae", pathname, state, path)

    const { Categorys, UserAccountAddr, web3, web3p } = useSelector((state) => state.wallet_detail)


    const [tokenList, setTokenList] = useState([])
    const [projects, setProjects] = useState({});
    const { projectId } = useParams()


    useEffect(() => {
        getProjects()
    }, [])

    const getProjects = async () => {
        const resp = await createProject({ action: "getOne", projectId: projectId });
        console.log("resprespresp", resp);
        setTokenList(resp?.data?.roadMap ?? [])
        setProjects(resp?.data)
    }

    console.log("projectsfawfafwa", projects);

    const onDelete = async (e) => {
        const sendData = { deleted: !e.deleted, action: "hideStep", step: e.step, projectId: projectId }
        console.log("sendData", sendData, e);
        const resp = await createProject(sendData);
        console.log("resprespresp", resp);
        if (resp?.success == "success") getProjects()
    }

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
            key: "stepTitle",
            text: "Step Title",
            className: "NFT",
            align: "left",
        },
        {
            key: "step",
            text: "Step",
            className: "NFT",
            align: "left",
        },
        {
            key: "stepDescription",
            text: "Step Descriptionl",
            className: "NFT",
            align: "left"
        },
        {
            text: "Image",
            className: "NFT",
            align: "left",
            cell: (record) => {
                return (
                    <div><img src={`${config.ImG}/projects/steps/${record.stepImage}`} style={{ height: 50, width: 50 }} /></div>
                )

            }
        },
        {
            text: "Edit",
            cell: (record) => {
                return (
                    <div>
                        <Link to={{ pathname: "/editSteps", state: { ...record, _id: projectId } }}>
                            <img
                                src={require("../../assets/images/pencil.svg")}
                                alt="profile"
                            />
                        </Link>
                    </div>
                );
            },
        },
        {
            text: "Hide/Show Step",
            cell: (record) => {
                return (
                    <div>
                        <button className='btn mb-2 allbtn' onClick={() => onDelete(record)} type='button'>{record.deleted ? "Show" : "Hide"}</button>
                    </div>
                );
            },
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
                                <h4 className="card-title">Projects List</h4>
                                {(UserAccountAddr.toLowerCase() == config.AdminAddress.toLowerCase()) && <Link to={{ pathname: "/addSteps", state: projects }}  >
                                    <button className='btn mb-3 allbtn' type='button'>Add Steps</button>
                                </Link>}
                                <div className="table-responsive">
                                    <ReactDatatable

                                        records={tokenList}
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
