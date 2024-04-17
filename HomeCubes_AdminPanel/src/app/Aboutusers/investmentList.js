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

export default function InvestmentList(props) {



    var location = useLocation();
    const { pathname, state } = location;
    const path = pathname.split("/")[1]
    console.log("pathnamesstae", pathname, state, path)

    // const { Categorys, UserAccountAddr, web3, web3p } = useSelector((state) => state.wallet_detail)


    const [tokenList, setTokenList] = useState([])
    const [projects, setProjects] = useState({});
    console.log("projects",projects)
    const { projectId } = useParams()


    useEffect(() => {
        getPrijects()
    }, [])

    const getPrijects = async () => {
        const resp = await addaboutuser({ action: "getOne", projectId: projectId });
        console.log("resprespresp", resp);
        setTokenList(resp?.data?.investment ?? [])
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
            // key: "investmentContent",
            text: "investmentContent",
            className: "NFT",
            align: "left",
            cell: rec => <div dangerouslySetInnerHTML={{ __html: rec}} />
        },
        // {
        //     text: "Gallery List",
        //     cell: record =>
        //         <div>
        //             <Link to={{ pathname: "/GalleryList", state: { record } }}  >
        //                 {/* // <Link to="/GalleryList" state={{ route: "sefseoifoeifhsoeif" }} > */}
        //                 <button className='btn mb-2 allbtn' type='button'>Galleries</button>
        //             </Link>
        //         </div>//checked={true}

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
                                <h4 className="card-title">Investment List</h4>
                               <Link to={{ pathname: "/investmentadd", state: projects }}  >
                                    <button className='btn mb-3 allbtn' type='button'>Add Investment</button>
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
