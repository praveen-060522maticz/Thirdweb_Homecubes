import {model,Schema} from 'mongoose'

const tokenowner    =   new Schema ({
    NFTId                 :   {   type : String , default : ''},
    NFTOwner              :   {   type : String , default : ''},
    HashValue               :   {   type : String , default : ''},
    PutOnSale               :   {   type : String , default : 'false'},
    PutOnSaleType           :   {   type : String , default : 'NotForSale'},
    NFTPrice              :   {   type : String , default : ''},
    CoinName                :   {   type : String , default : ''},
    Status                  :   {   type : String , default : 'list'},
    NFTQuantity           :   {   type : String , default : ''},
    NFTBalance            :   {   type : String , default : ''},
    ClockTime               :   {   type : Date , default : null},
    EndClockTime            :   {   type : Date , default : null},
    HideShow                :   {   type : String , default : "visible"},
    deleted                 :   {   type : Number , default : 0},
    burnToken               :   {   type:Number,default:0},
    Platform                :   {   type:String,default:'our'},
    bannerpromotion         :   {   type:Boolean,default:false},
},{timestamps:true})

module.exports = model ('tokenowner',tokenowner)
