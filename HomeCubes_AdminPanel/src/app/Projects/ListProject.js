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
  console.log("pathname,stae", pathname, state, path);

  const { Categorys, UserAccountAddr, web3, web3p } = useSelector(
    (state) => state.wallet_detail
  );

  const [projects, setProjects] = useState("");

  useEffect(() => {
    getPrijects();
  }, []);

  const getPrijects = async () => {
    const resp = await createProject({ action: "get" });
    setProjects(resp?.data ?? []);
  };

  console.log("projects", projects);

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
      key: "projectTitle",
      text: "Project Title",
      className: "NFT",
      align: "left",
    },
    {
      key: "maxNFTs",
      text: "Max NFTs",
      className: "NFT",
      align: "left",
    },
    {
      key: "projectDescription",
      text: "Project Description",
      className: "NFT",
      align: "left",
      // cell: rec =>            //     <div title={rec.NFTOwner}>{rec?.NFTOwner ? rec?.NFTOwner.toString().slice(0, 2) + '...' + rec?.NFTOwner.toString().slice(-2) : ""}</div>
    },
    {
      key: "contractAddress",
      text: "Contract Address",
      className: "NFT",
      align: "left",
    },
    // {
    //   key: "aboutDescription",
    //   text: "About Description",
    //   className: "NFT",
    //   align: "left",
    // },
    {
      key: "",
      text: "Gallery List",
      cell: (record) => (
        <div>
          <Link to={{ pathname: "/GalleryList", state: { record } }}>
            {/* // <Link to="/GalleryList" state={{ route: "sefseoifoeifhsoeif" }} > */}
            <button className="btn mb-2 allbtn" type="button">
              Galleries
            </button>
          </Link>
        </div>
      ), //checked={true}
    },
    ,
    {
      key: "",
      text: "Steps",
      cell: (record) => (
        <div>
          <Link to={{ pathname: `/stepList/${record?._id}` }}>
            {/* // <Link to="/GalleryList" state={{ route: "sefseoifoeifhsoeif" }} > */}
            <button className="btn mb-2 allbtn" type="button">
              Steps
            </button>
          </Link>
        </div>
      ), //checked={true}
    },
    // {
    //   key: "",
    //   text: "NFTS",
    //   className: "nft_custom_th",
    //   cell: (record) => {
    //     return (
    //       <div>
    //         <Link to={{ pathname: "/nftlist", state: { record } }}>
    //           <button className="btn mb-2 allbtn" type="button">
    //             NFT List
    //           </button>
    //         </Link>
    //       </div>
    //     );
    //   },
    // },
    {
      key: "",
      text: "CMS",
      className: "nft_custom_th",
      cell: (record) => {
        return (
          <div>
            <Link to={{ pathname: "/ProjectCmsList", state: { record } }}>
              <button className="btn mb-2 allbtn" type="button">
                CMS List
              </button>
            </Link>
          </div>
        );
      },
    },
    {
      key: "",
      text: "View",
      cell: (record) => {
        return (
          <div>
            <Link to={{ pathname: "/projectView", state: record }}>
              <img
                className="img-xs rounded-circle"
                src={require("../../assets/images/eye.svg")}
                alt="profile"
              />
            </Link>
          </div>
        );
      },
    },
    {
      key: "",
      text: "Edit",
      cell: (record) => {
        return (
          <div>
            <Link to={{ pathname: "/projectEdit", state: record }}>
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
                    <Link to="/projectAdd">
                      <button className="btn mb-3 allbtn" type="button">
                        Add Project
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
