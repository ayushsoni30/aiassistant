import mongoos from "mongoose" 

const userSchema=new mongoose.Schema({
    name:{
        type:string ,
        required:true
    },
    email:{
        type:string ,
        required:true,
        unique:true
    },
    password:{
        type:string ,
        required:true,
    },
    assistantName:{
        type:string
    },
    assistantImage:{
        type:string
    },
    history:[
        {type:string}
    ]

},{timestamp:true})

const User=mongoose.model("User", userSchema)
export default User