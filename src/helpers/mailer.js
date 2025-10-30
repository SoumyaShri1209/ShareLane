import nodemailer from "nodemailer"
import User from "@/models/userModel"
import bcrypt from "bcryptjs"


export const sendEmail = async({email,emailType,userId})=>{
    try {
      const hashedToken = await  bcrypt.hash(userId.toString(),10)
     
        
      if(emailType==="VERIFY"){
              await User.findByIdAndUpdate(userId,
        {verifyToken:hashedToken , verifyTokenExpiry: Date.now()+3600000})
      } 

      
      else if(emailType==="RESET"){

        await User.findByIdAndUpdate(userId,
            {forgotPasswordToken: hashedToken , forgotPasswordTokenExpiry : Date.now() + 3600000})

      }



        const transporter = nodemailer.createTransport({
          host: "sandbox.smtp.mailtrap.io",
          port: 2525,
          auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASSWORD
          }
        });

            const mailOptions = {
        from: 'soumya12shri@gmail.com',
        to: email,
        subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password",
        html: `<p> Click <a href="${process.env.DOMAIN}/${emailType === "VERIFY" ? "verifyemail" : "resetPassword"}?token=${hashedToken}">here</a> to ${emailType === "VERIFY" ? "verify your email" : "reset your password"}</p>`
      }


        const mailResponse = await transporter.sendMail(mailOptions);
        return mailResponse;

   

    } catch (error) {
        throw new Error(error.message);
    }
}









