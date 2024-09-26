import React, { useEffect, useState } from 'react'
import { Modal, Row, Col, Form } from 'react-bootstrap'
import Select from "react-select";
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input/input'
import countryList from 'react-select-country-list'
import { useMemo } from 'react';
import { userRegister } from '../actions/axioss/user.axios';
import config from '../config/config'
import { toast } from 'react-toastify';
import { isEmpty } from '../actions/common';
import { getCmsContent } from '../actions/axioss/cms.axios';

function KYCActivate({ show, handleClose, userProfile, getProfileDetails }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [value, setValue] = useState()
  const options = useMemo(() => countryList().getData(), [])
  const [Profile, setUserProfile] = useState(userProfile);
  const [Error, setError] = useState({})
  const [loading, setLoading] = useState(false)
  const [description, setDescription] = useState(false);

  const desc = [
    {
      descText: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem"
    }
  ]

  const stylesgraybgOne = {
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

    option: (styles, { isFocused, isSelected, isHovered }) => {
      // const color = chroma(data.color);

      return {
        ...styles,
        backgroundColor: isHovered
          ? "#16EBC3"
          : isSelected
            ? "#16EBC3"
            : isFocused
              ? "#16EBC3"
              : "#151515",
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
    valueContainer: (provided, { isFocused, isSelected, isHovered }) => ({
      ...provided,
      height: "49px",
      width: "40px",
      backgroundColor: isHovered
        ? "transparent"
        : isSelected
          ? "transparent"
          : isFocused
            ? "transparent"
            : "transparent",
      border: "2px solid #16ebc3",
      borderRadius: 5,
      fontSize: "13px",
      color: "#fff",
    }),
    control: (provided, { isFocused, isSelected, isHovered }) => ({
      ...provided,
      height: "40px",
      width: "100%",
      borderRadius: 5,
      backgroundColor: isHovered
        ? "#1D1D1D4F"
        : isSelected
          ? "#1D1D1D4F"
          : isFocused
            ? "#1D1D1D4F"
            : "#1D1D1D4F",
      // backgroundColor: "#fff",
      border: "none",
      outline: "none",
      boxShadow: "none",
      color: "#16EBC3",
    }),
    indicatorsContainer: (provided, state) => ({
      ...provided,
      height: "40px",
      width: "40px",
      position: "absolute",
      right: 0,
      top: "5px",
      color: "#16EBC3",
    }),
    singleValue: (provided, state) => ({
      ...provided,
      color: "#fff",

    }),
    menuList: (base) => ({
      ...base,
      // kill the white space on first and last option
      padding: 0,
    }),
  };

  console.log("value", value);

  const handleChange = (e) => {
    setError({})
    e.preventDefault();
    console.log("errrrr on 0", e.target);
    const { id, value, files } = e.target;
    let formdata = { ...Profile, ...{ [id]: files ? files[0] : value } }
    setUserProfile(formdata)
    console.log("formdata", Profile)
  }

  console.log("Profileee", Profile);

  const validation = () => {
    const error = {}

    if (!config.EMAIL.test(Profile?.EmailId)) error.EmailId = "PLease Enter valid email address";
    if (!Profile?.EmailId) error.EmailId = "Enter email address";
    if (!Profile?.Address) error.Address = "Enter Address";
    if (!isValidPhoneNumber(Profile?.mobileNumber)) error.mobileNumber = "Enter valid mobile number";
    if (!Profile?.mobileNumber) error.mobileNumber = "Enter mobile number";
    if (!Profile?.Nationality) error.Nationality = "Enter Nationality";
    if (!Profile?.kycFile) error.kycFile = "Select kyc file";
    if (!Profile?.Name) error.kycFile = "Enter Name";
    if (!Profile?.SurName) error.kycFile = "Enter Sure Name";

    return error
  }

  const onSubmit = async () => {
    if (!Profile?.termsAccepted) return toast.error("Please accept terms and conditions")
    const validate = validation()
    if (!isEmpty(validate)) return setError(validate)
    const id = toast.loading("Kyc updating")
    setLoading(true)
    Profile.Type = "KYC"
    const Resp = await userRegister(Profile);
    console.log("RespRespResp", Resp);
    if (Resp?.success == "success") { toast.update(id, { render: Resp?.msg, isLoading: false, autoClose: 1000, type: "success" }); setTimeout(() => { handleClose(); getProfileDetails() }, 1000) }
    else toast.update(id, { render: Resp?.msg, isLoading: false, autoClose: 1000, type: "error" })
  }

  useEffect(() => {
    getCmsList()
  }, [])

  const [kycCon, setKycCon] = useState({})

  const getCmsList = async () => {
    const Resp = await getCmsContent({
      page: ["KYC"],
    });
    console.log("sejhfgeiusf", Resp);
    setKycCon(Resp?.data?.[0] ?? {})
  }
  console.log("kycCon", kycCon);
  return (
    <>
      <Modal size='lg'
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        centered
        className='common_modal kycactivates'
      >
        <Modal.Body>
          <div className='modal_top'>
            <div className='kyc_poptop w-100'>
              {/* <img src={require('../assets/images/redround.svg').default} /> */}

              <p className='modal_title text-center '>Activate Your KYC</p>
            </div>
            <img src={require('../assets/images/close.svg').default} id='redCloser' onClick={() => handleClose()} className='modal_closer' />

          </div>

          <div className='modal_body mt_2'>
            {/* <p className='modal_summaryLabel'>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p> */}

            {/* {desc.map((i) => (
              <>
                {description ? ( */}
            <p className="hc-kyc__modal-p mt_3" dangerouslySetInnerHTML={{ __html: kycCon?.content }} >
            </p>
            {/* ) : (
                  <p className="mp_detailbrief mint_scrollText mt-4">
                    {i.descText.length > 150
                      ? i.descText.slice(0, 150).concat("...")
                      : i.descText}
                  </p>
                )}
              </>
            ))} */}
            {/* <button
              className="mp_readmoreBtn readmore_left mt-2"
              onClick={() => setDescription(!description)}
            >
              {description ? "Read Less" : "Read More"}
            </button> */}


            <Row className='mt_1'>
              <Col lg={6} xs={12} className='mb_2'>
                <div className='mt_2'>
                  <p className='modal_summaryLabel'>Name</p>
                  <input type="text" className='modal_singleinput mt-2' id="Name" disabled={Profile?.KycStatus == "complete"} value={Profile?.Name} onChange={handleChange} placeholder='Parsa' />
                 {Error?.Name&& <p style={{ color: "red", fontSize: 12 }}>{Error?.Name}</p> }
                </div>
              </Col>
              <Col lg={6} xs={12} className='mb_2'>
                <div className='mt_2'>
                  <p className='modal_summaryLabel'>Sure Name</p>
                  <input type="text" className='modal_singleinput mt-2' id="SurName" disabled={Profile?.KycStatus == "complete"} value={Profile?.SurName} onChange={handleChange} placeholder='Parsa' />
                  {Error?.SurName && <p style={{ color: "red", fontSize: 12 }}>{Error?.SurName}</p> }
                </div>
              </Col>
              <Col lg={6} xs={12} className='mb_2'>
                <div className='mt_2'>
                  <p className='modal_summaryLabel'>Email Address</p>
                  <input type="text" className='modal_singleinput mt-2' id="EmailId" value={Profile?.EmailId} onChange={handleChange} placeholder='test@gmail.com' />
                  {Error?.EmailId && <p style={{ color: "red", fontSize: 12 }}>{Error?.EmailId}</p> }
                </div>
              </Col>
              <Col lg={6} xs={12} className='mb_2'>
                <div className='mt_2'>
                  <p className='modal_summaryLabel'>Address</p>
                  <input type="text" className='modal_singleinput mt-2' id="Address" value={Profile?.Address} onChange={handleChange} placeholder='Enter Address' />
                  {Error?.Address && <p style={{ color: "red", fontSize: 12 }}>{Error?.Address}</p> }
                </div>
              </Col>
              <Col lg={6} xs={12} className='mb_2'>
                <div className='mt_2'>
                  <p className='modal_summaryLabel'>Telephone (with pincode)</p>
                  <div className='kyc_phoneInput mt_1'>
                    <PhoneInput
                      placeholder="Enter phone number"
                      value={Profile?.mobileNumber}
                      onChange={(e) => { setError({}); setUserProfile({ ...Profile, "mobileNumber": e }) }}
                    />
                  {Error?.mobileNumber &&  <p style={{ color: "red", fontSize: 12 }}>{Error?.mobileNumber}</p> }
                  </div>
                </div>
              </Col>
              <Col lg={6} xs={12} className='mb_2'>
                <div className='mt_2'>
                  <p className='modal_summaryLabel mb_1'>Nationality</p>
                  <div className='nations'>
                  <Select
                   classNamePrefix={"react_select"}
                    className="border_select"
                    placeholder="Select Project"
                    styles={stylesgraybgOne}
                    options={options}
                    value={{ label: Profile?.Nationality, value: Profile?.Nationality }}
                    onChange={(e) => { setError({}); setUserProfile({ ...Profile, Nationality: e.label }) }}
                  />
                  </div>
                {Error?.Nationality &&  <p style={{ color: "red", fontSize: 12 }}>{Error?.Nationality}</p> }
                </div>
              </Col>

              <Col lg={6} xs={12} className='mb_2'>
                <div className='kyc_flex'>
                  <div className='kyc_imagewrapper'>
                    {Profile?.kycFile == "" ?
                      <img className='kyc_editImg' src={require('../assets/images/empty.svg').default} /> :
                      typeof Profile?.kycFile == "string" ?
                        <img className='img-fluid customed_img' src={`${config.IMG_URL}/user/${Profile?.WalletAddress}/kyc/${Profile?.kycFile}`} /> :
                        <img className='img-fluid customed_img' src={URL.createObjectURL(Profile?.kycFile)} />
                    }
                    <input type='file' className='kyc_fileInput' accept="image/*" id='kycFile' onChange={handleChange} />
                  </div>
                  <div>
                    <p className='modal_summaryLabel'>Passport or ID Image</p>
                    <p className='profile_joinDate style_none'>PNG,JPG files accepted</p>
                  </div>
                </div>
                {Error?.kycFile &&  <p style={{ color: "red", fontSize: 12 }}>{Error?.kycFile}</p> }
              </Col>
              <Col lg={6} xs={12}>
                <Form className='mt_2'>
                  <Form.Check
                    type="checkbox"
                    className="mp_customCheck kyc_customcheck"
                    id="buynow"
                  >
                    <Form.Check.Input type="checkbox" isValid checked={Profile?.termsAccepted} onChange={(e) => setUserProfile({ ...Profile, termsAccepted: e.target.checked })} />
                    <Form.Check.Label className='modal_summaryLabel mr_accept'>Accept Terms And Conditions</Form.Check.Label>
                  </Form.Check>
                </Form>
              </Col>

            </Row>





            <div className='w-100 text-center mt_3'>
              <button className='mint_cnctwallet bodygradientBtn ' disabled={loading} onClick={() => onSubmit()}>Submit</button>
            </div>

          </div>

        </Modal.Body>

      </Modal>
    </>
  )
}

export default KYCActivate