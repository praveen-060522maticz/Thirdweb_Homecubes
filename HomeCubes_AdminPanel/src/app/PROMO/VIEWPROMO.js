import React, { useState, useEffect } from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";

import ReactDatatable from "@ashvin27/react-datatable";
import { useSelector } from "react-redux";
import config from "../../lib/config.js";
import { generate, getDroppromoList, GetUsersData, SendMails } from "../../axioscalls/user.js";
import { Button } from "react-bootstrap";
import Modal from 'react-modal';
import * as FileSaver from "file-saver";
import Select from 'react-select'
import * as ExcelJS from "exceljs";
import {toast} from 'react-toastify'

export default function VIEWPROMO(props) {
  var location = useLocation();
  const { pathname, state } = location;
  const path = pathname.split("/")[1];
  const [nftList, setNftList] = useState({});
  const [Btn, SetBtn] = useState(false);
  const [Users, setUsers] = useState([]);
  const [Email, SetEmail] = useState('');
  const [clickList, setclickList] = useState({});
  
  const { CollectionUrl, TokenId } = useParams();
  const { push } = useHistory();

  const customStyles = {
    control: () => ({
      backgroundColor: "transparent",
      display: "flex",
    }),
  };

  const Generate = async (data) => {
    var resp = await generate({
      CollectionUrl: CollectionUrl,
      TokenId: nftList.record.TokenId,
      _id: data._id,
      CollectionName: nftList.CollectionName,
      CollectionNetwork: nftList.CollectionNetwork,
      CollectionUrl: CollectionUrl,
      Creator: nftList.Creator,
    });
    if (resp?.success == "success") {
      toast.success("Code Generated Successfully")
      push("/promo/" + CollectionUrl);
    }
    else {
      toast.success("Oops...Try Agian")

    }
  };
  
  const SendMail = async (data) => {
    console.log("dasdahsdhkjas",nftList)
    var resp = await SendMails({
     EmailId : Email,
     QrCode   : clickList.QrCode,
     promo   : clickList.Code,
     link    : `${config.Front_market_Url}/info/drop/${nftList.CollectionNetwork}/${CollectionUrl}/${nftList?.record?.TokenOwner}/${nftList?.record?.TokenId}/0`,
    
    });
    if (resp?.success == "success") {
     SetBtn(false)
     toast.success("Mail Send Successfully")
    }
    else toast.error("Can't Send Mail")
  };
  const handleOnArrExport = () => {
     var my_data = nftList?.record?.promo.filter(
      (item) => item.Status != "buywithpromo"
    );
    var final_data = my_data.map((item) => {
      return {
        QrCode: item.QrCode,
        TokenName: nftList?.record?.TokenName,
        updatedAt: item.updatedAt,
        Code: item.Code,
        Link    : `${config.Front_market_Url}/info/drop/${nftList.CollectionNetwork}/${CollectionUrl}/${nftList?.record?.TokenOwner}/${nftList?.record?.TokenId}/0`,
      };
    });
   
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "Me";
    workbook.lastModifiedBy = "Her";
    workbook.created = new Date();
    workbook.modified = new Date();
    workbook.lastPrinted = new Date();
    workbook.views = [
      {
        x: 0,
        y: 0,
        width: 10000,
        height: 20000,
        firstSheet: 0,
        activeTab: 1,
        visibility: "visible",
      },
    ];
    const worksheet = workbook.addWorksheet("My Sheet");
    worksheet.properties.defaultRowHeight = 200;
    worksheet.columns = [
      { header: "SNo", key: "sno", width: 10, outlineLevel: 1 },
      { header: "Token Name", key: "TokenName", width: 50, outlineLevel: 1 },
      { header: "Promo Code", key: "Code", width: 50, outlineLevel: 1 },
      { header: "Link", key: "Link", width: 50, outlineLevel: 1 },
      { header: "QRCode", key: "QrCode", width: 50, outlineLevel: 1 },
    ];
    console.log("final_data", final_data);
    final_data.map((item, index, entries) => {
      const imageId2 = workbook.addImage({
        base64: item.QrCode,
        extension: "png",
      });
      worksheet.addImage(imageId2, {
        tl: { col: 4, row: index + 1 },
        ext: { width: 200, height: 200 },
      });

      worksheet.addRow({ sno: index + 1, TokenName: item.TokenName , Code : item.Code,Link:item.Link});
    });
    // Write to file
    workbook.xlsx.writeBuffer().then((buffer) => {
      // Do this to use base64 encoding
      FileSaver.saveAs(
        new Blob([buffer], { type: "application/octet-stream" }),
        `${CollectionUrl}.xlsx`
      );
    });
  };

  const OpenPopup = (data) => {
    SetBtn(true);
    setclickList(data)
  };

  const columns = [
    {
      key: "",
      text: "SNO",
      className: "NFT",
      align: "left",
      sortable: true,
      cell: (record, index) => <div>{index + 1}</div>,
    },
    {
      key: "TokenName",
      text: "TokenName",
      className: "NFT",
      align: "left",
      sortable: true,
      cell: (rec) => <>{nftList?.record?.TokenName}</>,
    },
    {
      key: "Code",
      text: "promo Code",
      className: "NFT",
      align: "left",
      sortable: true
    },
    {
      key: "QrCode",
      text: "QrCode",
      className: "NFT",
      align: "left",
      sortable: true,
      cell: (rec) => (
        <img
          style={{ borderRadius: "0", height: 200, width: 200 }}
          src={rec.QrCode}
        />
      ),
    },
   

    {
      key: "updatedAt",
      text: "Last Modified",
      className: "NFT PRICE",
      align: "left",
      sortable: true,
      cell: (rec) => (
        <>{`${new Date(rec.updatedAt).getDate()} / ${new Date(
          rec.updatedAt
        ).getMonth()} / ${new Date(rec.updatedAt).getFullYear()}  ${new Date(
          rec.updatedAt
        ).getHours()} : ${new Date(rec.updatedAt).getMinutes()}: ${new Date(
          rec.updatedAt
        ).getSeconds()}  ${new Date(rec.updatedAt).getDay()}`}</>
      ),
    },
    {
      key: "",
      text: "Re-Generate",
      className: "NFT PRICE",
      align: "left",
      sortable: true,
      cell: (record) => (
        <div>
          <button onClick={() => Generate(record)}>Generate</button>
        </div>
      ),
    },
    {
      key: "",
      text: "Send",
      className: "NFT PRICE",
      align: "left",
      sortable: true,
      cell: (record) => (
        <div>
          <button onClick={() => OpenPopup(record)}>Send Promo To Mail</button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    GetUsers()
    if (state) setNftList(state);
  }, [state,Email]);

  const GetUsers = async() => {
    var yes = await GetUsersData()
    setUsers(yes.msg)
  }

  return (
    <>
      {
        <div>
          <div className="page-header">
            <nav aria-label="breadcrumb"></nav>
          </div>
          <div className="row">
            <div className="col-lg-12 grid-margin stretch-card">
              <div className="card">
                <div className="card-body">
                  <h4 className="card-title">{nftList?.record?.TokenName}</h4>
                  <Button onClick={handleOnArrExport}> Export AS Excel</Button>
                  <div className="table-responsive">
                    <ReactDatatable
                      records={nftList?.record?.promo.filter(
                        (item) => item.Status != "buywithpromo"
                      )}
                      columns={columns}
                      // options={{ excel: true, print: true, csv: true }}
                    />
                  </div>
                </div>
              </div>
               {Btn && (
        <Modal
          isOpen={true}
          style={{
            content: {
              top: "50%",
              left: "50%",
              right: "auto",
              bottom: "auto",
              marginRight: "-50%",
              transform: "translate(-50%, -50%)",
            },
          }}
          contentLabel="Example Modal"
        >
          <div className="steps_to_follow">
            <div className="title_close">
              <h2>Send Code To Mail</h2>
              <button onClick={() => SetBtn(false)}>x</button>
            </div>
            <h3>Choose Mail to Send</h3>
            <Select             
                      options={Users.filter(item=>(item.value))}
                      classNamePrefix="react-select"
                      styles={customStyles}
                      isSearchable={false}
                      onChange={(e)=>SetEmail(e.value)}
                      placeholder="Choose mail"
                    />
          </div>
          <button onClick = {SendMail}>Send</button>
        </Modal>
      )}
            </div>
          </div>
        </div>
      }
    </>
  );
}
