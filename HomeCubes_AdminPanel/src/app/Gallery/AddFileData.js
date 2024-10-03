import React, { Component, useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { isEmpty } from '../../lib/common.js';
import { collectionFunctions } from '../../axioscalls/admin.js';
import config from '../../lib/config.js';
import { useLocation, useHistory } from 'react-router-dom';
import bsCustomFileInput from 'bs-custom-file-input';
import { toast } from 'react-toastify';

const AddFileData = () => {

    const History = useHistory();
    var location = useLocation();
    var pathname = location.pathname;
    var path = pathname.split("/")[1]
    console.log("pathnameAddFileData", path, location.state)
    const [loading, setLoading] = useState(false)

    const [formData, setFormData] = useState(location.state?.record ?? {})
    const [Errors, setError] = useState({})

    console.log('fjfjfjfjjfjffjfjjfjffj---->', formData);
    useEffect(() => {
        bsCustomFileInput.init()

        if (path == "EditFileData") {
            setFormData({ ...formData, desc: location?.state?.desc || "", img: location?.state?.img || "" })
        }
    }, [location])


    console.log("formData", formData);

    const handleChange = (e) => {
        setError({})
        e.preventDefault();
        console.log("errrrr on 0", e.target);
        const { id, value, files } = e.target;
        let formdata = { ...formData, ...{ [id]: files ? files[0] : value } }
        setFormData(formdata)
        console.log("formdata", formData)
    }

    console.log("-------------->", formData?.galleryThumbImage && Object.values(formData?.galleryThumbImage));

    const validation = () => {
        var errors = {}
        if (!formData?.desc) errors.desc = "Image Title can't be empty";
        if (!formData?.img) errors.img = "Image can't be empty";

        return errors
    }

    const handleSubmit = async () => {

        const validate = validation();
        console.log("validate", validate);
        if (!isEmpty(validate)) return setError(validate);

        setLoading(true)
        console.log("formData", formData);

        var resp = await collectionFunctions({
            action: path == "EditFileData" ? "editImages" : "addImages",
            _id: location?.state?.galleryId || "",
            img: location?.state?.img || "",
            galleryImages: formData?.img,
            desc: formData?.desc
        });

        console.log("respresp", resp);
        if (resp?.success == "success") {
            toast.success(resp.msg)
            setTimeout(function () {
                History.push('/projectList');
            }, 2000);

        }
        else toast.error(resp.msg)
        setLoading(false)
    }

    return (
        <div>
            <div className="page-header">
                <button className='btn mt-2 allbtn' type='button' onClick={() => History.goBack()} >Back</button>

                {/* <h3 className="page-title"> ADD PROJECT </h3> */}

            </div>
            <div className="row">

                <div className="col-12 grid-margin stretch-card">
                    <div className="card">
                        <div className="card-body">

                            <form className="forms-sample">
                                <Form.Group>
                                    <label htmlFor="exampleInputName1">Image Title</label>
                                    <Form.Control type="text" className="form-control" id="desc" maxLength={30} value={formData?.desc} placeholder="Image title" onChange={(e) => handleChange(e)} />
                                    <p style={{ color: "red" }} >{Errors?.desc}</p>
                                </Form.Group>
                                <Form.Group>
                                    <label htmlFor="exampleInputName1">Image file</label>
                                    {/* <Form.Control type="file" className="form-control" id="galleryThumbImage" onChange={(e) => handleChange(e)} /> */}
                                    <div>
                                        <div class="upload-btn-wrapper">
                                            <button class="btn">Choose File</button>
                                            <input
                                                type="file"
                                                className="form-control"
                                                id="img"
                                                onChange={(e) => handleChange(e)}
                                            />
                                        </div>
                                    </div>
                                    <p style={{ color: "red" }} >{Errors?.img}</p>
                                    {
                                        formData && formData?.img ?
                                            typeof formData?.img == "string" ?
                                                <img src={`${config.ImG}/collection/${location?.state?.galleryId}/${formData.img}`} style={{ height: 100, width: 100 }} />
                                                :
                                                <img src={URL.createObjectURL(formData?.img)} style={{ height: 100, width: 100 }} /> :
                                            <></>
                                    }
                                </Form.Group>

                                {/* <button type="submit" className="btn btn-primary mr-2" onClick={()=>handleSubmit()}>Submit</button> */}
                            </form>
                            <button className='btn mt-2 allbtn' disabled={loading} type='button' onClick={() => handleSubmit()}>Submit</button>

                        </div>
                    </div>
                </div>

            </div>
        </div>
    )

}

export default AddFileData