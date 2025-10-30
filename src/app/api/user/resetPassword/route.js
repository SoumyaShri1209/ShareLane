import { connect } from "@/dbConfig/dbConfig";
import { NextResponse } from "next/server";
import User from "@/models/userModel";
import bcrypt from "bcryptjs"



connect();

export async function POST(request){
    try {

      
        const reqbody = await request.json();
        const {token,password} = reqbody;
        console.log(token,password);
        const user = await User.findOne({forgotPasswordToken:token , forgotPasswordTokenExpiry:{$gt:Date.now()}});
        

        if (!password) {
          return NextResponse.json({ error: "Please provide a valid password" }, { status: 400 });
        }

        


       if(!user){
        return NextResponse.json({error: "Invalid token"} , {status:400})

       }

        
        const hashedPassword = await bcrypt.hash(password, 10);

       user.password = hashedPassword
       user.forgotPasswordToken = undefined;
       user.forgotPasswordTokenExpiry =undefined;
       await user.save();

        return NextResponse.json({
               message: "Password updated successfully",
               success : true
              })

    } catch (error) {
        return NextResponse.json({error: error.message},{status:500})
    }
}