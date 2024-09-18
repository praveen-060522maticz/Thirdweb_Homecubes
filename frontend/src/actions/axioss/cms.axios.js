import config from '../../config/config'
import { axiosFunc, AppenData, EncryptData } from '../common'

export const Category = async (data) => {
    var senddata = {
        method: 'GET',
        url: `${config.ADMIN_URL}/getcategory`,
    }
    let Resp = await axiosFunc(senddata)
    return Resp.data
}
export const Currency = async (data) => {
    var senddata = {
        method: 'get',
        url: `${config.ADMIN_URL}/currencylist`
    }
    let Resp = await axiosFunc(senddata)
    return Resp
}
export const USDPRICE = async (data) => {
    var senddata = {
        'method': 'get',
        'url': `https://min-api.cryptocompare.com/data/price?fsym=${data}&tsyms=USD`,
    }
    let Resp = await axiosFunc(senddata);

    return Resp.data?.USD;
}
export const TOKENPRICE = async (data) => {
    var senddata = {
        'method': 'get',
        'url': `https://api.pancakeswap.info/api/v2/tokens/${data}`,
    }
    let Resp = await axiosFunc(senddata);

    return Resp?.data?.data?.price;
}
export const getCmsContent = async (data) => {
    // console.log('dataaaaa',data)
    const encData = EncryptData(data)
    try {
        var resp = await axiosFunc({

            'method': 'GET',
            'url': `${config.ADMIN_URL}/getcmslist`,
            'params': { data: encData }
        })
        // console.log("tokonwer resp",resp.data)
        return resp
    }
    catch (err) { console.log("err in gettok owner", err) }

}

export const getarticle = async (data) => {
    try {
        var resp = await axiosFunc({
            "method": "get",
            "url": `${config.ADMIN_URL}/getarticle`,
            "params": data
        })
        return resp.data
    }
    catch (err) {
        throw err
    }
}

export const getabouuser = async (data) => {
    try {
        var resp = await axiosFunc({
            "method": "get",
            "url": `${config.ADMIN_URL}/getaboutuser`,
            "params": data
        })
        return resp.data
    }
    catch (err) {
        throw err
    }
}


export const getNewsFeedsFunc = async (data) => {
    const encData = EncryptData(data)
    try {
        var resp = await axiosFunc({
            "method": "post",
            "url": `${config.ADMIN_URL}/newsAndFeed`,
            "data": { data: encData }
        })
        return resp
    }
    catch (err) {
        throw err
    }
}


export const blogsFunction = async (data) => {
    // const encData = AppenData(data)
    console.log("datadata", data);
    const encData = AppenData(data)
    try {
        var resp = await axiosFunc({
            "method": "post",
            'url': `${config.ADMIN_URL}/blogsFunction`,
            "data": encData[0],
            "headers": {
                "Authorization": localStorage.getItem("token")
            }
        })

        return resp

    }
    catch (err) { console.log("err".err) }

}



export const getblogCategories = async (data) => {
    // const encData = AppenData(data)
    console.log("datadata", data);
    const encData = EncryptData(data)
    try {
        var resp = await axiosFunc({
            "method": "get",
            'url': `${config.ADMIN_URL}/blogCategories`,
            "params": { data: encData },
            "headers": {
                "Authorization": localStorage.getItem("token")
            }
        })

        return resp

    }
    catch (err) { console.log("err".err) }

}