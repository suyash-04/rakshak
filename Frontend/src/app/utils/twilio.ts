import axios from 'axios';

const TWILIO_ACCOUNT_SID = 'AC153359bcbd2bbac6edaa0a2bb9c053cb'; // Replace with your Account SID
const TWILIO_AUTH_TOKEN = 'fb599c87471985344a57ccb8ed1050c6';   // Replace with your Auth Token
const TWILIO_PHONE_NUMBER = '+14042366382'; // Replace with your Twilio phone number

/**
 * Send an SMS message using Twilio API
 * @param to - The recipient's phone number
 * @param message - The message body to send
 * @returns The response from Twilio API
 */
export const sendMessage = async (latitude: number, longitude: number): Promise<string> => {
    try {
        const encodedAuth = btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`);

        const response = await axios.post(
            `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
            new URLSearchParams({
                To: '+9779742325734',
                From: TWILIO_PHONE_NUMBER,
                Body: `accident has been reported at coordinate [ ${latitude}, ${longitude} ]`,
            }),
            {
                headers: {
                    Authorization: `Basic ${encodedAuth}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );

        return `Message sent! SID: ${response.data.sid}`;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || error.message);
    }
};
