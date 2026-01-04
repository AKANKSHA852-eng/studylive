require("dotenv").config();
console.log("DB URL =", process.env.MONGODB_URL);

const express = require("express");
const app = express();

const courseRoutes = require("./Routes/Course");
const profileRoutes = require("./Routes/Profile");
const userRoutes = require("./Routes/User");
const paymentsRoutes = require("./Routes/Payments"); 
const contactUsRoute = require("./Routes/Contact");

require("dotenv").config();
const database = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const {cloudinaryConnect} = require("./config/cloudinary");
const fileUpload = require("express-fileupload");

const PORT = process.env.PORT || 3001;

database.Connect(); 

app.use(express.json());
app.use(cookieParser());

// Updated CORS configuration
app.use(
  cors({
    origin: ["http://localhost:3000","https://studylive-tau.vercel.app"],
    credentials: true,
  })
);

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp",
  })
);

cloudinaryConnect();

app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/payment", paymentsRoutes);
app.use("/api/v1/reach", contactUsRoute);

app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Your server is up and running...."
  });
});

app.listen(PORT, () => {
  console.log(`App is running at ${PORT}`);
});