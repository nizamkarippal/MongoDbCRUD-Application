const mongoose = require('mongoose');
mongoose.connect("mongodb://127.0.0.1:27017/TodologinsignUp")
.then(()=>{
    console.log("connected to mongo db");
}).catch(()=>{
    console.log("error in connecting to mongo db");
})

const LoginSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})
const todoSchema = new mongoose.Schema({
    userId : {
          type:String,
          required:true
    },
    title:{
          type:String,
          required:true
    },
    description:{
          type:String,
          required:true
    },
    completed:{
          type:String,
          default :false
    }
})

const collection = new mongoose.model("Logincollection",LoginSchema)
const collection2 = new mongoose.model("Todo", todoSchema)
module.exports = {collection, collection2};
//

 

 

 