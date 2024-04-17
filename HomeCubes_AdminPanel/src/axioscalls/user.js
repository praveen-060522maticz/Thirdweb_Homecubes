import axios  from "axios"
import config from '../lib/config.js'
import { AppenData, EncryptData, axiosFunc } from '../lib/common.js';



export const getSubscribers = async () => {

    try {
        var resp = await axios({
            'method': 'GET',
            'url': `${config.AdminAPI}/getSubscribers`,
        })
        console.log("tokonwer resp", resp.data)
        return resp.data;
    }
    catch (err) { console.log("err in gettok owner", err) }
}


export const addbulkusers  = async(data)=>{
    console.log('====================================');
    console.log(data);
    console.log('====================================');
    try{
        var resp = await axios({
          
                'method':'post',
                'url':`${config.AdminAPI}/exceltomail`,
                'headers' : {
                     "content-type":"multipart/form-data"
                },
                'data' : data
        })
        console.log("bulk users resp",resp.data)
        return resp.data;
    }
    catch(err){console.log("err in bulk users",err)}
  }


export const changeMaySent = async(data)=>{
  console.log("token data",data)
  try{
      var resp = await axios({
          "method":"POST",
          "url":`${config.AdminAPI}/user/changemaysent`,
          "headers":{
              "Authorization":localStorage.getItem("token")
          },
          "data":data,
      })

      return resp.data
  }
  catch(err){
      console.log('add token err',err)
  }
}

export const changesocialstate = async(data)=>{
    console.log("token data",data)
    try{
        var resp = await axios({
            "method":"POST",
            "url":`${config.AdminAPI}/user/changesocialstate`,
            "headers":{
                "Authorization":localStorage.getItem("token")
            },
            "data":data,
        })
  
        return resp.data
    }
    catch(err){
        console.log('add token err',err)
    }
  }


export const sendSubscriberMail = async (data) => {
    console.log("sklfs",data);
    const encData = EncryptData(data)
  try { 
      let respData = await axios({
          'method': 'post',
          'url': `${config.AdminAPI}/sendSubscribeMail`,
          "headers":{
            "Authorization":localStorage.getItem("token")
        },
          data:{data:encData}
      });

      return respData.data
  }catch (error) {
      return {
          loading: false,
          error : error
      }
  }
}


export const addSocial = async (data) => {
    console.log("sklfs",data)
  try { 
      let respData = await axios({
          'method': 'post',
          'url': `${config.AdminAPI}/addsociallinks`,
          "headers":{
            "Authorization":localStorage.getItem("token")
        },
          data
      });

      return respData.data
  }catch (error) {
      console.log("errr")
  }
}


export const getSocialData  = async()=>{
    
    try{
        var resp = await axios({
          
                'method':'GET',
                'url':`${config.AdminAPI}/getsociallinks`,
        })
        console.log("tokonwer resp",resp.data)
        return resp.data;
    }
    catch(err){console.log("err in gettok owner",err)}
  }



  export const editDeleteSocial = async(data)=>{
    console.log("token data",data)
    try{
        var resp = await axios({
            "method":"POST",
            "url":`${config.AdminAPI}/editdeletesocial`,
            "headers":{
                "Authorization":localStorage.getItem("token")
            },
            "data":data,
        })
  
        return resp.data
    }
    catch(err){
        console.log('add token err',err)
    }
  }
  

export const getUserList  = async()=>{
    
    try{
        var resp = await axios({
          
                'method':'GET',
                'url':`${config.AdminAPI}/getuserlist`,
        })
        console.log("tokonwer resp",resp.data[0])
        return resp.data;
    }
    catch(err){console.log("err in gettok owner",err)}
  }


  export const adminAccess = async(data)=>{
    console.log("token data",data)
    try{
        var resp = await axios({
            "method":"POST",
            "url":`${config.AdminAPI}/user/changeadminstatus`,
            "headers":{
                "Authorization":localStorage.getItem("token")
            },
            "data":data,
        })
  
        return resp.data
    }
    catch(err){
        console.log('add token err',err)
    }
  }

 
  export const getFaqList  = async()=>{
    
    try{
        var resp = await axios({
          
                'method':'GET',
                'url':`${config.AdminAPI}/getfaqlist`,
        })
        console.log("tokonwer resp",resp.data)
        return resp.data;
    }
    catch(err){console.log("err in gettok owner",err)}
  }




  export const getFaqContentsList  = async()=>{
    
    try{
        var resp = await axios({
          
                'method':'GET',
                'url':`${config.AdminAPI}/getfaqcontentslist`,
        })
        console.log("tokonwer resp",resp.data)
        return resp.data;
    }
    catch(err){console.log("err in gettok owner",err)}
  }

  export const addFaqcontentCall = async(data)=>{
    console.log("token data",data)
    try{
        var resp = await axios({
            "method":"POST",
            "url":`${config.AdminAPI}/addfaqcontent`,
            "headers":{
                "Authorization":localStorage.getItem("token")
            },
            "data":data,
        })
  
        return resp.data
    }
    catch(err){
        console.log('add token err',err)
    }
  }

  export const getnfttags = async (filterData) => {
    console.log('yes')
    try {
        let respData = await axios({
            'method': 'get',
            'url': `${config.AdminAPI}/getnfttag`,
          
        });

        console.log("respData",respData.data)
       return respData.data;
    }
    catch (err) {
        return {
            loading: false,
            error: err.response.data.errors
        }
    }
}


export const editNftTags = async(payload)=>{
    console.log("paylaod to edittag",payload)
    try{
        var resp = await axios({
            "method":"POST",
            "url":`${config.AdminAPI}/editnfttag`,
            "headers":{
                "Authorization":localStorage.getItem("token")
            },
            "data":payload
        })

        console.log("reponse",resp.data)
        return resp.data
    }catch(err){
        console.log("err",err)
    }
    }
  
  

export const ArtistAdd = async (data)=> {
    var formdata = new FormData()
    formdata.append('ArtistName',data.ArtistName)
    formdata.append('WalletAddress',data.WalletAddress)
    formdata.append('ArtistUrl',data.ArtistUrl)
    formdata.append('ArtistBanner',data.ArtistBanner)
    formdata.append('ArtistProfile',data.ArtistProfile)
    formdata.append('ArtistBio',data.ArtistBio)
    formdata.append('twitter',data.twitter)
    formdata.append('facebook',data.facebook)
    formdata.append('youtube',data.youtube)
    formdata.append('instagram',data.instagram)
    formdata.append('heading1',data.heading1)
    formdata.append('heading2',data.heading2)
    formdata.append('bio1',data.bio1)
    formdata.append('bio2',data.bio2)
    formdata.append('image2',data.image2)
    formdata.append('image1',data.image1)
    formdata.append('from',data.from)
    
    formdata.append('ArtistNotableDescription',data.ArtistNotableDescription)
    
    try{
        var resp = await axios({
            "method":"POST",
            "url":`${config.AdminAPI}/user/ArtistAdd`,
            "headers":{
                // "Authorization":localStorage.getItem("token"),
                'Content-Type': 'multipart/form-data',

            },
            "data":formdata
        })
        return resp.data
    }catch(err){
        console.log("err",err)
    }
}
export const ArtistList = async (data)=> {
       
    try{
        var resp = await axios({
            "method":"GET",
            "url":`${config.AdminAPI}/user/ArtistList`,
          
        })
        return resp.data
    }catch(err){
        console.log("err",err)
    }
}

export const NPOLIST = async (data)=>{
    try{
        var resp = await axios({
            "method":"GET",
            "url":`${config.AdminAPI}/token/npolist`,
        })
        return resp.data
    }catch(err){
        console.log("err",err)
        return false

    }
}


export const NPOAdd = async (data)=> {
    var formdata = new FormData()
    formdata.append('NPO_DisplayName',data.NPO_DisplayName)
    formdata.append('NPO_CustomUrl',data.NPO_CustomUrl)
    formdata.append('NPO_Cover',data.NPO_Cover)
    formdata.append('NPO_Profile',data.NPO_Profile)
    formdata.append('NPO_Bio',data.NPO_Bio)
    formdata.append('twitter',data.twitter)
    formdata.append('facebook',data.facebook)
    formdata.append('youtube',data.youtube)
    formdata.append('instagram',data.instagram)
    formdata.append('from',data.from)
    formdata.append('NPO_Address',data.NPO_Address)
    
    try{
        var resp = await axios({
            "method":"POST",
            "url":`${config.AdminAPI}/token/nopadd`,
            "headers":{
                // "Authorization":localStorage.getItem("token"),
                'Content-Type': 'multipart/form-data',

            },
            "data":formdata
        })
        return resp.data
    }catch(err){
        console.log("err",err)
    }
}

export const FindpromoDrop = async() => {
    try{
        var resp = await axios({
            "method":"GET",
            "url":`${config.Back_Url}/bulk/FindpromoDrop`,
        })
        return resp.data
    }catch(err){
        console.log("err",err)
        return false

    }
}
export const getDroppromoList = async(data) => {
    console.log("dsjdjaskdhhaskdkashdkas",data)
    try{
        var resp = await axios({
            "method":"GET",
            "url":`${config.Back_Url}/bulk/getDroppromoList`,
            "params" : data
        })
        return resp.data
    }catch(err){
        console.log("err",err)
        return false

    }
}



export const generate = async(data) => {
    try{
        var resp = await axios({
            "method":"post",
            "url":`${config.Back_Url}/bulk/generate`,
            "data" : data
        })
        return resp.data
    }catch(err){
        console.log("err",err)
        return false

    }
}

export const SendMails = async(data) => {
    try{
        var resp = await axios({
            "method":"post",
            "url":`${config.Back_Url}/user/SendMails`,
            "data" : data
        })
        return resp.data
    }catch(err){
        console.log("err",err)
        return false

    }
}
export const GetUsersData = async(data) => {
    try{
        var resp = await axios({
            "method":"get",
            "url":`${config.Back_Url}/user/GetUsersData`,
            })
        return resp.data
    }catch(err){
        console.log("err",err)
        return false

    }
}


export const CheckBalance = async(data) => {
    try{
        var resp = await axios({
            "method":"post",
            "url":`${config.Back_Url}/bulk/CheckBalance`,
            "data" : data
        })
        return resp.data
    }catch(err){
        console.log("err",err)
        return false

    }
}


export const getReferral = async(data) => {
    try{
        var resp = await axios({
            "method":"GET",
            "url":`${config.AdminAPI}/getReferralPersentage`,
            "data" : data
        })
        return resp.data
    }catch(err){
        console.log("err",err)
        return false
    }
}

export const addReferalPersentage = async(data) => {
    try{
        var resp = await axios({
            "method":"GET",
            "url":`${config.AdminAPI}/addReferalPersentage`,
            params : data
        })
        return resp.data
    }catch(err){
        console.log("err",err)
        return false
    }
}

//faq
export const addFaqCall = async(data)=>{
    console.log("token data",data)
    const encData = EncryptData(data)

    try{
        var resp = await axios({
            "method":"POST",
            "url":`${config.AdminAPI}/addfaq`,
            "headers":{
                "Authorization":localStorage.getItem("token")
            },
            "data": {data: encData}
        })
  
        return resp.data
    }
    catch(err){
        console.log('add token err',err)
    }
  }

  export const addcontactdata = async (data) => {
    console.log("datadata",data,config.Back_Url)
    const encData = EncryptData(data)
    try{
    var resp = await axios({

            method: 'post',
            url: `${config.Back_Url}/front/user/addcontactus`,
            'headers': {
                "Authorization":localStorage.getItem("token")
            },
            data: {data:encData}
        })
    console.log("rrrrrrr",resp)
        return resp;
    }
    catch(err){
        console.log('add token err',err)
    }
    }
//   export const addFaqCall = async(data)=>{
//     console.log("token data",data)
//     try{
//         var resp = await axios({
//             "method":"POST",
//             "url":`${config.AdminAPI}/addfaq`,
//             "headers":{
//                 "Authorization":localStorage.getItem("token")
//             },
//             "data":data,
//         })
  
//         return resp.data
//     }
//     catch(err){
//         console.log('add token err',err)
//     }
//   }