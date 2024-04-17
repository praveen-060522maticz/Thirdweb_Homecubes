import React, { Component, useState, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import ReactDatatable from '@ashvin27/react-datatable';
import "react-toastify/dist/ReactToastify.css";
import { Link } from 'react-router-dom';
import { collectionFunctions, createProject } from '../../axioscalls/admin';
import config from '../../lib/config'
import { useSelector } from 'react-redux';
// import {TokenDetail} from '';

export default function InvestmentList(props) {



    var location = useLocation();
    const { pathname, state } = location;
    const path = pathname.split("/")[1]
    console.log("pathname,stae", pathname, state, path)

    // const { UserAccountAddr, } = useSelector((state) => state.wallet_detail)

    const [tokenList, setTokenList] = useState([])
    const [projects, setProjects] = useState("");


    useEffect(() => {
        getInvestData()
    }, [])

    const getInvestData = async () => {
        try {
            var resp = await collectionFunctions({ action: "get", projectId: state?.record?._id });
            console.log("respresp", resp);
            setProjects(resp.data ?? [])
        } catch (error) {
            console.log("nerr on getGalleryData", error);
        }
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
            key: "InvestmentContent",
            text: "Investment content",
            className: "NFT",
            align: "left",
        },

        {
            text: "Investment List",
            cell: record =>
                <div>
                    <Link to={{ pathname: "/InvestmentEdit", state: { record } }}  >
                        <button className='btn mb-2 allbtn' type='button'>Edit Investment</button>
                    </Link>
                </div>

        }
        // ,
        // {
        //     text: "NFTS",
        //     cell: record => {
        //         return (
        //             <div>
        //                 <Link to={{ pathname: "/nftlist", state: { record } }}  >
        //                     <button className='btn mb-2 allbtn' type='button'>NFT List</button>
        //                 </Link>
        //             </div>
        //         )
        //     }
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
                                <Link to={{ pathname: "/addinvestment", state: { projectId: state?.record?._id } }}>
                                    <button className='btn mb-3 allbtn' type='button'>Add Investment</button>
                                </Link>
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


