import React, { Component, useState, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import ReactDatatable from '@ashvin27/react-datatable';
import "react-toastify/dist/ReactToastify.css";
import { Link } from 'react-router-dom';
import { collectionFunctions, createProject } from '../../axioscalls/admin';
import config from '../../lib/config'
import { useSelector } from 'react-redux';
import {toast} from "react-toastify";
// import {TokenDetail} from '';

export default function GalleryList(props) {



    var location = useLocation();
    const { pathname, state } = location;
    const path = pathname.split("/")[1]
    console.log("pathname,stae", pathname, state, path)

    const { UserAccountAddr, } = useSelector((state) => state.wallet_detail)

    const [tokenList, setTokenList] = useState([])
    const [projects, setProjects] = useState("");


    useEffect(() => {
        getGalleryData()
    }, [])

    const getGalleryData = async () => {
        try {
            var resp = await collectionFunctions({ action: "getAllCol", projectId: state?.record?._id });
            console.log("respradawdesp", resp);
            setProjects(resp.data ?? [])
        } catch (error) {
            console.log("nerr on getGalleryData", error);
        }
    }

    console.log("projects", projects);

    const deleteGallery = async (_id) => {
        try {
            console.log('deleteGallery---->',_id);
            var resp = await collectionFunctions({ action: "deleteGallery", _id });
            console.log("resprhdtrjtfyjtesp", resp);
            toast.success("Deleted successfully.")
            getGalleryData()
        } catch (e) {
            console.log("err on deleteGallery", e);
        }
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
            key: "galleryTitle",
            text: "Gallery Title",
            className: "NFT",
            align: "left",
        },
        {
            key: "galleryDescription",
            text: "Gallery Description",
            className: "NFT",
            align: "left"
        },
        {
            text: "Gallery Thumbnail",
            className: "NFT",
            align: "left",
            cell: rec =>
                <div><img src={`${config.ImG}/collection/${rec.projectId}/${rec.galleryThumbImage}`} style={{ height: 50, width: 50 }} /></div>
        },
        {
            text: "Edit",
            cell: record =>
                <div>
                    <Link to={{ pathname: "/GalleryEdit", state: { record } }}  >
                        <button className='btn mb-2 allbtn' type='button'>Edit</button>
                    </Link>
                </div>
        },
        {
            text: "Images",
            cell: record => {
                return (
                    <div>
                        <Link to={{ pathname: "/GalleryFiles", state: record }}  >
                            <button className='btn mb-2 allbtn' type='button'>Gallery files</button>
                        </Link>
                    </div>
                )
            }
        },
        {
            text: "Delete Gallery",
            cell: record => {
                return (
                    <div>
                        {/* <Link to={{ pathname: "/GalleryFiles", state: record }}  > */}
                        <button className='btn mb-2 allbtn' type='button' onClick={() => deleteGallery(record?._id)} >Delete</button>
                        {/* </Link> */}
                    </div>
                )
            }
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
                                <h4 className="card-title">Gallery List</h4>
                                {(UserAccountAddr.toLowerCase() == config.AdminAddress.toLowerCase()) && <Link to={{ pathname: "/GalleryAdd", state: { projectId: state?.record?._id } }}>
                                    <button className='btn mb-3 allbtn' type='button'>Add Gallery</button>
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


