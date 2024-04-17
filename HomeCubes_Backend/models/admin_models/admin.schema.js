
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const AdminSchema = new Schema({

    email: {
        type: String,
        required: true
    },
    hashpassword: {
        type: String,
        required: true
    },
    Type: {
        type: String,
        default: ""
    },
    deleted: {
        type: Boolean,
        default: false
    }

})


const Admin = mongoose.model("admin", AdminSchema, "admin");
export default Admin;