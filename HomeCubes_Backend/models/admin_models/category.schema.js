
import mongoose from  'mongoose';

const Schema = mongoose.Schema;

const CategorySchema = new Schema({

    name: {
        
        type: String,
        required:true
    },
    description : {
        
        type: String,
        required:true
    },
    hideShow : {
        
        type: String,
        default:"visible"
    },
  
  
})


const Category = mongoose.model("category", CategorySchema, "category");
export default Category;