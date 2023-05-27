import UserController from "../controllers/user.controller.js";
import express from "express";
import checkAuth from "../middlewares/auth.middleware.js";
import Grid from "gridfs-stream";
import mongoose from "mongoose";
import uploadImage from "../middlewares/image.upload.middleware.js";
import ContactMail from "../controllers/contact.mail.js";
const router = express.Router();
const conn = mongoose.connection;
let gfs;
conn.once("open", function () {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("photos");
});

router.post("/register", UserController.userRegistration);
router.post("/login", UserController.login);
// router.post('/upload/:id?',uploadImage, UserController.ImageUpload);
router.post('/upload/:id?',checkAuth, UserController.ProfileImage);
//RESET PASSWORD
router.post("/sendResetEmail", UserController.SendEmailToReset);
router.post("/contactUs", ContactMail.GetContactInfo);
router.post("/replyInquiry",checkAuth, ContactMail.ReplyInquiry);
router.post("/passwordReset/:id/:token", UserController.ResetUserPassword);
router.post(
  "/changePassword/:userId",
  checkAuth,
  UserController.changePassword
);
router.get("/loggedInInfo", checkAuth, UserController.loggedInUserInfo);
router.get("/getTotalNoofUsers",checkAuth, UserController.getTotalNoofUsers);
router.get("/getAllInquiries", checkAuth, UserController.getAllInquiries);
router.put("/update/:userId", checkAuth, UserController.UserUpdate);
router.delete("/delete/:userId", checkAuth, UserController.UserDelete);
router.get("/getAll", checkAuth, UserController.GetAllUser);
router.get('/pageviews',checkAuth,UserController.getPageViews);
router.get('/addPageViews',checkAuth,UserController.postPageViews);
router.get('/getAdminNotification',checkAuth,UserController.getAdminNotification);
router.put('/updateNotification/:id',checkAuth,UserController.updateNotification);

export default router;
