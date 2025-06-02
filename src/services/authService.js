import User from "../model/User.js"
import bcrypt from "bcrypt"
import resendEmail from "../utils/resent.js";
import ResetPassword from "../model/resetPassword.js";

const login = async ({ email, password }) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw {
            statusCode: 403,
            message: "User not found."
        }
    }
    if (!user?.isVerified) {
        throw {
            statusCode: 403,
            message: "Email not verified. Please verify OTP."
        }
    }
    const isPasswordMatched = bcrypt.compareSync(password, user.password)
    if (!isPasswordMatched) {
        throw {
            statusCode: 403,
            message: "Email and Password do not matched."
        }
    }
    return user;
}
const register = async (data) => {

    const { name, email, password } = data;
    const otp = Math.floor(Math.random() * 1000000);
    const user = await User.findOne({ email: data.email });
    if (user || user?.isVerified) {
        throw {
            statusCode: 403,
            message: "User already exist."
        }
    }
    const subject = "OTP Verification";
    const body = `Your OTP is : <strong>${otp}<strong>`;
    await resendEmail(email, { subject, body, name });
    const hashedPassword = bcrypt.hashSync(password, 10)


    return await User.create({ name, email, password: hashedPassword, otp, });

    // return { message: "User created successfully, please check your email form OTP verification." }
}


const verifiedOTPEmail = async (userId, otp) => {
  console.log(userId,otp)
    const user = await User.findOne({ email: userId.email });
    // const users = await User.find({email: userId.email });



    if (!user) {
        throw {
            statusCode: 403,
            message: "User not found."
        }
    }
    if (user.expireAt < Date.now()) {
        throw {
            statusCode: 404,
            message: "OTP expired"
        }
    }

    if (user.otp !== otp) {
        throw {
            statusCode: 403,
            message: "Invalid OTP"
        }
    }



    await User.findByIdAndUpdate(user._id, { isVerified: true });
    return { message: "Email verified Successfyll. now you can login." }

}

const forgotPassword = async ({ email }) => {

    const user = await User.findOne({ email: email });
    const otp = Math.floor(Math.random() * 1000000);
    if (!user) {
        throw {
            statusCode: 403,
            message: "User not found."
        }
    }

    const resetPassword = await ResetPassword.create({ userId: user?._id, token: otp })
   
    const subject = "Reset password verification link"
    const body = `${process.env.LOCAL_URL}/auth/reset-password/${resetPassword?.userId}?otp=${resetPassword?.token}`
     await resendEmail(user.email,{subject,body })
    return { message: "Reset password link has been successfull to your email" };

}

const resetPassword = async (id,otp,{password}) => {

    const resetUser = await ResetPassword.findOne({userId:id,token:otp});

    if (otp !== resetUser?.token || resetUser.isUsed) {
        throw {
            statusCode: 401,
            message: "Inviled OTP"
        }
    }
    if (resetUser.expireAt < Date.now()) {
        throw {
            statusCode: 401,
            message: "Token expired"
        }
    }
    const hashedPassword= bcrypt.hashSync(password,10)
    await User.findByIdAndUpdate(resetUser?.userId, { password: hashedPassword })
    await ResetPassword.findByIdAndUpdate(resetUser._id,{isUsed:true})
    return {message:"Password reset successfully."}


}




export default { login, register, verifiedOTPEmail, forgotPassword, resetPassword };