// import package
import mongoose from 'mongoose';


const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const SubscriberSchema = new Schema({
	email : {
        type : String,
        default : ''
    },
    maySent : {
        type : Boolean,
        default : true
    },

},{timestamps:true});


module.exports = mongoose.model("subscribers", SubscriberSchema, "subscribers");