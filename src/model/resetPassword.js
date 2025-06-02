import mongoose from "mongoose";
const resetPasswordSchema = mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    token:{
        type:String,
        required:true,
    },
    isUsed:{
        type:Boolean,
        default:false,
    },
    expiresAt:{
        type:Date,
        default: () => new Date(Date.now() + 300000),
    }

})
const ResetPassword = mongoose.model("ResetPassword",resetPasswordSchema)
export default ResetPassword;