import getRandomString from "../utils/string.js";

const getCaptchaGenerate = (req, res) => {
  try {
    const num1 = Math.floor(Math.random() * 10);
    const num2 = Math.floor(Math.random() * 10);
    const question = `${num1} + ${num2} = ?`;
    const answer = num1 + num2;
    res.json({ question, answer });
  
  } catch (error) {
    res.status(500).send(error.message);
  }
}
const getStringCaptchaGenerate = (req, res) => {
  try {
    const question = getRandomString();
    const answer = question;
    res.send({ question, answer });
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export { getCaptchaGenerate, getStringCaptchaGenerate }