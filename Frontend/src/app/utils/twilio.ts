import axios from 'axios';

const TWILIO_ACCOUNT_SID = process.env.NEXT_PUBLIC_TWILIO_ACCOUNT_SID; // Replace with your Account SID
const TWILIO_AUTH_TOKEN = process.env.NEXT_PUBLIC_TWILIO_AUTH_TOKEN;   // Replace with your Auth Token
const TWILIO_PHONE_NUMBER = process.env.NEXT_PUBLIC_TWILIO_PHONE_NUMBER; // Replace with your Twilio phone number

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
