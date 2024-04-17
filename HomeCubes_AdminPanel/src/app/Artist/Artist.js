import React, { useState, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';

import { Button, Form, ProgressBar, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ReactDatatable from '@ashvin27/react-datatable';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ArtistList,ArtistAdd } from '../../axioscalls/user.js'
import config from '../../lib/config'
toast.configure();

export default function CmsList(props) {
  const { pathname, state } = useLocation();
  const path = pathname.split("/")[1]
  console.log("pathname,stae", pathname, state, path)
  const { push } = useHistory()
  const { UserAccountAddr , Admin_Address} = useSelector((state) => state.wallet_detail)
  const [Artist_Det, setArtist_Det] = useState({
    ArtistName: '',
    ArtistUrl: '',
    ArtistBanner: '',
    ArtistProfile: '',
    ArtistBio: '',
    'facebook': '', 'instagram': '', 'youtube': '', 'twitter': '' ,
    heading1: '',
    bio1: '',
    image1: null,
    heading2: '',
    bio2: '',
    image2: null,
    ArtistNotableDescription: '',
    WalletAddress:''
  })
  const [Btn,SetBtn] = useState('start')
  const [Validate,SetValidate] = useState({})
  const [Artist_List,setArtist_List] = useState([])
  useEffect(() => {
   if(path == 'artist-list') getTagslist();
  }, [])
  console.log("Artist_Det?.ArtistUrlArtist_Det?.ArtistUrl",state)
  useEffect(() => {
    if (state) {
      setArtist_Det({
        ArtistName: state.ArtistName,
        ArtistUrl: state.ArtistUrl,
        ArtistBanner: state.ArtistBanner ,
        ArtistProfile: state.ArtistProfile ,
        ArtistBio: state.ArtistBio,
      'facebook': state.ArtistSocialLinks.facebook, 
      'instagram': state.ArtistSocialLinks.instagram,
       'youtube': state.ArtistSocialLinks.youtube, 
      'twitter': state.ArtistSocialLinks.twitter ,
        heading1: state.ArtistBlogs[0].heading,
        bio1: state.ArtistBlogs[0].bio,
        image1: state.ArtistBlogs[0].image ,
        heading2: state.ArtistBlogs[1].heading,
        bio2: state.ArtistBlogs[1].bio,
        image2: state.ArtistBlogs[1].image ,
        ArtistNotableDescription: state.ArtistNotableDescription,
        WalletAddress:state.WalletAddress,
        from:state ? 'edit' : 'add'
      })
    }
  }, [pathname, state])

  const getTagslist = async () => {

    var resp = await ArtistList();
    if (resp?.success == 'success') {
      console.log("returned resp", resp)
      setArtist_List(resp.msg)
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
      key: "ArtistName",
      text: "Artist Name",
      className: "Name",
      align: "left",
    },
    {
      key: "ArtistUrl",
      text: "Artist Url",
      className: "Name",
      align: "left",
    },
      
    {
      key: "WalletAddress",
      text: "Artist WalletAddress",
      className: "Name",
      align: "left",
    },

    {
      key: "ArtistBanner",
      text: "Artist Banner",
      className: "Name",
      align: "left",
      cell:rec=><img src={`${config.ImG}/admin/artist/cover/${rec.ArtistUrl}/${rec.ArtistBanner}` }/>
    },
    {
      key: "ArtistProfile",
      text: "Artist Profile",
      className: "Name",
      align: "left",
      cell:rec=><img src={`${config.ImG}/admin/artist/profile/${rec.ArtistUrl}/${rec.ArtistProfile}` }/>

    },

    {
      key: "action",
      text: "edit",
      className: "Name",
      align: "left",
      cell: record =>
        <div>
          <button className='btn mb-2 allbtn' type='button' disabled={UserAccountAddr == Admin_Address ? false : true} onClick={() => push({ pathname: `/artist-save`, state: record })}>Edit</button>
        </div>
    }

  ];


  const onChange = (e) => {
    
    const { id, name, value, files } = e.target
    if (id == 'ArtistUrl')  {
      setArtist_Det({
        ...Artist_Det,
        ...{
          [id]:  value.replaceAll(' ', '').toLowerCase()
        }
      })
    }
    else{
      setArtist_Det({
        ...Artist_Det,
        ...{
          [id]: files ? files[0] : value
        }
      })
    }
  }
  const FormSubmit = async() => {
    const Error = validation(Artist_Det)
    console.log("Resp",Error)

    if(Object.keys(Error).length == 0){
      var Resp = await ArtistAdd(Artist_Det)
      console.log("Resp",Resp)
      if(Resp.success === 'success'){
        push('/artist-list')
      }
      else{
        SetBtn('error')
        SetValidate(Resp.Error)
      }
      
    }
    else{
      SetBtn('error')
      SetValidate(Error)
    }
  }


  const validation = (data) => {
    const { ArtistName , ArtistUrl,WalletAddress } = data
    var validate = {}
    if(!ArtistName) validate.ArtistName = " Artist Name Require"
    if(!ArtistUrl) validate.ArtistUrl = " Artist Url Require"
    if (ArtistUrl && !(/^[A-Za-z]+$/).test(ArtistUrl)) validate.ArtistUrl = 'ArtistUrl Must Be Allowed Only Letters'
    
    if(!WalletAddress) validate.WalletAddress = " Artist WalletAddress Require"
    if(WalletAddress &&(! WalletAddress.toString().slice(0,2).includes('0x') )) validate.WalletAddress = " Require Ethereum Address"
    if(WalletAddress && WalletAddress.toString().length != 42) validate.WalletAddress = " Enter Correct  Ethereum Address"
    
    console.log("Resp",validate)

    return validate

  }
  
  console.log("get All value", Artist_Det)
  return (

    path
      && path == "artist-save" ?
      <div>
        <div className="row">

          <div className="col-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">{state ? 'Edit ' : 'Add '} Artist Details</h4>
                <form className="forms-sample">
                  <Form.Group>
                    <label
                      htmlFor="exampleInputName1">
                      Artist Name
                    </label>
                    <Form.Control
                      type="text"
                      className="form-control"
                      onChange={onChange}
value={Artist_Det?.ArtistName}
                      id="ArtistName"
                    />
                    <div className='text-center'>{Validate?.ArtistName}</div>
                  </Form.Group>
                  <Form.Group>
                    <label
                      htmlFor="exampleInputName1">
                      Artist URL
                    </label>
                    <Form.Control
                      type="text"
                      className="form-control"
                      onChange={onChange}
value={Artist_Det?.ArtistUrl}
                      id="ArtistUrl"
                      disabled={state ? true : false}
                    />
                    <div className='text-center'>{Validate?.ArtistUrl}</div>

                  </Form.Group>
                  <Form.Group>
                    <label
                      htmlFor="exampleInputName1">
                      Artist WalletAddress
                    </label>
                    <Form.Control
                      type="text"
                      className="form-control"
                      onChange={onChange}
                      value={Artist_Det?.WalletAddress}
                      id="WalletAddress"
                      // disabled={state ? true : false}
                    />
                    <div className='text-center'>{Validate?.WalletAddress}</div>

                  </Form.Group>
                  <Form.Group>
                    <label
                      htmlFor="exampleInputName1">
                      Artist Banner
                    </label>
                    <Form.Control
                      type="file"
                      accept='image/*'

                      className="form-control"
                      onChange={onChange}

                      id="ArtistBanner"
                    />
                    <img src={Artist_Det.ArtistBanner ? typeof Artist_Det.ArtistBanner == 'string' ?  `${config.ImG}/admin/artist/cover/${state.ArtistUrl}/${state.ArtistBanner}` : URL.createObjectURL(Artist_Det.ArtistBanner) : config.noimg} width="50" height="50" />
                  </Form.Group>
                  <Form.Group>
                    <label
                      htmlFor="exampleInputName1">
                      Artist Profile
                    </label>
                    <Form.Control
                      type="file"
                      accept='image/*'

                      className="form-control"
                      onChange={onChange}

                      id="ArtistProfile"
                    />
                    <img src={Artist_Det.ArtistProfile ? typeof Artist_Det.ArtistProfile == 'string' ? `${config.ImG}/admin/artist/profile/${state.ArtistUrl}/${state.ArtistProfile}`  : URL.createObjectURL(Artist_Det.ArtistProfile) : config.noimg} width="50" height="50" />

                  </Form.Group>
                  <Form.Group>
                    <label
                      htmlFor="exampleInputName1">
                      Artist Bio
                    </label>
                    <Form.Control
                      type="text"
                      className="form-control"
                      onChange={onChange}
value={Artist_Det?.ArtistBio}
                      id="ArtistBio"
                    />
                  </Form.Group>
                  <Form.Group>
                    <label
                      htmlFor="exampleInputName1">
                      Artist Notable Description
                    </label>
                    <Form.Control
                      type="text"
                      className="form-control"
                      onChange={onChange}
value={Artist_Det?.ArtistNotableDescription}
                      id="ArtistNotableDescription"
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
value={Artist_Det?.instagram}
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
value={Artist_Det?.facebook}
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
value={Artist_Det?.twitter}
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
value={Artist_Det?.youtube}
                        name="#"
                        id="youtube"
                      /></Form.Group>
                  </Row>


                  <Row >
                    <label
                      htmlFor="exampleInputName1">
                      ARtist Notable Blogs
                    </label>

                  </Row>
                  <Row>
                    <Form.Group>
                      <label
                        htmlFor="exampleInputName1">
                        Heading
                      </label>

                      <Form.Control
                        // style={{width:'40%'}}
                        type="text"
                        className="form-control"
                        onChange={onChange}
value={Artist_Det?.heading1}
                        id="heading1"
                      />

                    </Form.Group>
                    <Form.Group> <label
                      htmlFor="exampleInputName1">
                      Description
                    </label>
                      <Form.Control
                        style={{ marginLeft: '10%', marginRight: '10%' }}
                        type="text"
                        className="form-control"
                        onChange={onChange}
value={Artist_Det?.bio1}
                        id="bio1"
                      /></Form.Group>
                    <Form.Group>
                      <label
                        htmlFor="exampleInputName1">
                        Image
                      </label>
                      <Form.Control
                        style={{ marginLeft: '10%', marginRight: '10%' }}

                        type="file"
                        accept='image/*'
                        className="form-control"
                        onChange={onChange}

                        id="image1"
                      />
                    </Form.Group>
                    <img src={Artist_Det.image1 ? typeof Artist_Det.image1 == 'string' ?  `${config.ImG}/admin/artist/blog/${state.ArtistBlogs[0].heading}/${state.ArtistUrl}/${state.ArtistBlogs[0].image}` : URL.createObjectURL(Artist_Det.image1) : config.noimg} width="50" height="50" />

                  </Row>
                  <Row>
                    <Form.Group>
                      <label
                        htmlFor="exampleInputName1">
                        Heading
                      </label>

                      <Form.Control
                        // style={{width:'40%'}}
                        type="text"
                        className="form-control"
                        onChange={onChange}
value={Artist_Det?.heading2}
                        id="heading2"
                      />

                    </Form.Group>
                    <Form.Group> <label
                      htmlFor="exampleInputName1">
                      Description
                    </label>
                      <Form.Control
                        style={{ marginLeft: '10%', marginRight: '10%' }}
                        type="text"
                        className="form-control"
                        onChange={onChange}
value={Artist_Det?.bio2}
                        id="bio2"
                      /></Form.Group>
                    <Form.Group> <label
                      htmlFor="exampleInputName1">
                      Image
                    </label>
                      <Form.Control
                        style={{ marginLeft: '10%', marginRight: '10%' }}
                        type="file"
                        accept='image/*'

                        className="form-control"
                        onChange={onChange}

                        id="image2"
                      /></Form.Group>
                    <img src={Artist_Det.image2 ? typeof Artist_Det.image2 == 'string' ?  `${config.ImG}/admin/artist/blog/${state.ArtistBlogs[1].heading}/${state.ArtistUrl}/${state.ArtistBlogs[0].image}`  : URL.createObjectURL(Artist_Det.image2) : config.noimg} width="50" height="50" />

                  </Row>
                </form>
                <div className='text-center'>  <Button  onClick={()=>{FormSubmit()}}> Submit</Button></div>


              </div>
            </div>
          </div>

        </div>
      </div>
      : <div>
        {UserAccountAddr == Admin_Address
          && <div className="page-header text-right">
            <nav aria-label="breadcrumb">
              <Button onClick={() => push('/artist-save')}>ADD</Button>

            </nav>
          </div>}
        <div className="row">

          <div className="col-lg-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">ARTIST LIST</h4>

                <div className="table-responsive">
                  <ReactDatatable

                    records={Artist_List}
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

