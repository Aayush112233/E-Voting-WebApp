import mongoose from "mongoose";
import { Schema, Model } from "mongoose";

const adminNotificationSchema = new Schema({
  notification: {
    type: String,    
    required: true,
  },
  isSeen: {
    type: Boolean,
    default:false,
  },
  type:{
    type:String,
    enum:["Election", "Inquiry"]
  }
});

const AdminNotification = mongoose.model("admin_notification", adminNotificationSchema);

export default AdminNotification;