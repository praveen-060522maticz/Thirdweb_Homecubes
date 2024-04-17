import React, { Component, useState, useEffect } from 'react';
import { useLocation, useHistory, useParams } from 'react-router-dom';
import ReactDatatable from '@ashvin27/react-datatable';
import "react-toastify/dist/ReactToastify.css";
import { Link } from 'react-router-dom';
import { createProject } from '../../axioscalls/admin';
import { useSelector } from 'react-redux';
import config from '../../lib/config'
import Lottie from "lottie-react";
import { addaboutuser } from '../../axioscalls/token';

// import {TokenDetail} from '';

export default function Aboutsteplist(props) {



    var location = useLocation();
    const { pathname, state } = location;
    const path = pathname.split("/")[1]
    console.log("pathnamesstae", pathname, state, path)

    // const { Categorys, UserAccountAddr, web3, web3p } = useSelector((state) => state.wallet_detail)


    const [tokenList, setTokenList] = useState([])
    const [projects, setProjects] = useState({});
    const { projectId } = useParams()


    useEffect(() => {
        getPrijects()
    }, [])

    const getPrijects = async () => {
        const resp = await addaboutuser({ action: "getOne", projectId: projectId });
        console.log("resprespresp", resp);
        setTokenList(resp?.data?.steps ?? [])
        setProjects(resp?.data)
    }

    console.log("projectsfawfafwa", projects);

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
            key: "stepContent",
            text: "Step content",
            className: "NFT",
            align: "left",
        },
        {
            text: "stepImage",
            className: "NFT",
            align: "left",
            cell: (record) => {
                return (
                    <div><img src={`${config.ImG}/aboutus/steps/${record.stepImage}`} style={{ height: 50, width: 50 }} /></div>
                )

            }

        },
        {
            text: "Edit",
            cell: (record) => {
                return (
                    <div>
                        <Link to={{ pathname: "/editaddsteps", state: { ...record, _id: projects._id } }}>
                            <img
                                src={require("../../assets/images/pencil.svg")}
                                alt="profile"
                            />
                        </Link>
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
                                <h4 className="card-title">AboutusStep List</h4>
                                <Link to={{ pathname: "/aboutaddsteps", state: projects }}  >
                                    <button className='btn mb-3 allbtn' type='button'>Add Steps</button>
                                </Link>
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
