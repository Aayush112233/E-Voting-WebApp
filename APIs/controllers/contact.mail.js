import transporter from "../config/emailConfig.js";
import AdminNotification from "../models/AdminNotification.js";
import ContactUs from "../models/ContactUsModel.js";

class ContactMail {
  static GetContactInfo = async (req, res, next) => {
    const { fullName, email, message } = req.body;
    if (fullName && email && message) {
      const contact = new ContactUs(req.body);
      const notification = new AdminNotification({
        notification:`You have a new Inquiry from ${fullName}`,
        type:"Inquiry"
      })
      contact.save(async function (err, doc) {
        if (err) {
          next({ status: 500, message: "Cannot Save the contact." });
        } else {
          notification.save();
          const text = `Dear ${fullName},

            Thank you for contacting us. We appreciate your interest in our products and services.
            
            We have received your message and we will get back to you as soon as possible. 
                        
            Thank you again for reaching out to us.
            
            Best regards,
            
            E-Voting`;
          await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: email,
            subject: "Contact",
            text: text,
          });
        }

        res.status(200).json({
          message: "Message Sent Successfully",
        });
      });
    } else {
      next({ status: 400, message: "All fields are required" });
    }
  };

  static ReplyInquiry = async (req, res, next) => {
    const { to, message } = req.body;
    const text = message;
    await transporter
      .sendMail({
        from: process.env.EMAIL_FROM,
        to: to,
        subject: "Reply From Evoting",
        text: text,
      })
      .then(() => {
        res.status(200).json({
          message:"Your Reply sent successfully"
        })
      })
      .catch((err) => {
        next({status:400, message:err})
      });
  };
}

export default ContactMail;
