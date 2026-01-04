const axios = require("axios");

const mailSender = async (email, title, body) => {
  try {
    const data = {
      sender: {
        name: "StudyNotion",
        email: process.env.SENDER_EMAIL, // shivamdbgtaralahi@gmail.com
      },
      to: [{ email: email }],
      subject: title,
      htmlContent: body,
    };

    const config = {
      headers: {
        "api-key": process.env.BREVO_API_KEY,
        "content-type": "application/json",
        "accept": "application/json",
      },
    };

    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      data,
      config
    );

    console.log("✅ Email sent successfully via Axios:", response.data.messageId);
    return response.data;
  } catch (error) {
    console.error(
      "❌ mailSender Error:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

module.exports = mailSender;





