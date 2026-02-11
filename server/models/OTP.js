const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const {otpTemplate} = require("../mail/templates/otpTemplate")
const OTPSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    expires: 5 * 60 * 1000,
  },
  otp: {
    type: String,
    required: true,
  },
});

async function sendVerificationEmail(email, otp) {
  try {
    // Yahan check karo mailSender function call ho raha hai
    const mailResponse = await mailSender(
      email, 
      "Verification Email from StudyNotion", 
      `<h1>Your OTP is ${otp}</h1>`
    );
    console.log("Email sent successfully: ", mailResponse);
  } catch (error) {
    console.log("Error occurred while sending emails: ", error);
    throw error;
  }
}

OTPSchema.pre("save", async function (next) {
  if (this.isNew) {
    try {
      await sendVerificationEmail(this.email, this.otp);
    } catch (error) {
      console.error("Email Hook Error:", error);
      // throw error ko hata do testing ke liye
    }
  }
  next();
});

const OTP = mongoose.model("OTP", OTPSchema);
module.exports = OTP;