import axios from "axios"
import config from '../lib/config.js'
import { AppenData, EncryptData, axiosFunc } from '../lib/common.js';

// purpose -- to get tokenlist  from db for listing before minting

export const getTokenList = async () => {

    try {
        const resp = await axios({
            'method': 'GET',
            'url': `${config.AdminAPI}/token/gettokens`,

        })

        //console.log("response token list",resp.data)
        return resp.data;
    }
    catch (err) {

    }

}

export const addarticle = async (data) => {
    try {
        console.log("data", data)
        const resp = await axios({
            'method': 'post',
            'url': `${config.AdminAPI}/addarticle`,
            "headers": {
                "Content-Type": 'multipart/form-data'
            },
            'data': data
        })
        return resp.data;
    }
    catch (err) {
        return false
    }
}

export const addaboutuser = async (data) => {
    try {
        console.log("data", data)
        var formdata = AppenData(data)

        const resp = await axios({
            'method': 'post',
            'url': `${config.AdminAPI}/addaboutuser`,
            "headers": {
                "Content-Type": 'multipart/form-data',
                "Authorization": localStorage.getItem("token")
            },
            'data': formdata[0]
        })
        return resp.data;
    }
    catch (err) {
        return false
    }
}

export const mintDbUpdate = async (payload) => {
    var data = { "data": payload }

    try {
        var resp = await axios({
            "method": "POST",
            "url": `${config.AdminAPI}/token/afterMintUpdate`,
            "data": payload,
            "headers": {
                "Authorization": localStorage.getItem("token")
            }
        })

        console.log("updated data response", resp.data)
        return resp.data;
    }
    catch (err) {
        console.log("err in db updation", err)
    }

}


export const marketTokens = async () => {

    try {
        const resp = await axios({
            'method': 'GET',
            'url': `${config.AdminAPI}/token/getMarketTokens`,

        })

        console.log("response token list", resp.data)
        return resp.data;
    }
    catch (err) {

    }

}


export const hideOrShowToken = async (data) => {
    console.log('data to hide', data)
    try {
        var resp = await axios({
            "method": "POST",
            "url": `${config.AdminAPI}/token/hideshowtokens`,
            "headers": {
                "Authorization": localStorage.getItem("token")
            },
            "data": data,

        })

        console.log("response token visibility", resp.data)
        return resp.data;
    }
    catch (err) { console.log("errin hide show token", err) }

}


export const getTokenOwner = async (data) => {
    var data = { TokenId: data }

    console.log("data tokn id", data)
    try {
        var resp = await axios({

            'method': 'GET',
            'url': `${config.AdminAPI}/getOwner`,
            'params': data


        })
        console.log("tokonwer resp", resp.data)
        return resp.data;
    }
    catch (err) { console.log("err in gettok owner", err) }
}


export const getShowStatus = async (data) => {


    console.log("data tokn id", data)
    try {
        var resp = await axios({

            'method': 'GET',
            'url': `${config.AdminAPI}/token/getHideShow`,
            'params': data


        })
        console.log("tokonwer resp", resp.data)
        return resp.data;
    }
    catch (err) { console.log("err in gettok owner", err) }
}


export const addCategoryCall = async (data) => {
    console.log('data to hide', data)
    try {
        var resp = await axios({
            "method": "POST",
            "url": `${config.AdminAPI}/addcategory`,
            "headers": {
                "Authorization": localStorage.getItem("token")
            },
            "data": data,

        })

        console.log("category added reps", resp.data)
        return resp.data;
    }
    catch (err) { console.log("err in addin category", err) }

}

export const getCatList = async () => {

    try {
        var resp = await axios({

            'method': 'GET',
            'url': `${config.AdminAPI}/getcategory`,
        })
        console.log("tokonwer resp", resp.data)
        return resp.data;
    }
    catch (err) { console.log("err in gettok owner", err) }
}

export const hideShowCat = async (data) => {
    console.log("data cat", data)
    try {
        var resp = await axios({
            "method": "POST",
            "url": `${config.AdminAPI}/hideshowcategory`,
            "headers": {
                "Authorization": localStorage.getItem("token")
            },
            "data": data,
        })

        return resp.data

    } catch (err) {
        console.log("err in hide cat", err)
    }
}


export const addTokenCall = async (data) => {
    console.log("token data", data)
    try {
        const encData = EncryptData(data)
        var resp = await axios({
            "method": "POST",
            "url": `${config.AdminAPI}/addtoken`,
            "headers": {
                "Authorization": localStorage.getItem("token")
            },
            "data": { data: encData },
        })

        return resp.data
    }
    catch (err) {
        console.log('add token err', err)
    }
}


export const getCurrencyList = async () => {

    try {
        var resp = await axios({

            'method': 'GET',
            'url': `${config.AdminAPI}/currencylist`,
        })
        console.log("tokonwer resp", resp.data)
        return resp.data;
    }
    catch (err) { console.log("err in gettok owner", err) }
}



export const editCmsCall = async (data) => {
    console.log("token data", data)
    var formdata = AppenData(data)

    try {
        var resp = await axios({
            "method": "POST",
            "url": `${config.AdminAPI}/editcms`,
            "headers": {
                "Content-Type": 'multipart/form-data',

                "Authorization": localStorage.getItem("token")
            },
            "data": formdata[0],
        })

        return resp.data
    }
    catch (err) {
        console.log('add token err', err)
    }
}



export const getCmsContent = async (data) => {

    try {
        var resp = await axios({

            'method': 'GET',
            'url': `${config.AdminAPI}/getcmslist`,
            params: data
        })
        console.log("tokonwer resp", resp.data)
        return resp.data;
    }
    catch (err) { console.log("err in gettok owner", err) }
}



export const getBurnTokens = async () => {

    try {
        var resp = await axios({

            'method': 'GET',
            'url': `${config.AdminAPI}/token/getburntokens`


        })
        console.log("tokonwer resp", resp.data)
        return resp.data;
    }
    catch (err) { console.log("err in gettok owner", err) }
}


export const getReportTokens = async () => {

    try {
        var resp = await axios({

            'method': 'GET',
            'url': `${config.AdminAPI}/getreporttokens`


        })
        console.log("tokonwer resp", resp.data)
        return resp.data;
    }
    catch (err) { console.log("err in gettok owner", err) }
}



export const manageReportToken = async (data) => {
    try {
        var resp = await axios({
            "method": "POST",
            "url": `${config.AdminAPI}/managereporttoken`,
            "headers": {
                "Authorization": localStorage.getItem("token")
            },
            "data": data,
        })

        return resp.data
    }
    catch (err) {
        console.log('add token err', err)
    }
}



export const tokenReportStatus = async (data) => {

    try {
        var resp = await axios({

            'method': 'GET',
            'url': `${config.AdminAPI}/getreportoftoken`,
            'params': data

        })
        console.log("tokonwer resp", resp.data)
        return resp.data;
    }
    catch (err) { console.log("err in gettok owner", err) }
}

/**  */

export const getDropList = async () => {
    try {
        const resp = await axios({
            'method': 'GET',
            'url': `${config.AdminAPI}/token/getDropList`,

        })
        return resp.data;
    }
    catch (err) {
        return false
    }

}


export const ApproveCAll = async (data) => {
    try {
        console.log("data", data)
        const resp = await axios({
            'method': 'post',
            'url': `${config.AdminAPI}/token/ApproveCAll`,
            'data': data

        })
        return resp.data;
    }
    catch (err) {
        return false
    }

}

export const CreateLazyMint = async (data) => {
    const resp = await axios({
        method: 'post',
        url: `${config.AdminAPI}/token/CreateLazyMint`,
        data: data,

    })
    return resp.data;

}

export const getemailTemplateList = async () => {
    const resp = await axios({
        method: 'get',
        url: `${config.AdminAPI}/getemailtemplate`
    })
    return resp.data;
}

export const editemailTemplateList = async (data) => {
    const resp = await axios({
        method: 'post',
        url: `${config.AdminAPI}/editemailtemplate`,
        data: data,
    })
    console.log(resp.data);
    return resp.data;

}
export const BannerPromotionAction = async (data) => {
    const resp = await axios({
        method: 'post',
        url: `${config.AdminAPI}/bannerpromotionaction`,
        data: data,
    })
    console.log(resp.data);
    return resp.data;
}

//addcmshome
export const addcmshome = async (data) => {
    var formdata = AppenData(data)

    try {
        console.log("data", data)
        const resp = await axios({
            'method': 'post',
            'url': `${config.AdminAPI}/editcms`,
            "headers": {
                "Content-Type": 'multipart/form-data',
                "Authorization": localStorage.getItem("token")
            },
            'data': formdata[0]
        })
        return resp.data;
    }
    catch (err) {
        return false
    }
}

export const onInitialMint = async (data) => {

    try {
        const encData = EncryptData(data)
        var senddata = {
            method: 'POST',
            url: `${config.Back_Url}/front/nft/onInitialMint`,
            data: { data: encData }
        }
        let Resp = await axiosFunc(senddata)
        // console.log("ressspspsp",Resp);
        return Resp
    } catch (e) {
        console.log("onInitialMint error", e);
    }

}

export const Buymint = async (data) => {
    try {
        const encData = EncryptData(data)
        var senddata = {
            method: 'POST',
            url: `${config.Back_Url}/front/nft/Buymint`,
            data: { data: encData }
        }
        let Resp = await axiosFunc(senddata)
        // console.log("ressspspsp",Resp);
        return Resp
    } catch (e) {
        console.log("err on Buymint", e);
    }

}