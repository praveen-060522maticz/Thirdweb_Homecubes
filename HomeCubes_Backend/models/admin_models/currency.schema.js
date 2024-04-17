import {Schema,model} from 'mongoose'

const currency  =   new Schema({
    ChainId              : {type : String , default : ""},
     CurrencyDetails       :   {   type : Array , default : []},
},{timestamps:true})

module.exports = model('currency',currency)