import { userFormatterData } from "../helpers/formatter.js";
import userService from "../services/userService.js";
import moment from "moment";
const createUser = async(req, res) => {
    const data = req.body;
    try {
        const user = await userService.crateUser(data);
        res.json(user);
    } catch (error) {
       res.status(500).send(error.message);
    }
}
const getAllUsers = async(req, res) => {
   
    
   
    try {
        const user = await userService.getAllUsers();
        res.json(user);
    } catch (error) {
       res.status(500).send(error.message);
    }
}
const getUserById = async(req, res) => {
   const id = req.params.id;
    try {
        const user = await userService.getUserById(id);
        const formatterUserData = userFormatterData(user);
        res.json(formatterUserData);
    } catch (error) {
       res.status(500).send(error.message);
    }
}

const updateUser = async(req, res) => {
   const id = req.params.id;
   const data=req.body;
    try {
        const updatedUser = await userService.updateUser(id,data);
        const formatterUserData = userFormatterData(updatedUser);
        res.json(formatterUserData);
    } catch (error) {
       res.status(500).send(error.message);
    }
}
const askToAssistance = async(req, res) => {
   const userId = req.user.id;
   const command = req.body;
    try {
        const response = await userService.askToAssistance(userId,command);
        const  jsonMatch = response.match(/{[\s\S]*}/);
        if(!jsonMatch){
            return res.status(400).json({respone:"Sorry, I can't understand your request."});
        }
      const gemResult = JSON.parse(jsonMatch[0]);
      const type = gemResult.type;
      switch(type){
           case 'get-date':
            return res.json({
                type,
                userInput: gemResult.userInput,
                response:`current date is ${moment().format('MMMM Do YYYY')}`
            });
              case 'get-time':
            return res.json({
                type,
                userInput: gemResult.userInput,
                response:`current time is ${moment().format('h:mm A')}`
            });
              case 'get-day':
            return res.json({
                type,
                userInput: gemResult.userInput,
                response:`Today is ${moment().format('dddd')}`
            });
              case 'get-month':
            return res.json({
                type,
                userInput: gemResult.userInput,
                response:`Today is ${moment().format('MMMM')}`
            });
            case 'google-search':
            case 'youtube-search':
            case 'youtube-play':
            case 'general':
            case 'calculator-open':
            case 'instagram-open':
            case 'facebook-open':
            case 'weather-show':
          return res.json({
            type,
            userInput: gemResult.userInput,
            response:gemResult.response
          });
          default:
            return res.status(400).json({response:"Sorry, I didn't understand that command."})

      }
   
       
    } catch (error) {
       res.status(500).send(error.message);
    }
}

export { createUser,getAllUsers,getUserById,askToAssistance ,updateUser}