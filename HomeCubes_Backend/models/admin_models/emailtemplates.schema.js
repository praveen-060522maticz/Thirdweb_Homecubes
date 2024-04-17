import { Schema , model } from "mongoose";

const emailtemplate = Schema({
    Type:{
        type:String,
        default:''
    },
    Content:{
        type:String,
        default:''
    },
},{timestamps:true})

module.exports = model('emailtemplate',emailtemplate);