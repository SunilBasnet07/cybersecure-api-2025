import geminiAiResponse from "../api/gemini.js";
import User from "../model/User.js"

const crateUser=async(data)=>{
 return await User.create(data);
}
const getAllUsers = async()=>{
    return await User.find({});
}
const getUserById = async(id)=>{
    return await User.findById(id);
}
const updateUser = async(id,data)=>{
    return await User.findByIdAndUpdate(id,data,{new:true});
}
const askToAssistance =async(userId,command)=>{
   
     const user =  await User.findById({_id:userId});

    return  await geminiAiResponse(command,user?.assistanceName,user?.name)

}
export default {crateUser,getAllUsers,getUserById,askToAssistance,updateUser} 