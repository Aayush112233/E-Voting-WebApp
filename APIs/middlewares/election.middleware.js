import jwt from "jsonwebtoken";
import UserModel from "../models/user.model.js";


export const ElectionCreater = async (req, res, next) => {
  const { authorization } = req.headers;  
  // Example usage
  if (authorization) {
    try {
      let token;
      const tokenCheck = authorization.split(" ");
      if (tokenCheck.lenght > 1) {
        token = tokenCheck[0];
      } else {
        token = tokenCheck[1];
      }
      const { userEmail } = await jwt.verify(token, process.env.JWT_SECRET_KEY);
      const userDetail = await UserModel.findOne({ email: userEmail }).select(
        "-password"
      );
      req.body.createdBy = userDetail._id;
      req.user = userDetail    
      next();
    } catch (e) {
      next({ status: 401, message: "Unauthorized User" });
    }
  }
};
