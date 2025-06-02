import express from "express";
import dotenv from "dotenv"
import connectDB from "./config/database.js";
import userRoute from "./routes/userRoutes.js";
import bodyParser from "body-parser";
import authRoute from "./routes/authRoutes.js";
import captchaRoute from "./routes/captchaRoutes.js";
import cors from "cors";
const app = express();
dotenv.config();
connectDB();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors());



app.get("/", (req, res) => {
    res.send({
        "name": "ai_backend",
        "version": "1.0.0",
        "main": "index.js",
        "type": "module",
    })
})

app.use("/api/users",userRoute);
app.use("/api/auth",authRoute);
app.use("/api/captcha",captchaRoute);

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Surver is connected at port ${port}`)
})

