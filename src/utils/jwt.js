import jwt from "jsonwebtoken"
const createJWT = (data) => {
    return jwt.sign(data, process.env.JWT_SECRET_KEY);
}

const verifyToken = async (token) => {
    return await new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET_KEY, (error, data) => {
            if (error) return reject(error.message)
            resolve(data)
        })
    })


}

export { createJWT, verifyToken }