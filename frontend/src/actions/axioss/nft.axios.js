import config from '../../config/config'
import { axiosFunc, AppenData, EncryptData } from '../common'

var token;

export const GetNftCookieToken = () => {
    token = document.cookie.split('; ').reduce((r, v) => {
        const parts = v.split('=')
        // console.log('egfwafwer', parts)
        return parts[0] === "token" ? decodeURIComponent(parts[1]) : r
    }, '');
}

//NFT Name Validation Function
export const nftNameValidation = async (data) => {
    var senddata = {
        method: 'post',
        url: `${config.BACK_URL}/nft/ValidateTokenName`,
        data: data,
        'headers': {
            'Authorization': token
        }
    }
    console.log('jsgfds', senddata)
    let Resp = await axiosFunc(senddata)
    return Resp.data
}
//nftCreate axios
export const nftCreate = async (data) => {
    console.log("UserRegister is Calling", data)
    var formdata = AppenData(data)
    var senddata = {
        method: 'post',
        url: `${config.BACK_URL}/nft/nftcreate`,
        data: formdata[0],
        'headers': {
            'Content-Type': 'multipart/form-data',
            'Authorization': token
        }
    }

    let Resp = await axiosFunc(senddata)
    return Resp.data
}

//Nft Image Upload Function
export const NFTImageUpload = async (data) => {
    var formdata = AppenData(data)
    var senddata = {
        method: 'post',
        url: `${config.BACK_URL}/nft/nftimageupload`,
        data: formdata[0],
        'headers': {
            'Content-Type': 'multipart/form-data',
            'Authorization': token
        }
    }
    let Resp = await axiosFunc(senddata)
    return Resp.data
}

// Create New NFT
export const CreateNFT = async (data) => {
    var senddata = {
        method: 'post',
        url: `${config.BACK_URL}/nft/createnft`,
        data: data,
        'headers': {
            'Authorization': token
        }
    }
    let Resp = await axiosFunc(senddata)
    return Resp.data

}

// Get Category Function
export const Category = async (data) => {

    var senddata = {
        method: 'GET',
        url: `${config.BACK_URL}/nft/getcategory`,
    }
    let Resp = await axiosFunc(senddata)
    return Resp.data
}

//GET All NFT
export const Token_List_Func = async (data) => {
    var senddata = {
        method: 'GET',
        url: `${config.BACK_URL}/nft/Tokenlistfunc`,
        params: data
    }
    let Resp = await axiosFunc(senddata)

    return Resp.data
}

//Get NFT info
export const Token_Info_Func = async (data) => {
    const encData = EncryptData(data)
    var senddata = {
        method: 'GET',
        url: `${config.BACK_URL}/nft/info`,
        params: { data: encData }
    }
    let Resp = await axiosFunc(senddata)

    return Resp
}

//Buy And Accept
export const BuyAccept = async (data) => {
    const encData = EncryptData(data)
    var senddata = {
        method: 'post',
        url: `${config.BACK_URL}/nft/BuyAccept`,
        data: { data: encData },
        'headers': {
            'Authorization': token
        }
    }
    let Resp = await axiosFunc(senddata)
    return Resp
}

//put on Sale
export const CreateOrder = async (data) => {
    const encData = EncryptData(data)
    var senddata = {
        method: 'post',
        url: `${config.BACK_URL}/nft/CreateOrder`,
        data: { data: encData },
        'headers': {
            'Authorization': token
        }

    }
    let Resp = await axiosFunc(senddata)
    return Resp
}

//Bid Function
export const BidApprove = async (FormValue) => {
    console.log('====================================');
    console.log("APPROVECALLLTOKEN", token);
    console.log('====================================');
    const encData = EncryptData(FormValue)
    await GetNftCookieToken();
    var senddata = {
        method: 'post',
        url: `${config.BACK_URL}/nft/BidAction`,
        data: { data: encData },
        'headers': {
            'Authorization': token
        }
    }
    let Resp = await axiosFunc(senddata)
    return Resp
}

export const getnfttaglist = async (data) => {

    var senddata = {
        method: 'GET',
        url: `${config.BACK_URL}/user/getnfttag`,
    }
    let Resp = await axiosFunc(senddata)
    console.log("nfttt", Resp);
    return Resp.data
}
export const Activity_List_Func = async (data) => {
    var senddata = {
        method: 'get',
        url: `${config.BACK_URL}/nft/Activity_List_Func`,
        params: data ?? {}
    }
    let Resp = await axiosFunc(senddata)
    return Resp.data
}
export const Getpromotedtoken = async () => {
    var senddata = {
        method: 'get',
        url: `${config.BACK_URL}/nft/getpromotedtoken`,
    }
    let Resp = await axiosFunc(senddata)
    return Resp.data
}

export const GetNFTOwner = async (data) => {
    var senddata = {
        method: 'post',
        url: `${config.BACK_URL}/nft/getnftowner`,
        data: data
    }
    let Resp = await axiosFunc(senddata)
    return Resp.data
}

export const NftbalanceUpdate = async (data) => {
    const encData = EncryptData(data)
    var senddata = {
        method: 'POST',
        url: `${config.BACK_URL}/nft/findupdatebalance`,
        data: { data: encData }
    }
    let Resp = await axiosFunc(senddata)
    return Resp
}



////////////////////////////////////

export const getCurrentProject = async (data) => {
    const encData = EncryptData(data)
    var senddata = {
        method: 'get',
        url: `${config.BACK_URL}/nft/getCurrentProject`,
        params: { data: encData }
    }
    let Resp = await axiosFunc(senddata)
    // console.log("ressspspsp",Resp);
    return Resp
}

export const onInitialMint = async (data) => {
    const encData = EncryptData(data)
    var senddata = {
        method: 'POST',
        url: `${config.BACK_URL}/nft/onInitialMint`,
        data: { data: encData },
        'headers': {
            'Authorization': token
        }
    }
    let Resp = await axiosFunc(senddata)
    // console.log("ressspspsp",Resp);
    return Resp
}


export const setTokenStatus = async (data) => {
    const encData = EncryptData(data)
    var senddata = {
        method: 'POST',
        url: `${config.BACK_URL}/nft/setTokenStatus`,
        data: { data: encData },
        'headers': {
            'Authorization': token
        }
    }
    let Resp = await axiosFunc(senddata)
    // console.log("ressspspsp",Resp);
    return Resp
}

export const Buymint = async (data) => {
    const encData = EncryptData(data)
    var senddata = {
        method: 'POST',
        url: `${config.BACK_URL}/nft/Buymint`,
        data: { data: encData },
        'headers': {
            'Authorization': token
        }
    }
    let Resp = await axiosFunc(senddata)
    // console.log("ressspspsp",Resp);
    return Resp
}

export const getGallery = async (data) => {
    const encData = EncryptData(data)
    var senddata = {
        method: 'GET',
        url: `${config.BACK_URL}/nft/getGallery`,
        params: { data: encData }
    }
    let Resp = await axiosFunc(senddata)
    // console.log("ressspspsp",Resp);
    return Resp
}

export const getGalleryTokens = async (data) => {
    const encData = EncryptData(data)
    var senddata = {
        method: 'GET',
        url: `${config.BACK_URL}/nft/getGalleryTokens`,
        params: { data: encData }
    }
    let Resp = await axiosFunc(senddata)
    // console.log("ressspspsp",Resp);
    return Resp
}

export const getActivitiesByNftId = async (data) => {
    const encData = EncryptData(data)
    var senddata = {
        method: 'GET',
        url: `${config.BACK_URL}/nft/getActivitiesByNftId`,
        params: { data: encData }
    }
    let Resp = await axiosFunc(senddata)
    // console.log("ressspspsp",Resp);
    return Resp
}

export const searchQueryForMyitems = async (data) => {
    const encData = EncryptData(data)
    var senddata = {
        method: 'GET',
        url: `${config.BACK_URL}/nft/searchQueryForMyitems`,
        params: { data: encData },
        'headers': {
            'Authorization': token
        }
    }
    let Resp = await axiosFunc(senddata)
    // console.log("ressspspsp",Resp);
    return Resp
}

export const getProjects = async (data) => {
    const encData = EncryptData(data)
    var senddata = {
        method: 'GET',
        url: `${config.BACK_URL}/nft/getProjects`,
        params: { data: encData }
    }
    let Resp = await axiosFunc(senddata)
    // console.log("ressspspsp",Resp);
    return Resp
}

export const stackFunction = async (data) => {
    const encData = EncryptData(data)
    var senddata = {
        method: 'post',
        url: `${config.BACK_URL}/nft/stackFunction`,
        data: { data: encData },
        'headers': {
            'Authorization': token
        }
    }
    let Resp = await axiosFunc(senddata)
    // console.log("ressspspsp",Resp);
    return Resp
}

export const setPendingTransaction = async (data) => {
    const encData = EncryptData(data)
    var senddata = {
        method: 'POST',
        url: `${config.BACK_URL}/nft/setPendingTransaction`,
        data: { data: encData },
        'headers': {
            'Authorization': token
        }
    }
    let Resp = await axiosFunc(senddata)
    // console.log("ressspspsp",Resp);
    return Resp
}


export const saveTransaction = async (data) => {
    const encData = EncryptData(data)
    var senddata = {
        method: 'POST',
        url: `${config.BACK_URL}/nft/saveTransaction`,
        data: { data: encData },
        'headers': {
            'Authorization': token
        }
    }
    let Resp = await axiosFunc(senddata)
    // console.log("ressspspsp",Resp);
    return Resp
}