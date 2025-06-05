import { userFormatterData } from "../helpers/formatter.js";
import authService from "../services/authService.js";
import { createJWT } from "../utils/jwt.js";



const login = async (req, res) => {
    const data = req.body;

    try {

        if (!data.email && !data.password) return res.status(422).send("Email and Password is required.")
        if (!data.email) return res.status(422).send("Email is required.")
        if (!data.password) return res.status(422).send("Password is required.")
        
            if (parseInt(data?.captchaAnswer) && parseInt(data?.captchaAnswer) !== parseInt(data?.correctAnswer)) {
                return res.status(400).json('CAPTCHA answer failed');
            }
        

        const user = await authService.login(data);
        const formatterUserData = userFormatterData(user);
        const token = createJWT(formatterUserData);
        res.cookie("authToken", token);

        res.json({ ...formatterUserData, token });
    } catch (error) {
        res.status(500).send(error.message);
    }
}
const register = async (req, res) => {
    const data = req.body;

    try {
        const correctAnswer = data?.correctAnswer;
        const captchaAnswer = data?.captchaAnswer;
        const usernameStart = data.name.slice(0, 5).toLowerCase();
        const emailStart = data.email.slice(0, 5).toLowerCase();
        const lowerPassword = data.password.toLowerCase();
        if (captchaAnswer !== correctAnswer) {
            return res.status(400).send('Invalid captcha answer.');
        }
        if (lowerPassword.includes(usernameStart)) {
            return res.status(422).send("Password should not contain first 5 charaters of username or email.")

        }
        if (lowerPassword.includes(emailStart)) {
            return res.status(422).send("Password should not contain first 5 charaters of username or email.")

        }


        if (!data.name && !data.email && !data.password && !data.confirmPassword) return res.status(422).send("All empty fields are required.")
        if (!data.name) return res.status(422).send("Name is required.")
        if (!data.email) return res.status(422).send("Email is required.")
        if (!data.password) return res.status(422).send("Password is required.")
        if (!data.confirmPassword) return res.status(422).send("confirmPassword is required.")
        const user = await authService.register(data);
        const formatterUserData = userFormatterData(user);
        const token = createJWT(formatterUserData);
        res.cookie("authToken", token);

        res.json({ ...formatterUserData, token });
        // res.json({message: "User created successfully, please check your email form OTP verification."})
    } catch (error) {
        res.status(error.statusCode || 500).send(error.message);
    }
}
const verifiedOTPEmail = async (req, res) => {
    const userId = req.user;
    const data = req.body;
    const otp = data.otp?.otp;
    console.log(otp);

    try {

        // if (!data.email && !data.otp) return res.status(422).send("Email and OTP is required.")
        // if (!data.email) return res.status(422).send("Email is required.")
        if (!data.otp) return res.status(422).send("OTP is required.")


        const user = await authService.verifiedOTPEmail(userId, otp);
        // const formatterUserData = userFormatterData(user);
        // const token = createJWT(formatterUserData);
        // res.cookie("authToken", token);

        res.json(user);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

const forgotPassword = async (req, res) => {
    const email = req.body;
    try {
        const response = await authService.forgotPassword(email)
        res.json(response);

    } catch (error) {
        res.status(500).send(error.message);
    }
}
const resetPassword = async (req, res) => {
    const data = req.body;
    const id = req.params.id;
    const otp = req.query?.otp;
    try {

        if (!data.password) return res.status(422).send("Password is required.")
        if (!data.confirmPassword) return res.status(422).send("confirmPassword is required.")
        const response = await authService.resetPassword(id, otp, data);
        res.json(response);

    } catch (error) {
        res.status(500).send(error.message);
    }
}

export { login, register, verifiedOTPEmail, forgotPassword, resetPassword }