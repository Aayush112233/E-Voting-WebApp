import jwt from "jsonwebtoken";
import UserModel from "../models/user.model.js";

const checkAuth = async (req, res, next) => {
  const { authorization } = req.headers;
  if (authorization) {
    try{
        let token
        const tokenCheck = authorization.split(' ')
        if(tokenCheck.lenght > 1){
            token = tokenCheck[0]
        }
        else{
            token = tokenCheck[1]
        }
        const {userEmail} = await jwt.verify(token, process.env.JWT_SECRET_KEY)
        const userDetail = await UserModel.findOne({ email: userEmail }).select("-password")
        req.user = userDetail   
        next()
    }
    catch (e){
        
        next({status:401, message: "Unauthorized User" })
    }
  } else {
    next({ status: 400, message: "Authorization Error" });
  }
};

export default checkAuth;
