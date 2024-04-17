import React, { useState, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';

import { Button, Form, Row } from 'react-bootstrap';
import ReactDatatable from '@ashvin27/react-datatable';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { NPOLIST,NPOAdd } from '../../axioscalls/user.js'
import config from '../../lib/config'
toast.configure();

export default function CmsList(props) {
  const { pathname, state } = useLocation();
  const path = pathname.split("/")[1]
  console.log("pathname,stae", pathname, state, path)
  const { push } = useHistory()
  const { UserAccountAddr  , Admin_Address} = useSelector((state) => state.wallet_detail)
  const [NPO_Det, setNPO_Det] = useState({
    NPO_Profile: '',
    NPO_Cover: '',
    NPO_DisplayName: '',
    NPO_CustomUrl: '',
    NPO_Address: '',
    NPO_Bio: '',
    facebook  : '',
    instagram : '',
    youtube : '',
    twitter : ''
  })

  const [Btn,SetBtn] = useState('start')
  const [Validate,SetValidate] = useState({})
  const [NPO_List,setNPO_List] = useState([])
  useEffect(() => {
   if(path == 'npo-list') getTagslist();
  }, [])
  console.log("NPO_Det?.NPOUrl",state)
  useEffect(() => {
    if (state) {
      setNPO_Det({
        NPO_Profile: state.NPO_Profile,
    NPO_Cover: state.NPO_Cover,
    NPO_DisplayName: state.NPO_DisplayName,
    NPO_CustomUrl: state.NPO_CustomUrl,
    NPO_Address: state.NPO_Address,
    NPO_Bio: state.NPO_Bio,
      'facebook': state.facebook, 
      'instagram': state.instagram,
       'youtube': state.youtube, 
      'twitter': state.twitter ,
        from:state ? 'edit' : 'add'
      })
    }
  }, [pathname, state])

  const getTagslist = async () => {

    var resp = await NPOLIST();
    if (resp?.success == 'success') {
      console.log("returned resp", resp)
      setNPO_List(resp.msg)
    }
  }
  const columns = [
    {
      key: "",
      text: "SNO",
      className: "Name",
      align: "left",
      cell:(rec,ind)=><>{ind+1}</>
    },
    {
      key: "NPO_DisplayName",
      text: "NPO_Display Name",
      className: "Name",
      align: "left",
    },
    {
      key: "NPO_CustomUrl",
      text: "NPO_Custom Url",
      className: "Name",
      align: "left",
    },
    {
      key: "NPO_Address",
      text: "NPO_Address",
      className: "Name",
      align: "left",
    },
    

    {
      key: "NPO_Cover",
      text: "NPO Banner",
      className: "Name",
      align: "left",
      cell:rec=><img src={`${config.ImG}/admin/npo/cover/${rec.NPO_CustomUrl}/${rec.NPO_Cover}` }/>
    },
    {
      key: "NPO_Profile",
      text: "NPO Profile",
      className: "Name",
      align: "left",
      cell:rec=><img src={`${config.ImG}/admin/npo/profile/${rec.NPO_CustomUrl}/${rec.NPO_Profile}` }/>

    },
    {
      key: "action",
      text: "edit",
      className: "Name",
      align: "left",
      cell: record =>
        <div>
          <button
           disabled={UserAccountAddr == Admin_Address ? false : true} 
           onClick={() => push({ pathname: `/npo-save`, state: record })}>Edit</button>
        </div>
    }

  ];


  const onChange = (e) => {
    SetValidate({})
    const { id, name, value, files } = e.target
    if (id == 'NPO_CustomUrl')  {
      setNPO_Det({
        ...NPO_Det,
        ...{
          [id]:  value.replaceAll(' ', '').toLowerCase()
        }
      })
    }
    else{
      setNPO_Det({
        ...NPO_Det,
        ...{
          [id]: files ? files[0] : value
        }
      })
    }
  }
  const FormSubmit = async() => {
    const Error = validation(NPO_Det)
    console.log("Resp",Error)

    if(Object.keys(Error).length == 0){
      var sen = NPO_Det
        sen.from=state ? 'edit' : 'add'
        
      var Resp = await NPOAdd(NPO_Det)
      console.log("Resp",Resp)
      if(Resp.success === 'success'){
        push('/npo-list')
      }
      else{
        SetBtn('error')
        SetValidate(Resp.msg)
      toast.error(Resp.msg)

      }
      
    }
    else{
      SetBtn('error')
      SetValidate(Error)
      toast.error(Error)
    }
  }


  const validation = (data) => {
    const { NPO_DisplayName , NPO_CustomUrl,NPO_Address } = data
    var validate = {}
    if(!NPO_DisplayName) validate.NPO_DisplayName = " NPO_DisplayName Require"
    if(!NPO_CustomUrl) validate.NPO_CustomUrl = " NPO_CustomUrl Require"
    if(!NPO_Address) validate.NPO_Address = " NPO_Address Require"
    if(NPO_Address &&(! NPO_Address.toString().slice(0,2).includes('0x') )) validate.NPO_Address = " Require Ethereum Address"
    if(NPO_Address && NPO_Address.toString().length != 42) validate.NPO_Address = " Enter Correct  Ethereum Address"
    
    if (NPO_CustomUrl && !(/^[A-Za-z]+$/).test(NPO_CustomUrl)) validate.NPO_CustomUrl = 'NPO_CustomUrl Must Be Allowed Only Letters'

    console.log("Resp",validate)

    return validate

  }
  
  console.log("get All value", NPO_Det)
  return (

    path
      && path == "npo-save" ?
      <div>
        <div className="row">

          <div className="col-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">{state ? 'Edit ' : 'Add '} NPO Details</h4>
                <form className="forms-sample">
                  <Form.Group>
                    <label
                      htmlFor="exampleInputName1">
                      NPO Name
                    </label>
                    <Form.Control
                      type="text"
                      className="form-control"
                      onChange={onChange}
value={NPO_Det?.NPO_DisplayName}
                      id="NPO_DisplayName"
                    />
                    <div className='error_msg'>{Validate?.NPO_DisplayName}</div>
                  </Form.Group>
                  
                  <Form.Group>
                    <label
                      htmlFor="exampleInputName1">
                     NPO_Address
                    </label>
                    <Form.Control
                      type="text"
                      className="form-control"
                      onChange={onChange}
value={NPO_Det?.NPO_Address}
                      id="NPO_Address"
                      disabled={state ? true : false}
                    />
                    <div className='error_msg'>{Validate?.NPO_Address}</div>

                  </Form.Group>
                  <Form.Group>
                    <label
                      htmlFor="exampleInputName1">
                      NPO Custom URL
                    </label>
                    <Form.Control
                      type="text"
                      className="form-control"
                      onChange={onChange}
value={NPO_Det?.NPO_CustomUrl}
                      id="NPO_CustomUrl"
                      disabled={state ? true : false}
                    />
                    <div className='error_msg'>{Validate?.NPO_CustomUrl}</div>

                  </Form.Group>
                  <Form.Group>
                    <label
                      htmlFor="exampleInputName1">
                      NPO Banner
                    </label>
                    <Form.Control
                      type="file"
                      accept='image/*'

                      className="form-control"
                      onChange={onChange}

                      id="NPO_Cover"
                    />
                    <img src={NPO_Det.NPO_Cover ? typeof NPO_Det.NPO_Cover == 'string' ?  `${config.ImG}/admin/npo/cover/${state.NPO_CustomUrl}/${state.NPO_Cover}` : URL.createObjectURL(NPO_Det.NPO_Cover) : config.noimg} width="50" height="50" />
                  </Form.Group>
                  <Form.Group>
                    <label
                      htmlFor="exampleInputName1">
                      NPO Profile
                    </label>
                    <Form.Control
                      type="file"
                      accept='image/*'

                      className="form-control"
                      onChange={onChange}

                      id="NPO_Profile"
                    />
                    <img src={NPO_Det.NPO_Profile ? typeof NPO_Det.NPO_Profile == 'string' ? `${config.ImG}/admin/npo/profile/${state.NPO_CustomUrl}/${state.NPO_Profile}`  : URL.createObjectURL(NPO_Det.NPO_Profile) : config.noimg} width="50" height="50" />

                  </Form.Group>
                  <Form.Group>
                    <label
                      htmlFor="exampleInputName1">
NPO_Bio
                    </label>
                    <Form.Control
                      type="text"
                      className="form-control"
                      onChange={onChange}
value={NPO_Det?.NPO_Bio}
                      id="NPO_Bio"
                    />
                  </Form.Group>
                
                  <Row>

                    <Form.Group className="socialSpace" style={{marginRight:20}}>
                      <label
                        htmlFor="exampleInputName1">
                        Instagram
                      </label>

                      <Form.Control
                        // style={{width:'40%'}}
                        type="text"
                        className="form-control"
                        onChange={onChange}
value={NPO_Det?.instagram}
                        id="instagram"
                        name="#"
                      />

                    </Form.Group>
                    <Form.Group  className="socialSpace" style={{marginRight:20}}> <label
                      htmlFor="exampleInputName1">
                      Facebook
                    </label>
                      <Form.Control
                        type="text"
                        className="form-control"
                        onChange={onChange}
value={NPO_Det?.facebook}
                        name="#"
                        id="facebook"
                      /></Form.Group>
                    <Form.Group  className="socialSpace" style={{marginRight:20}}> <label
                      htmlFor="exampleInputName1">
                      Twitter
                    </label>
                      <Form.Control
                        type="text"
                        className="form-control"
                        onChange={onChange}
value={NPO_Det?.twitter}
                        name="#"
                        id="twitter"
                      /></Form.Group>
                    <Form.Group  className="socialSpace"> <label
                      htmlFor="exampleInputName1">
                      Youtube
                    </label>
                      <Form.Control

                        type="text"
                        className="form-control"
                        onChange={onChange}
value={NPO_Det?.youtube}
                        name="#"
                        id="youtube"
                      /></Form.Group>
                  </Row>

                </form>
                <div className='error_msg'>  <Button onClick={()=>{FormSubmit()}}> Submit</Button></div>


              </div>
            </div>
          </div>

        </div>
      </div>
      : <div>
        {UserAccountAddr == Admin_Address
          && <div className="page-header text-right">
            <nav aria-label="breadcrumb">
              <Button onClick={() => push('/npo-save')}>ADD</Button>

            </nav>
          </div>}
        <div className="row">

          <div className="col-lg-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">NFT TAGS LIST</h4>

                <div className="table-responsive">
                  <ReactDatatable

                    records={NPO_List}
                    columns={columns}
                  />

                </div>
              </div>
            </div>
          </div>

        </div>
      </div>


  )


}

