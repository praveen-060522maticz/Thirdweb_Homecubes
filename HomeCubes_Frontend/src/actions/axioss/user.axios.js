import config from '../../config/config'
import { axiosFunc, AppenData, EncryptData } from '../common'

var token;

export const GetUserCookieToken = () => {
    token = document.cookie.split('; ').reduce((r, v) => {
        const parts = v.split('=')
        // console.log('egfwafwer', parts)
        return parts[0] === "token" ? decodeURIComponent(parts[1]) : r
    }, '');
}

//user ProfileCreate, Update axios Function
export const userRegister = async (data) => {
    // console.log("UserRegister is Calling",data)
    var formdata = AppenData(data)
    var senddata = {
        method: 'post',
        url: `${config.BACK_URL}/user/create`,
        data: formdata[0],
        'headers': {
            'Content-Type': 'multipart/form-data',
            'Authorization': token
        }
    }

    let Resp = await axiosFunc(senddata)
    console.log('resppp', Resp, senddata, data)
    return Resp
}


export const createImg = async (data) => {
    var senddata = {

        method: 'POST',
        url: `${config.BACK_URL}/user/generateImage`,
        data: data

    }
    let Resp = await axiosFunc(senddata)


    return Resp.data

}
export const Token_MyList_Func = async (data) => {
    const encData = EncryptData(data)
    var senddata = {
        method: 'GET',
        url: `${config.BACK_URL}/nft/myItemList`,
        params: { data: encData }
    }
    let Resp = await axiosFunc(senddata)

    return Resp
}

export const FollowUnFollowFunc = async (data) => {
    var senddata = {
        method: 'POST',
        url: `${config.BACK_URL}/user/FollowUnFollowFunc`,
        data: data,
        'headers': {
            'Authorization': token
        }
    }
    let Resp = await axiosFunc(senddata);

    return Resp.data;
}

export const GetLikeDataAction = async (data) => {
    var senddata = {
        method: 'POST',
        url: `${config.BACK_URL}/nft/like/list`,
        data: data
    }
    let Resp = await axiosFunc(senddata)
    return Resp.data
}

export const AddLikeAction = async (data) => {
    var senddata = {
        method: 'POST',
        url: `${config.BACK_URL}/nft/like`,
        data: data,
        'headers': {
            'Authorization': token
        }
    }
    let Resp = await axiosFunc(senddata)
    return Resp.data
}

export const findOwners = async (data) => {
    var senddata = {
        method: 'GET',
        url: `${config.BACK_URL}/nft/findOwners`,
        params: data

    }
    let Resp = await axiosFunc(senddata)
    return Resp.data
}

export const Newsletter = async (data) => {
    const encData = EncryptData(data)
    var senddata = {
        method: 'POST',
        url: `${config.BACK_URL}/user/newsletter`,
        data: { data: encData }
    }
    console.log('hdghgh', senddata)
    let Resp = await axiosFunc(senddata);

    return Resp
}

export const report = async (data) => {
    var senddata = {
        'method': 'post',
        'url': `${config.BACK_URL}/nft/report`,
        data: data
    }
    let Resp = await axiosFunc(senddata);

    return Resp?.data;
}

export const getFaqList = async () => {

    try {
        var resp = await axiosFunc({

            'method': 'GET',
            'url': `${config.ADMIN_URL}/getfaqlist`,
        })
        console.log("tokonwer resp", resp.data)
        return resp.data;
    }
    catch (err) { console.log("err in gettok owner", err) }
}
export const getFaqcontentList = async () => {

    try {
        var resp = await axiosFunc({

            'method': 'GET',
            'url': `${config.ADMIN_URL}/getfaqcontentslist`,
        })
        console.log("tokonwer resp", resp.data)
        return resp.data;
    }
    catch (err) { console.log("err in gettok owner", err) }
}

export const Sociallinks = async () => {

    var senddata = {
        method: 'get',
        url: `${config.BACK_URL}/user/social`
    }
    let Resp = await axiosFunc(senddata);

    return Resp.data;
}


export const getReferUserDetails = async (data) => {

    var senddata = {
        method: 'get',
        url: `${config.BACK_URL}/user/getRefferUser`,
        params: data
    }
    let Resp = await axiosFunc(senddata);

    return Resp.data;
}

export const getReferralActivity = async (data) => {

    var senddata = {
        method: 'get',
        url: `${config.BACK_URL}/user/getReferralActivity`,
        params: data
    }
    let Resp = await axiosFunc(senddata);

    return Resp.data;
}

export const getRefferedUsersList = async (data) => {

    var senddata = {
        method: 'get',
        url: `${config.BACK_URL}/user/getRefferedUsersList`,
        params: data
    }
    let Resp = await axiosFunc(senddata);

    return Resp.data;
}

//////////
export const addcontactdata = async (data) => {
    console.log("datadata", data)
    const encData = EncryptData(data)
    var senddata = {
        method: 'post',
        url: `${config.BACK_URL}/user/addcontactus`,
        'headers': {
            'Authorization': token
        },
        data: { data: encData }
    }
    let Resp = await axiosFunc(senddata);

    return Resp;
}


export const faqFunctions = async (data) => {
    const encData = EncryptData(data)
    try {
        var resp = await axiosFunc({
            'method': 'POST',
            'url': `${config.ADMIN_URL}/addfaq`,
            data: { data: encData }
        })
        console.log("tokonwer resp", resp.data)
        return resp
    }
    catch (err) { console.log("err in gettok owner", err) }
}


export const aboutFunctions = async (data) => {
    try {
        var resp = await axiosFunc({
            'method': 'GET',
            'url': `${config.ADMIN_URL}/getaboutuser`
        })
        console.log("tokonwer respsefse", resp)
        return resp
    }
    catch (err) { console.log("err in gettok owner", err) }
}



export const createProject = async (data) => {
    console.log("datadata", data);
    const encData = AppenData(data)
    console.log("encData", encData);
    try {
        // var data = { "test": "testdata" }
        var resp = await axiosFunc({
            "method": "POST",
            'url': `${config.ADMIN_URL}/createProject`,
            "data": encData[0],
            "headers": {
                "Authorization": localStorage.getItem("token")
            }
        })

        return resp

    }
    catch (err) { console.log("err".err) }

}

export const getFessFunc = async (data) => {
    const encData = EncryptData(data)
    try {
        var resp = await axiosFunc({

            'method': 'POST',
            'url': `${config.ADMIN_URL}/gasManagerFunc`,
            data:{ data: encData }
        })
        console.log("tokonwer resp", resp.data)
        return resp.data;
    }
    catch (err) { console.log("err in gettok owner", err) }
}