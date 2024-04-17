import React, { Component, useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import bsCustomFileInput from 'bs-custom-file-input';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useHistory, Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import ReactDatatable from '@ashvin27/react-datatable';
import config from '../../lib/config.js'
import { blogsFunction, createAdmin, getblogCategories, loginAdmin } from '../../axioscalls/admin.js';

toast.configure();


export function BlogCategoryList() {

    const history = useHistory();

    const { Categorys, UserAccountAddr, web3, web3p } = useSelector(
        (state) => state.wallet_detail
      );
    
    var location = useLocation();
    const { pathname, state } = location;
    const path = pathname.split("/")[1]
    console.log("pathname,stae", pathname, state, path)

    const [AdminList, setAdminList] = useState([]);

    useEffect(() => {
        bsCustomFileInput.init()

    }, [])



    const columns = [
        {
            key: "email",
            text: "Email",
            className: "NFT NAME",
            align: "center",
        },
        {
            key: "Type",
            text: "Type",
            className: "NFT NAME",
            align: "center",
        },
        {
            text: "Hide/Show",
            // className: "NFT IDT",
            align: "center",
            // sortable: true,
            cell: record =>
                <div onClick={() => onDelete(record)} >
                    <img
                        style={{ cursor: "pointer" }}
                        className="img-xs rounded-circle"
                        src={!record.deleted ?
                            require("../../assets/images/eye.svg") :
                            require("../../assets/images/eye-crossed.png")}
                        alt="profile"
                    />
                </div>

        }
    ]

    useEffect(() => {
        getAdmins()
    }, [])

    const getAdmins = async () => {
        const getData = await loginAdmin({ path: "getAll" });
        console.log("getData on getBlogCategoryFunc", getData);
        setAdminList(getData?.data ?? [])
    }

    const onDelete = async (rec) => {
        const setData = { action: "delete", _id: rec._id, deleted: !rec.deleted }
        const delData = await createAdmin(setData);
        console.log("sufguiefesf", delData);
        if (delData?.success == "success") {
            toast.success(!rec.deleted ? "hide successfully" : "Showed successfully")
            setTimeout(() => {
                getAdmins()
            }, 1000)
        }
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
                                <h4 className="card-title">Admin role list</h4>
                                {UserAccountAddr.toLowerCase() ==
                                    config.AdminAddress.toLowerCase() && <Link to="/addAdmin" >
                                        <button className='btn mb-3 allbtn' type='button'>Add admin</button>
                                    </Link>}
                                <div className='faq'>
                                    <ReactDatatable
                                        // className="tension"
                                        records={AdminList}
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

export default BlogCategoryList;
