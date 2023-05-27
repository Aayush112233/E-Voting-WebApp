import UserModel from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import transporter from "../config/emailConfig.js";
import ejs from "ejs";
import ImageModel from "../models/image.model.js";
import ContactUs from "../models/ContactUsModel.js";
import PageView from "../models/userVisit.model.js";
import AdminNotification from "../models/AdminNotification.js";

class UserController {
  static userRegistration = async (req, res, next) => {
    try {
      const { firstName, lastName, email, password, confirmPassword } =
        req.body;

      const user = await UserModel.findOne({ email: email });

      const phone = await UserModel.findOne({'contactInfo.phoneNumber': req.body.contactInfo.phoneNumber });

      if(phone){
        return next({status:400, message:"Phone Number already in use"})
      }
      if (user) {
        next({ status: 400, message: "Email already in use" });
      } else {
        if (firstName && lastName && email && password && confirmPassword) {
          if (password === confirmPassword) {
            delete req.body.confirmPassword;
            req.body.role = "user";

            await bcrypt.hash(password, 10, function (err, hash) {
              if (err) {
                next({ status: 400, message: "Unable to Register" });
              } else {
                req.body.password = hash;
                const register = new UserModel(req.body);
                register.save(function (err, doc) {
                  if (err) {
                    next({ status: 400, message: err });
                  } else {
                    res.status(200).json({
                      result: req.body,
                      message: "User Register Sucessfully",
                    });
                  }
                });
              }
            });
          } else {
            next({
              status: 400,
              message: "Password and Confirm Password didn't match",
            });
          }
        } else {
          next({ status: 400, message: "Invalid Form Submission" });
        }
      }
    } catch (error) {
      next({ status: 500, message: "Internal Server Error" });
    }
  };

  static login = async (req, res, next) => {
   try {
    const { email, password } = req.body;
    if (email && password) {
      const user = await UserModel.findOne({ email: email });
      if (user) {
        const decryptPassword = await bcrypt.compare(password, user.password);
        if (user.email === email && decryptPassword) {
          const token = jwt.sign(
            {
              userEmail: user.email,
            },
            process.env.JWT_SECRET_KEY
          );
          res.status(200).json({
            message: "User Login Successfully",
            token: token,
          });
        } else {
          next({ status: 400, message: "Email or Password is incorrect." });
        }
      } else {
        next({ status: 400, message: "User is not registered." });
      }
    } else {
      next({ status: 400, message: "Fields are empty." });
    }
    
   } catch (error) {
    next({ status: 500, message: "Internal Server Error" });
   }
  };

  static loggedInUserInfo = async (req, res, next) => {
    if (req.user) {
      res.status(200).json({
        userInfo: req.user,
      });
    } else {
      next({ status: 400, message: "Unauthorized User" });
    }
  };

  static changePassword = async (req, res, next) => {
    const { oldPassword, newPassword } = req.body;
    const { userId } = req.params;
    const userDetails = await UserModel.findById(userId);
    if (!userDetails) {
      return next({ status: 400, message: "User Not Found" });
    }
    const sameOldPasswordStatus = await bcrypt.compare(
      oldPassword,
      userDetails.password
    );
    if (oldPassword && newPassword) {
      if (!sameOldPasswordStatus) {
        next({ status: 400, message: "Old Password is incorrect." });
      } else {
        await bcrypt.hash(newPassword, 10, function (err, hash) {
          if (err) {
            next({ status: 400, message: "Unable to Register" });
          } else {
            UserModel.findByIdAndUpdate(
              { _id: userId },
              { password: hash },
              (err, done) => {
                if (err) {
                  next({
                    status: 400,
                    message: "Failed to reset the password",
                  });
                } else {
                  res.status(200).json({
                    message: "Password changed successfully.",
                  });
                }
              }
            );
          }
        });
      }
    } else {
      next({ status: 400, message: "Fields are empty." });
    }
  };

  static getTotalNoofUsers = async (req, res, next) => {
    try {
      const totalUsers = await UserModel.countDocuments({});
      res.json({
        totalUsers,
      });
    } catch (err) {
      next(err);
    }
  };

  static GetAllUser = async (req, res, next) => {
    const userInfo = await UserModel.find({})
      .select("-password")
      .sort({ createdAt: -1 });
    if (userInfo) {
      res.status(200).json({
        userInfo: userInfo,
        message: "Data Fetched Successfully",
      });
    } else {
      next({ status: 500, message: "Unable to Fetch User Information" });
    }
  };

  static UserUpdate = async (req, res, next) => {
    const { userId } = req.params;
    const isIdValid = ObjectId.isValid(userId);
    if (!isIdValid) {
      next({ status: 400, message: "Invalid id" });
      return;
    }

    UserModel.findByIdAndUpdate(
      { _id: userId },
      {
        $set: req.body,
      },
      {
        new: true,
      },
      (err, done) => {
        if (err) {
          next({ status: 400, message: err });
        } else {
          res.status(200).json({
            result: req.body,
            message: "User Updated Sucessfully",
          });
        }
      }
    );
  };

  static UserDelete = async (req, res, next) => {
    const { userId } = req.params;
    const isIdValid = ObjectId.isValid(userId);
    if (!isIdValid) {
      next({ status: 400, message: "Invalid id" });
      return;
    }
    UserModel.findOneAndDelete({ _id: userId }, (err, done) => {
      if (err) {
        next({ status: 400, message: "Failed to Delete" });
        return;
      }
      res.status(200).json({
        message: "User Deleted Sucessfully",
      });
    });
  };

  static async SendEmailToReset(req, res, next) {
    try {
      const { email } = req.body;
      if (!email) {
        throw { status: 400, message: "Email not found" };
      }
      const userDetail = await UserModel.findOne({ email });
      if (!userDetail) {
        throw { status: 400, message: "Email doesn't exist" };
      }
      const secret = userDetail._id + process.env.JWT_SECRET_KEY;
      const token = jwt.sign({ user_id: userDetail._id }, secret, {
        expiresIn: "15m",
      });
      const link = `http://localhost:3000/reset/${userDetail._id}/${token}`;
      const html = await ejs.renderFile("./Pages/EmailPage.html", {
        link: link,
      });
      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: userDetail.email,
        subject: "Reset Email - Evoting",
        html: html,
      });
      res.status(200).json({
        message:
          "Email to reset your password has been sent to your email. Please check your inbox.",
      });
    } catch (err) {
      next(err);
    }
  }

  static ResetUserPassword = async (req, res, next) => {
    const { id, token } = req.params;
    const { newPassword, confirmPassword } = req.body;
    const userDetail = await UserModel.findById(id);
    const newSecret = userDetail._id + process.env.JWT_SECRET_KEY;
    try {
      jwt.verify(token, newSecret);
      if (newPassword && confirmPassword) {
        if (newPassword !== confirmPassword) {
          next({
            status: 400,
            message: "Password and Confirm Password didn't matched.",
          });
        } else {
          await bcrypt.hash(newPassword, 10, function (err, hash) {
            if (err) {
              next({ status: 400, message: "Unable to Register" });
            } else {
              UserModel.findByIdAndUpdate(
                { _id: userDetail._id },
                { password: hash },
                (err, done) => {
                  if (err) {
                    next({
                      status: 400,
                      message: "Failed to reset the password",
                    });
                  } else {
                    res.status(200).json({
                      message: "Password reset successfully.",
                    });
                  }
                }
              );
            }
          });
        }
      } else {
        next({ status: 400, message: "All fields are required." });
      }
    } catch (err) {
      next({ status: 400, message: "Invalid Token" });
    }
  };

  static async ResetUserPassword(req, res, next) {
    try {
      const { id, token } = req.params;
      const { password, confirmPassword } = req.body;
      const userDetail = await UserModel.findById(id);
      if (!userDetail) {
        throw { status: 400, message: "User not found" };
      }
      const newSecret = userDetail._id + process.env.JWT_SECRET_KEY;
      jwt.verify(token, newSecret);
      if (!password || !confirmPassword) {
        throw { status: 400, message: "All fields are required." };
      }
      if (password !== confirmPassword) {
        throw {
          status: 400,
          message: "Password and Confirm Password do not match.",
        };
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      await UserModel.findByIdAndUpdate(userDetail._id, {
        password: hashedPassword,
      });
      res.status(200).json({ message: "Password reset successfully." });
    } catch (err) {
      next(err);
    }
  }

  static ImageUpload = (req, res, next) => {
    const { id } = req.params;
    const imageLink = req.imageUrl;
    const image = new ImageModel({
      url: imageLink,
      userId: id,
    });
    UserModel.findByIdAndUpdate(
      { _id: id },
      { $set: { profileImage: imageLink } },
      { new: true },
      (err, updatedUser) => {
        if (err) {
          console.log(err);
        } else {
          res.status(200).json({
            message: "You Image have been updated.",
          });
        }
      }
    );
  };

  static ProfileImage = (req, res, next) => {
    const { id } = req.params;
    const { image } = req.body;
    UserModel.findByIdAndUpdate(
      { _id: id },
      { $set: { profileImage: image } },
      { new: true },
      (err, updatedUser) => {
        if (err) {
          console.log(err);
        } else {
          res.status(200).json({
            message: "You Image have been updated.",
          });
        }
      }
    );
  };

  static getAllInquiries = async (req, res, next) => {
    const inquiries = await ContactUs.find({});
    if (inquiries) {
      res.status(200).json({
        inquiries,
      });
    } else {
      next({ status: 400, message: "No Inquires" });
    }
  };

  static postPageViews = async (req, res, next) => {
    try {
      // Retrieve the page view data from MongoDB
      const pageView = await PageView.findOne();
      // Increment the counter by one and update the document
      pageView.counter++;
      await pageView.save();

      // Return the updated counter value to the client
      res.status(200).json({ count: pageView.counter });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  };
  static getPageViews = async (req, res, next) => {
    try {
      // Retrieve the page view data from MongoDB
      const pageView = await PageView.findOne();
      // Increment the counter by one and update the document

      // Return the updated counter value to the client
      res.status(200).json({ count: pageView.counter });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  };

  static getAdminNotification = async (req, res, next) => {
    try {
      const notifications = await AdminNotification.find({});
      if (notifications) {
        res.status(200).json({
          notifications,
        });
      } else {
        next({ status: 400, message: "No Notification Found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  };

  static updateNotification = async (req, res, next) => {
    const { id } = req.params;
    const isIdValid = ObjectId.isValid(id);
    if (!isIdValid) {
      return next({ status: 400, message: "Invalid Id" });
    }

    await AdminNotification.findByIdAndUpdate(
      { _id: id },
      {
        isSeen: true,
      }
    );

    res.status(200).json({
      message: "Status Updated Successfully",
    });
  };
}

export default UserController;
