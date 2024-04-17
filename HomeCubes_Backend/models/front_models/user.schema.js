import { Schema,model } from "mongoose";
const user  =   Schema({
    _id             :   {   type : String , required: true},
    DisplayName     :   {   type : String , default : ''},
    EmailId         :   {   type : String , default : ''},
    Youtube         :   {   type : String , default : ''},
    Facebook        :   {   type : String , default : ''},
    Twitter         :   {   type : String , default : ''},
    Instagram       :   {   type : String , default : ''},
    WalletAddress   :   {   type : String , default : ''},
    WalletType      :   {   type : String , default : ''},
    Profile         :   {   type : String , default : ''},
    Cover           :   {   type : String , default : ''},
    Bio             :   {   type : String , default : ''},
    initialBuy      :   {   type : Boolean , default : false},
    CustomUrl       :   {   type : String , default : ''}, //username
    KycStatus       :   {   type : String , default : 'false'},
    Address         :   {   type : String , default : ''},
    mobileNumber    :   {   type : String , default : ''},
    Nationality     :   {   type : String , default : ''},
    termsAccepted   :   {   type : Boolean , default : false},
    kycFile         :   {   type : String , default : ''},
    comment         :   {   type : String , default : ''},
    parentAddress   :   {   type : String , default : ''},
    Follower        :   {   type    :   Array,default   :   [{
        Address     :   '',
        CustomUrl  :   ''
    }]},
    Following       :   {   type    :   Array,default   :   [{
        Address     :   '',
        CustomUrl  :   ''
    }]},

},{timestamps:true})

module.exports = model('user',user)
