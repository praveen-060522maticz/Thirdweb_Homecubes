import React, { Component, useState, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import ReactDatatable from '@ashvin27/react-datatable';
import "react-toastify/dist/ReactToastify.css";
import { Link } from 'react-router-dom';
import { createProject } from '../../axioscalls/admin';
import { useSelector } from 'react-redux';
import config from '../../lib/config'
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
        const resp = await createProject({ action: "get" });
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
            key: "projectTitle",
            text: "Project Title",
            className: "NFT",
            align: "left",
        },
        {
            text: "Feeds",
            cell: record =>
                <div>
                    <Link to={{ pathname: "/feeds", state: { record } }}  >
                        <button className='btn mb-2 allbtn' type='button'>Project Feeds</button>
                    </Link>
                </div>
        },
        // {
        //     text: "Gallery List",
        //     cell: record =>
        //         <div>
        //             <Link to={{ pathname: "/GalleryList", state: { record } }}  >
        //                 <button className='btn mb-2 allbtn' type='button'>Galleries</button>
        //             </Link>
        //         </div>
        // },

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
                                <h4 className="card-title">News and feed List</h4>
                                {/* {(UserAccountAddr.toLowerCase() == config.AdminAddress.toLowerCase()) && <Link to="/projectAdd">
                                    <button className='btn mb-3 allbtn' type='button'>Add Project</button>
                                </Link>} */}
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
