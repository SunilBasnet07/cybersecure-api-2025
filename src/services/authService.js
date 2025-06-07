import User from "../model/User.js"
import bcrypt from "bcrypt"
import resendEmail from "../utils/resent.js";
import ResetPassword from "../model/resetPassword.js";

// const login = async ({ email, password }) => {
//     const MAX_ATTEMPTS = 2;
//     const LOCK_TIME = 1 * 60 * 1000; // 15 minutes
//     const user = await User.findOne({ email: email });

//     if (!user) {
//         throw {
//             statusCode: 403,
//             message: "User not found."
//         }
//     }
//     if (!user || !user?.isVerified) {
//         throw {
//             statusCode: 403,
//             message: "Email not verified. Please verify OTP."
//         }
//     }


//     if (user.isLocked) {
//         if (new Date() > user.lockUntil) {
//             // Unlock the user
//             user.isLocked = false;
//             user.failedLoginAttempts = 0;
//             user.lockUntil = null;
//             await User.findByIdAndUpdate({isLocked:false,failedLoginAttempts:0,lockUntil:null});

//         } else {
//             throw {
//                 statusCode: 403,
//                 message: "Account is locked. Try later."
//             }
//         }
//     }




//     const isPasswordMatched = bcrypt.compareSync(password, user?.password)
//     if (!isPasswordMatched) {
//         user.failedLoginAttempts += 1;
//         if (user.failedLoginAttempts >= MAX_ATTEMPTS) {
//             user.isLocked = true;
//             user.lockUntil = new Date(Date.now() + LOCK_TIME);
//             await user.save();
//             // await sendLockEmail(user.email);
//             return res.status(403).json({ message: "Account locked. Email sent." });
//         }

//         await user.save();
//         throw { 
//             statusCode: 403,
//             message: "Email and Password do not matched."
//         }
//     }
//     user.failedLoginAttempts = 0;
//     user.isLocked = false;
//     user.lockUntil = null;
//    if(user.lockUntil>LOCK_TIME){

//    }

//     return user;
// }
const login = async ({ email, password }) => {
    const MAX_ATTEMPTS = 4;
    const LOCK_TIME = 1 * 60 * 1000; // 1 minutes

    const user = await User.findOne({ email });

    if (!user) {
        throw {
            statusCode: 403,
            message: "User not found."
        };
    }

    if (!user.isVerified) {
        throw {
            statusCode: 403,
            message: "Email not verified. Please verify OTP."
        };
    }

    if (user.isLocked) {
        if (new Date() > user.lockUntil) {
            // Unlock account
            await User.findByIdAndUpdate(user._id, {
                isLocked: false,
                failedLoginAttempts: 0,
                lockUntil: null
            });
            user.isLocked = false;
            user.failedLoginAttempts = 0;
            user.lockUntil = null;
        } else {
            throw {
                statusCode: 403,
                message: "Account is locked. Try again later.",
                lockUntil: user?.lockUntil
            };
        }
    }

    const isPasswordMatched = bcrypt.compareSync(password, user.password);
    if (!isPasswordMatched) {
        user.failedLoginAttempts += 1;

        if (user.failedLoginAttempts >= MAX_ATTEMPTS) {
            user.isLocked = true;
            user.lockUntil = new Date(Date.now() + LOCK_TIME);
            await user.save();
            // await sendLockEmail(user.email);
            const subject = "Account Locked Due to Multiple Failed Login Attempts"
            const body = `
                  Hi ${user?.name},<br><br>
                  We noticed multiple failed login attempts to your account. <strong>${user?.email}</strong> <br>
                   As a precaution, your account has been locked for 2 minutes.<br><br>
                   If this wasn't you, please reset your password or contact support.<br><br>
                   Stay safe,<br>
                   The Security Team
                    `;


            // const body = `${process.env.LOCAL_URL}/auth/reset-password/${resetPassword?.userId}?otp=${resetPassword?.token}`
            await resendEmail(user?.email, { subject, body, }, user?.name)
            throw {
                statusCode: 403,
                message: "Account locked. Email sent."
            };
        }

        await user.save();
        throw {
            statusCode: 403,
            message: "Email and Password do not match."
        };
    }

    // Successful login
    user.failedLoginAttempts = 0;
    user.isLocked = false;
    user.lockUntil = null;
    await user.save();

    return user;
};




const register = async (data) => {

    const { name, email, password } = data;
    const otp = Math.floor(Math.random() * 1000000);
    const user = await User.findOne({ email: data.email });

    if (user?.isVerified) {
        throw {
            statusCode: 403,
            message: "User already exist."
        }
    }
    const subject = "OTP Verification";
    const body = `Your OTP is : <strong>${otp}<strong>`;
    await resendEmail(email, { subject, body });
    const hashedPassword = bcrypt.hashSync(password, 10)


    return await User.create({ name, email, password: hashedPassword, otp, });

    // return { message: "User created successfully, please check your email form OTP verification." }
}


const verifiedOTPEmail = async (userId, otp) => {

    const user = await User.findOne({ email: userId.email, otp: otp });



    if (!user) {
        throw {
            statusCode: 403,
            message: "User not found."
        }
    }
    if (user.otp !== otp) {
        throw {
            statusCode: 403,
            message: "Invalid OTP"
        }
    }
    if (user.expireAt < Date.now()) {
        throw {
            statusCode: 404,
            message: "OTP expired"
        }
    }





    await User.findByIdAndUpdate(user._id, { isVerified: true });
    return { message: "Email verified Successfyll. now you can login." }

}

const resendOTPEmail = async (userId) => {
    console.log("loginUser=", userId)
    const user = await User.findOne({ email: userId.email, otp: userId.otp });
    console.log("user=", user);
    if (!user) {
        throw {
            statusCode: 403,
            message: "User not found."
        }
    }
    if (user.otp !== userId.otp) {
        throw {
            statusCode: 403,
            message: "Invalid OTP"
        }
    }
    // if (user.expireAt < Date.now()) {
    //     throw {
    //         statusCode: 404,
    //         message: "OTP expired"
    //     }
    // }
    const newOTP = Math.floor(Math.random() * 1000000);
    const expireAt = Date.now() + 10 * 60 * 1000;
    if (expireAt < Date.now()) {
        throw {
            statusCode: 404,
            message: "OTP expired"
        }
    }
    const subject = "OTP Verification";
    const body = `Your OTP is : <strong>${newOTP}<strong>`;
    await resendEmail(user.email, { subject, body }, user.name);
    return await User.findByIdAndUpdate(user._id, { otp: newOTP, expireAt }, { new: true });

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
    await resendEmail(user.email, { subject, body, }, user.name)
    return { message: "Reset password link has been successfull to your email" };

}

const resetPassword = async (id, otp, { password }) => {

    const resetUser = await ResetPassword.findOne({ userId: id, token: otp });

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
    const hashedPassword = bcrypt.hashSync(password, 10)
    await User.findByIdAndUpdate(resetUser?.userId, { password: hashedPassword })
    await ResetPassword.findByIdAndUpdate(resetUser._id, { isUsed: true })
    return { message: "Password reset successfully." }


}




export default { login, register, verifiedOTPEmail, forgotPassword, resetPassword, resendOTPEmail };