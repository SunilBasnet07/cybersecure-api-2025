import axios from "axios"

const geminiAiResponse = async(command, assistantName, userName) => {
    console.log(command,assistantName,userName)
    const prompt = `You are a virtual Assistance name ${assistantName} created by ${userName}.
    You are not Google. You will now behave like a voice-enabled assistant.
    Your task is to understand the user's natural language input and respond with a JSON object like this:
    {
    "type": "general" | "google-search" | "youtube-search" |
    "youtube-play" | "get-time"  | "get-date" | "get-day"|
    "get-month" | "calculator-open" | "instagram-open" |
    "facebook-open" | "weather-show",
    "userInput": "<orginal user input>" { only remove your userinput from name if exists} and kasailay google ya youtube
    open gar vanyo vani userInput ma only be search wala search wala text jaya,
    "response": "<a short spoken response to read out loud to the user>"
    }
    Instructions:
    -"type": determine the intent of the user.
    -"userInput":original sentence the user spoke.
    -"response": A short voice-friendly reply, e.g., "Sure, playing it now","Heres what I found","Tody is Tuesday", etc.

    Type meanings:
    - "general": if it's a factual or informational question.
    -"general-search": if user wants to search something on Google.
    - "youtube-search": if user wants to search something on Youtube.
    -"youtube-play": if user wants directly play a video or song.
    -"calculator-open": if user wants to open a calculator.
    -"instagram-open": if user wants to open a instagram.
    -"facebook-open": if user wants to open facebook.
    -"weather-show": if user wants to know weather.
    -"get-time": if user asks for current time.
    -"get-date": if user asks for today's date.
    -"get-day": if user asks what day it is.
    -"get-month": if user asks for the current month.

    Important:
    -Use ${userName} kasilay sodyo vani talai kaslay banako.
    -Only respond with the JSON object, nothing else.

    now your userInput - ${command}
`;
    try {
        const response = await axios.post(`${process.env.GEMINI_API}?key=${process.env.GEMINI_KEY}`,  {
            "contents": [
                {
                    "parts": [
                        {
                            "text": prompt
                        }
                    ]
                }
            ]
        })
     
        return response.data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.log(error.message)
    }
}

export default geminiAiResponse