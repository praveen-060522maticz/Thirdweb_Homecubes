// import React, { Component, useState, useEffect } from "react";
// import { useLocation, useHistory } from "react-router-dom";
// import ReactDatatable from "@ashvin27/react-datatable";
// import "react-toastify/dist/ReactToastify.css";
// import { Link } from "react-router-dom";
// import { collectionFunctions, createProject } from "../../axioscalls/admin";
// import config from "../../lib/config";
// import { useSelector } from "react-redux";
// import { toast } from "react-toastify";
// import Button from "react-bootstrap/Button";
// import Modal from "react-bootstrap/Modal";
// import { FaRegCirclePlay } from "react-icons/fa6";
// import img1 from "../../assets/images/faces/face1.jpg";
// import { videoFileFormats } from "../../lib/common";
// export default function Galleryimages() {
//   var location = useLocation();
//   const { pathname, state } = location;
//   const path = pathname.split("/")[1];
//   console.log("pathname,stae", pathname, state, path);

//   const { UserAccountAddr } = useSelector((state) => state.wallet_detail);

//   const [gallery, setGallery] = useState([]);
//   console.log("gallery", gallery);
//   useEffect(() => {
//     getGallery();
//   }, []);

//   const History = useHistory()

//   const getGallery = async () => {
//     const getData = await collectionFunctions({
//       action: "getOne",
//       _id: state?._id,
//     });
//     setGallery(getData?.data ?? {});
//   };

//   const onFilesChange = async (e) => {
//     try {
//       const { id, value, files } = e.target;
//       console.log("files", files);

//       if (files)
//         var filess =
//           files?.length == undefined ? [files] : Object.values(files);
//       if (filess.length != 0) {
//         console.log("akuwfaiuwf", filess);
//         var getSize = 0

//         filess.map((val) => {
//           getSize = getSize + (val.size / (1024 * 1024));
//         })
//         console.log("getSize", filess, getSize);

//         if (getSize > 30) return toast.error("Please upload smaller than 30 mb files.")

//         const id = toast.loading('Uploading')
//         var resp = await collectionFunctions({
//           action: "addImages",
//           _id: state?._id,
//           galleryImages: filess,
//         });
//         console.log("respresp", resp);
//         if (resp.success == "success") {
//           toast.update(id, { render: "Images uploaded", type: 'success', isLoading: false, autoClose: 1000, closeButton: true, closeOnClick: true })
//           await getGallery()
//           // setTimeout(() => {
//           //   window.location.reload();
//           // }, 1500);
//         } else {
//           toast.update(id, { render: "Images not uploaded", type: 'error', isLoading: false, autoClose: 1000, closeButton: true, closeOnClick: true })
//         }
//       }
//     } catch (error) {
//       console.log("err on onFilesChange", error);
//     }
//   };

//   const [show, setShow] = useState("");

//   const handleClose = () => { setShow(''); }
//   const handleShow = (e) => setShow(e);

//   const onDelete = async (imgName) => {
//     const resp = await collectionFunctions({
//       action: "deleteImage",
//       _id: state?._id,
//       ImageName: imgName,
//     });
//     await getGallery()

//   }

//   return (
//     <>
//       <div>
//         <div className="page-header">
//           <nav aria-label="breadcrumb"></nav>
//           <button
//             className="btn mt-2 allbtn"
//             type="button"
//             onClick={() => History.goBack()}
//           >
//             Back
//           </button>
//         </div>
//         <div className="row">
//           {UserAccountAddr.toLowerCase() ==
//             config.AdminAddress.toLowerCase() && (
//               <>
//                 {/* <input
//                 type="file"
//                 multiple={true}
//                 onChange={onFilesChange}
//                 className="pl-3 pb-4"
//               /> */}
//                 <div>
//                   <div class="upload-btn-wrapper ml-3 mb-3">
//                     <button class="btn">Upload files</button>
//                     <input
//                       type="file"
//                       name="myfile"
//                       multiple={true}
//                       onChange={onFilesChange}
//                       className=""
//                     />
//                   </div>
//                 </div>
//               </>
//             )}

//           <div className="col-lg-12 grid-margin stretch-card">
//             <div className="card">
//               <div className="card-body">
//                 <h4 className="card-title">Gallery files</h4>
//                 <div className="row gallery_img_sec">
//                   {gallery?.galleryImages?.length != 0 &&
//                     gallery?.galleryImages?.map((val) => (
//                       <div className="col-6 mb-3 mb-lg-4 col-sm-4 col-md-4 col-lg-4 col">
//                         <div className="cus-galleryimg-icon">
//                           <div className="delete" onClick={()=> onDelete(val)}>
//                           <i class="fa-solid fa-trash"></i>
//                           </div>
//                         <div className="galley_images" onClick={() => handleShow(val)}>
//                           {videoFileFormats.includes(val.split(".")[1]) ? (
//                             // <video
//                             //   width="150"
//                             //   height="150"
//                             //   // controls
//                             //   src={`${config.ImG}/collection/${gallery?._id}/${val}`}
//                             // />
//                             <>

//                               <div className="position-relative" style={{ cursor: "pointer" }}>
//                                 <div className="blur_thumbnailer">
//                                   <div className="playBtn_fitter">
//                                     {/* <i className="fa-regular fa-circle-play" /> */}
//                                     {/* <FaRegCirclePlay /> */}
//                                     <i class="fa-regular fa-circle-play"></i>
//                                   </div>
//                                 </div>
//                                 <video
//                                   width="150"
//                                   height="150"
//                                   // controls
//                                   src={`${config.ImG}/collection/${gallery?._id}/${val}`}
//                                 />

//                               </div>

//                             </>

//                           ) : (
//                             <img
//                               src={`${config.ImG}/collection/${gallery?._id}/${val}`}
//                             //   style={{ height: 100, width: 100 }}
//                             />
//                           )}
//                         </div>
//                         </div>
//                       </div>

//                     ))}


//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/*Modal */}

//       <div className="modal_popup">
//         <Modal
//           show={show != ""}
//           onHide={handleClose}
//           centered
//           size="md"
//           className="gallery_modal"
//         >
//           <Modal.Header closeButton>
//             <Modal.Title>Gallery</Modal.Title>
//           </Modal.Header>
//           <Modal.Body className="content_section">
//             {/* <div className="gallery_img">
//               <img
//                 src={img1}
//                 alt="gallery_preview"
//                 className="gallery_preview_img"
//               />
//             </div> */}
//             <div className="gallery_video">
//               {videoFileFormats.includes(show.split(".")[1]) ? (
//                 <video
//                   className="img-fluid"
//                   controls
//                   src={`${config.ImG}/collection/${gallery?._id}/${show}`}
//                 />
//               ) : (
//                 <img
//                   className="img-fluid"
//                   src={`${config.ImG}/collection/${gallery?._id}/${show}`}
//                 //   style={{ height: 100, width: 100 }}
//                 />
//               )}
//               {/* <iframe
//                 height="400"
//                 width="400"
//                 src="https://www.youtube.com/embed/il_t1WVLNxk"
//                 className="gallery_preview_video"
//               ></iframe> */}
//             </div>
//           </Modal.Body>
//           {/* <Modal.Footer>
//             <Button
//               variant="secondary"
//               onClick={handleClose}
//               className="close_btn allbtn"
//             >
//               Close
//             </Button>
//           </Modal.Footer> */}
//         </Modal>
//       </div>
//     </>
//   );
// }




import React, { Component, useState, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import ReactDatatable from "@ashvin27/react-datatable";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import { collectionFunctions, createProject } from "../../axioscalls/admin";
import config from "../../lib/config";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { FaRegCirclePlay } from "react-icons/fa6";
import img1 from "../../assets/images/faces/face1.jpg";
import { videoFileFormats } from "../../lib/common";
export default function Galleryimages() {
  var location = useLocation();
  const { pathname, state } = location;
  const path = pathname.split("/")[1];
  console.log("pathname,stae Galleryimages", pathname, state, path);

  const { UserAccountAddr } = useSelector((state) => state.wallet_detail);

  const [gallery, setGallery] = useState([]);
  console.log("gallery", gallery);
  useEffect(() => {
    getGallery();
  }, []);

  const History = useHistory()

  const getGallery = async () => {
    const getData = await collectionFunctions({
      action: "getOne",
      _id: state?._id,
    });
    setGallery(getData?.data ?? {});
  };

  const onFilesChange = async (e) => {
    try {
      const { id, value, files } = e.target;
      console.log("files", files);

      if (files)
        var filess =
          files?.length == undefined ? [files] : Object.values(files);
      if (filess.length != 0) {
        console.log("akuwfaiuwf", filess);
        var getSize = 0

        filess.map((val) => {
          getSize = getSize + (val.size / (1024 * 1024));
        })
        console.log("getSize", filess, getSize);

        if (getSize > 30) return toast.error("Please upload smaller than 30 mb files.")

        const id = toast.loading('Uploading')
        var resp = await collectionFunctions({
          action: "addImages",
          _id: state?._id,
          galleryImages: filess,
        });
        console.log("respresp", resp);
        if (resp.success == "success") {
          toast.update(id, { render: "Images uploaded", type: 'success', isLoading: false, autoClose: 1000, closeButton: true, closeOnClick: true })
          await getGallery()
          // setTimeout(() => {
          //   window.location.reload();
          // }, 1500);
        } else {
          toast.update(id, { render: "Images not uploaded", type: 'error', isLoading: false, autoClose: 1000, closeButton: true, closeOnClick: true })
        }
      }
    } catch (error) {
      console.log("err on onFilesChange", error);
    }
  };

  const [show, setShow] = useState("");

  const handleClose = () => { setShow(''); }
  const handleShow = (e) => setShow(e);

  const onDelete = async (imgName) => {
    const resp = await collectionFunctions({
      action: "deleteImage",
      _id: state?._id,
      ImageName: imgName,
    });
    await getGallery()

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
      key: "desc",
      text: "File Title",
      className: "NFT",
      align: "left",
    },
    {
      text: "File",
      className: "NFT",
      align: "left",
      cell: rec =>
        <div><img src={`${config.ImG}/collection/${gallery._id}/${rec.img}`} style={{ height: 50, width: 50 }} /></div>
    },
    {
      text: "Edit",
      cell: record =>
        <div>
          <Link to={{ pathname: "/EditFileData", state: { galleryId: state?._id, ...record } }}  >
            <button className='btn mb-2 allbtn' type='button'>Edit</button>
          </Link>
        </div>
    },
    {
      text: "Delete Gallery",
      cell: record => {
        return (
          <div>
            {/* <Link to={{ pathname: "/GalleryFiles", state: record }}  > */}
            <button className='btn mb-2 allbtn' type='button' onClick={() => onDelete(record?.img)} >Delete</button>
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
          <nav aria-label="breadcrumb"></nav>
          <button
            className="btn mt-2 allbtn"
            type="button"
            onClick={() => History.goBack()}
          >
            Back
          </button>
        </div>
        <div className="row">

          <div className="col-lg-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Gallery files</h4>

                {(UserAccountAddr.toLowerCase() == config.AdminAddress.toLowerCase()) && <Link to={{ pathname: "/AddFileData", state: { galleryId: state?._id } }}>
                  <button className='btn mb-3 allbtn' type='button'>Add Files</button>
                </Link>}

                {gallery?.galleryImages?.length != 0 &&
                  <div className="table-responsive">
                    <ReactDatatable
                      records={gallery?.galleryImages}
                      columns={columns}
                    />

                  </div>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/*Modal */}

      <div className="modal_popup">
        <Modal
          show={show != ""}
          onHide={handleClose}
          centered
          size="md"
          className="gallery_modal"
        >
          <Modal.Header closeButton>
            <Modal.Title>Gallery</Modal.Title>
          </Modal.Header>
          <Modal.Body className="content_section">
            {/* <div className="gallery_img">
              <img
                src={img1}
                alt="gallery_preview"
                className="gallery_preview_img"
              />
            </div> */}
            <div className="gallery_video">
              {videoFileFormats.includes(show.split(".")[1]) ? (
                <video
                  className="img-fluid"
                  controls
                  src={`${config.ImG}/collection/${gallery?._id}/${show}`}
                />
              ) : (
                <img
                  className="img-fluid"
                  src={`${config.ImG}/collection/${gallery?._id}/${show}`}
                //   style={{ height: 100, width: 100 }}
                />
              )}
              {/* <iframe
                height="400"
                width="400"
                src="https://www.youtube.com/embed/il_t1WVLNxk"
                className="gallery_preview_video"
              ></iframe> */}
            </div>
          </Modal.Body>
          {/* <Modal.Footer>
            <Button
              variant="secondary"
              onClick={handleClose}
              className="close_btn allbtn"
            >
              Close
            </Button>
          </Modal.Footer> */}
        </Modal>
      </div>
    </>
  );
}
