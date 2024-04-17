import { Schema,model } from "mongoose";
const referral  =   Schema({
    numberOfrefers  :   {   type : Number , default : 0},
    // planID          :   {   type : String , defaul   t : `${Math.floor(1000 + Math.random() * 9000)}`},
    earnPersentage  :   {   type : Number , default : 0}
},{timestamps:true})

module.exports = model('referral',referral)
