import React, { Component, useState, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import ReactDatatable from '@ashvin27/react-datatable';
import "react-toastify/dist/ReactToastify.css";
import { Link } from 'react-router-dom';
import { collectionFunctions, createProject, getKycList } from '../../axioscalls/admin';
import config from '../../lib/config'
import { useSelector } from 'react-redux';
import { address_showing, isEmpty } from '../../lib/common';
import Modal from "react-modal";
import { toast } from 'react-toastify'
import Select from 'react-select'

import { Button, Form } from "react-bootstrap";
// import {TokenDetail} from '';

export default function StakeProjects(props) {

    const notStake = ["mintReport", "marketPlaceReport", "royaltyReport"]

    var location = useLocation();
    const { pathname, state } = location;
    const path = pathname.split("/")[1]
    console.log("pathname,stae", pathname, state, path)

    const history = useHistory()

    const { UserAccountAddr, } = useSelector((state) => state.wallet_detail)

    const [Error, setError] = useState({})
    const [selected, setselected] = useState({})
    const [projectArr, setProjectArr] = useState([])
    const [options, setOptions] = useState([
        { label: "Season 1", value: "Season 1", },
        { label: "Season 2", value: "Season 2", },
        { label: "Season 3", value: "Season 3", },
        { label: "Season 4", value: "Season 4", }
    ])

    useEffect(() => {
        createProject({ action: "getProjects" })
            .then((val) => {
                setProjectArr(val.data ?? [])
            })
            .catch((e) => {
                console.log(" erro on getProjects", e);
            })
    }, [])

    const handleSubmit = async () => {
        var error = {}
        if (isEmpty(selected?.Season) && !notStake.includes(path)) error.Season = "Select Season";
        if (isEmpty(selected?.projectId)) error.projectId = "Select Project";
        if (!isEmpty(error)) return setError(error)

        history.push(
            path == "stackProjects" ? "/StakingDetails" :
                path == "rewardProjects" ? "/StakingReward" :
                    path == "mintReport" ? "/mintList" :
                        path == "marketPlaceReport" ? "/activityList" :
                            path == "royaltyReport" ? "/royaltyList" :
                                "/rewardHistory",
            selected
        )
    }


    const stylesgraybg = {
        option: (styles, { isFocused, isSelected, isHovered }) => ({
            ...styles,
            color: "#6C6A81",
            background: isFocused
                ? "#F5F6F7"
                : isSelected
                    ? "#F5F6F7"
                    : isHovered
                        ? "red"
                        : "#F5F6F7",

            zIndex: 1,
            cursor: "pointer",
            fontSize: "13px",
        }),
        // header start
        valueContainer: (provided, state) => ({
            ...provided,
            height: "40px",
            padding: "0 20px",
            backgroundColor: "#2A3038",
            borderRadius: 5,
            fontSize: "13px",
            color: "#fff",
        }),
        control: (provided, state) => ({
            ...provided,
            height: "40px",
            borderRadius: 5,
            backgroundColor: "#2A3038",
            border: "none",
            outline: "none",
            boxShadow: "none",
            fontSize: "13px",
            color: "#fff",
        }),
        //header end
        indicatorsContainer: (provided, state) => ({
            ...provided,
            height: "40px",
            position: "absolute",
            right: 0,
            top: 0,
            color: "#6C6A81",
        }),
        //header color
        singleValue: (provided, state) => ({
            ...provided,
            color: "white",
        }),

        // menu list start
        menuList: (base) => ({
            ...base,
            //   padding: 0,
            backgroundColor: "#2A3038",
        }),
        //menu options
        option: (styles, { isFocused, isSelected, isHovered }) => {
            return {
                ...styles,
                backgroundColor: isHovered
                    ? "#16EBC3"
                    : isSelected
                        ? "#16EBC3"
                        : isFocused
                            ? "#16EBC3"
                            : "#2A3038",
                cursor: "pointer",
                color: isHovered
                    ? "#000"
                    : isSelected
                        ? "#000"
                        : isFocused
                            ? "#000"
                            : "#fff",
                fontSize: "13px",
            };
        },
        // option: (base) => ({
        //   ...base,
        //   ":active": {
        //     backgroundColor: "#16EBC3",
        //   },
        // }),
    };
    console.log("projectArr", projectArr);
    console.log("selected", selected);


    return (
        <>
            <div>
                <div className="page-header">
                    <nav aria-label="breadcrumb">
                        {path == "mintReport" ? "Collection Minting Report" :
                            path == "marketPlaceReport" ? "Marketplace Activity Report" :
                                path == "royaltyReport" ? "Marketplace Royalty Report" :
                                    "Staked Projects"}
                    </nav>
                </div>
                <div className="row">

                    <div className="col-lg-12 grid-margin stretch-card">
                        <div className="card">
                            <div className="card-body">
                                {/* <h4 className="card-title">Kyc List</h4> */}
                                <form className="forms-sample">
                                    <Form.Group>
                                        <label htmlFor="exampleInputName1">Select Project</label>
                                        <Select
                                            styles={stylesgraybg}
                                            options={projectArr}
                                            // value={{ value: formData.blog_category, label: formData.blog_category }}
                                            onChange={(e) => { setError({}); setselected({ ...selected, projectId: e._id, projectTitle: e.value }) }}
                                        />
                                        <p className='mt-2' style={{ color: "red" }} >{Error?.projectId}</p>

                                    </Form.Group>

                                    {!notStake.includes(path) && <Form.Group>
                                        <label htmlFor="exampleInputName1">Select Season</label>
                                        <Select
                                            styles={stylesgraybg}
                                            options={options}
                                            onChange={(e) => { setError({}); setselected({ ...selected, Season: e.value }) }}
                                        />
                                        <p className='mt-2' style={{ color: "red" }} >{Error?.Season}</p>

                                    </Form.Group>}

                                </form>
                                <button className='btn allbtn' type='button' onClick={() => handleSubmit()}>SUBMIT</button>

                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>

    )

}
