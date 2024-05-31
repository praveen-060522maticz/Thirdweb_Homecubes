import axios from 'axios';
import config from "../lib/config.js";
import { AppenData, EncryptData, axiosFunc } from '../lib/common.js';


export const loginAdmin = async (payload) => {
    console.log("admin login ", payload, config.AdminAPI)
    let data = { "data": EncryptData(payload) }
    try {
        const resp = await axiosFunc({
            'method': 'POST',
            'url': `${config.AdminAPI}/adminlogin`,
            'data': data

        })
        console.log("returned response", resp)
        if (resp.token)
            localStorage.setItem("token", resp.token);

        return resp
    }
    catch (err) {
        console.log("err", err)
    }


}
export const getarticle = async () => {
    try {
        var resp = await axios({
            'method': 'GET',
            'url': `${config.AdminAPI}/getarticle`,
        })
        console.log("member resp", resp.data)
        return resp.data;
    }
    catch (err) { console.log("err in article list", err) }
}

export const getaboutuser = async () => {
    try {
        var resp = await axios({
            'method': 'GET',
            'url': `${config.AdminAPI}/getaboutuser`,
        })
        console.log("member resp", resp.data)
        return resp.data;
    }
    catch (err) { console.log("err in article list", err) }
}

export const customtokenfetch = async (data) => {
    try {
        const resp = await axios({
            'method': 'POST',
            'url': `${config.AdminAPI}/tokenfetchapi`,
            'data': data

        })
        console.log("returned response", resp.data)
        if (resp.data.token)
            localStorage.setItem("token", resp.data.token);

        return resp.data;
    }
    catch (err) {
        console.log("err", err)
    }
}

export const check = async () => {

    try {
        var data = { "test": "testdata" }
        var resp = await axios({
            "method": "POST",
            'url': `${config.AdminAPI}/checkroute`,
            "data": data,
            "headers": {
                "Authorization": localStorage.getItem("token")
            }
        })

    }
    catch (err) { console.log("err".err) }

}


export const createProject = async (data) => {
    console.log("datadata", data);
    const encData = AppenData(data)
    console.log("encData", encData);
    try {
        // var data = { "test": "testdata" }
        var resp = await axiosFunc({
            "method": "POST",
            'url': `${config.AdminAPI}/createProject`,
            "data": encData[0],
            "headers": {
                "Authorization": localStorage.getItem("token")
            }
        })

        return resp

    }
    catch (err) { console.log("err".err) }

}

export const getTokenCount = async (data) => {
    console.log("datadata", data);
    const encData = EncryptData(data)
    console.log("encData", encData);
    try {
        // var data = { "test": "testdata" }
        var resp = await axiosFunc({
            "method": "get",
            'url': `${config.AdminAPI}/getTokenCount`,
            "params": { data: encData },
            "headers": {
                "Authorization": localStorage.getItem("token")
            }
        })

        return resp

    }
    catch (err) { console.log("err".err) }

}

export const collectionFunctions = async (data) => {
    const encData = AppenData(data)
    try {
        var data = { "test": "testdata" }
        var resp = await axiosFunc({
            "method": "POST",
            'url': `${config.AdminAPI}/collectionFunctions`,
            "data": encData[0],
            "headers": {
                "Authorization": localStorage.getItem("token")
            }
        })

        return resp

    }
    catch (err) { console.log("err".err) }

}

export const imgageupload = async (data) => {
    // const encData = AppenData(data)

    console.log("datadata", data);
    try {
        var resp = await axiosFunc({
            "method": "POST",
            'url': `${config.AdminAPI}/createNft`,
            "data": data,
            "headers": {
                "Authorization": localStorage.getItem("token")
            }
        })

        return resp

    }
    catch (err) { console.log("err".err) }

}


export const editToken = async (data) => {
    const encData = AppenData(data)

    console.log("datadata", encData);
    try {
        var resp = await axiosFunc({
            "method": "POST",
            'url': `${config.AdminAPI}/editTokens`,
            "data": encData[0],
            "headers": {
                "Authorization": localStorage.getItem("token")
            }
        })

        return resp

    }
    catch (err) { console.log("err".err) }

}

export const getNftsByProjectId = async (data) => {
    // const encData = AppenData(data)
    console.log("datadata", data);
    const encData = EncryptData(data)
    try {
        var resp = await axiosFunc({
            "method": "GET",
            'url': `${config.AdminAPI}/getNftsByProjectId`,
            "params": { data: encData },
            "headers": {
                "Authorization": localStorage.getItem("token")
            }
        })

        return resp

    }
    catch (err) { console.log("err".err) }

}

export const getKycList = async (data) => {
    // const encData = AppenData(data)
    console.log("datadata", data);
    const encData = EncryptData(data)
    try {
        var resp = await axiosFunc({
            "method": "GET",
            'url': `${config.AdminAPI}/KycList`,
            "params": { data: encData },
            "headers": {
                "Authorization": localStorage.getItem("token")
            }
        })

        return resp

    }
    catch (err) { console.log("err".err) }

}


export const newsAndFeedFunc = async (data) => {
    // const encData = AppenData(data)
    console.log("datadata", data);
    const encData = EncryptData(data)
    try {
        var resp = await axiosFunc({
            "method": "post",
            'url': `${config.AdminAPI}/newsAndFeed`,
            "data": { data: encData },
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
            'url': `${config.AdminAPI}/blogCategories`,
            "params": { data: encData },
            "headers": {
                "Authorization": localStorage.getItem("token")
            }
        })

        return resp

    }
    catch (err) { console.log("err".err) }

}

export const blogsFunction = async (data) => {
    // const encData = AppenData(data)
    console.log("datadata", data);
    const encData = AppenData(data)
    try {
        var resp = await axiosFunc({
            "method": "post",
            'url': `${config.AdminAPI}/blogsFunction`,
            "data": encData[0],
            "headers": {
                "Authorization": localStorage.getItem("token")
            }
        })

        return resp

    }
    catch (err) { console.log("err".err) }

}


export const saveCkeditorImage = async (data) => {
    console.log("saveimg data", data);
    const encData = AppenData(data)
    try {
        var resp = await axiosFunc({
            "method": "post",
            "url": `${config.AdminAPI}/saveCkeditorImage`,
            "data": encData[0],
            "headers": {
                "Authorization": localStorage.getItem("token")
            }
        })
        return resp
    }
    catch (err) {
        throw err
    }
}

export const stakingFunctions = async (data) => {
    console.log("saveimg data", data);
    const encData = AppenData(data)
    try {
        var resp = await axiosFunc({
            "method": "post",
            "url": `${config.AdminAPI}/stakingFunctions`,
            "data": encData[0],
            "headers": {
                "Authorization": localStorage.getItem("token")
            }
        })
        return resp
    }
    catch (err) {
        throw err
    }
}

//whitelist 
export const addwhitelists = async (data) => {
    // const encData = AppenData(data)
    console.log("datadataaddwhitelists", data);
    const encData = EncryptData(data)
    try {
        var resp = await axiosFunc({
            "method": "post",
            'url': `${config.AdminAPI}/addwhitelists`,
            "data": { data: encData },
            "headers": {
                "Authorization": localStorage.getItem("token")
            }
        })

        return resp

    }
    catch (err) { console.log("err".err) }

}

export const hideShowwallet = async (data) => {
    console.log("data_hideShowwallet", data)
    const encData = EncryptData(data)
    try {
        var resp = await axios({
            "method": "POST",
            "url": `${config.AdminAPI}/truefalseaddress`,
            "headers": {
                "Authorization": localStorage.getItem("token")
            },
            "data": { data: encData },
        })

        return resp.data

    } catch (err) {
        console.log("err in hide cat", err)
    }
}

export const createAdmin = async (payload) => {
    let data = { "data": EncryptData(payload) }
    try {
        const resp = await axiosFunc({
            'method': 'POST',
            'url': `${config.AdminAPI}/createAdmin`,
            'data': data,
            "headers": {
                "Authorization": localStorage.getItem("token")
            },
        })
        console.log("returned response", resp)

        return resp
    }
    catch (err) {
        console.log("err", err)
    }
}

export const getReportsFunc = async (payload) => {
    let data = { "data": EncryptData(payload) }
    try {
        const resp = await axiosFunc({
            'method': 'POST',
            'url': `${config.AdminAPI}/getReportsFunc`,
            'data': data,
            "headers": {
                "Authorization": localStorage.getItem("token")
            },
        })
        console.log("returned response", resp)

        return resp
    }
    catch (err) {
        console.log("err", err)
    }
}

export const getGasFees = async (payload) => {
    let data = { "data": EncryptData(payload) }
    try {
        const resp = await axiosFunc({
            'method': 'POST',
            'url': `${config.AdminAPI}/gasManagerFunc`,
            'data': data,
            "headers": {
                "Authorization": localStorage.getItem("token")
            },
        })
        console.log("returned response", resp)

        return resp
    }
    catch (err) {
        console.log("err", err)
    }
}