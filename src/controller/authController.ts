import express, { Request, Response, NextFunction } from "express";
import { BadRequestError, UnAuthorizedError } from "../logger/exceptions";
import { signupSchema, loginSchema, changePasswordSchema,  forgotPasswordSchema, resetPasswordSchema, verifyOtpSchema } from "../validator/authValidator";
import bcrypt from 'bcrypt';
import { prismaclient } from "../lib/prisma-postgres";
import { createUserSession, generateAuthToken, generateToken, verifyToken } from "../utils/func";
import { User, UserRole } from "../../generated/prisma";
import { generateOtp, verifyOtp } from "../utils/otpHandler";



// ====================== CONTROLLERS ====================== //S

/**
 * Register a new user.
 */
export const registerController = async (req: Request, res: Response, next: NextFunction) => {
  const validatedData = signupSchema.parse(req.body);
  const { email, firstName, lastName, phoneNumber,password } = validatedData;
  const userRole: UserRole = (validatedData.role ?? "ATTENDEE") as UserRole;

  const existingUser = await prismaclient.user.findFirst({ where: { email } });
    if (existingUser ){
    throw new BadRequestError('User already exists');
  }

  const hashedPassword = await bcrypt.hash( password, 12);
   await prismaclient.user.create({
    data: { email, firstName, lastName, role: userRole, password: hashedPassword, phoneNumber }
  });

  // (Optional) Send verification email here.

  res.status(201).send({
    success: true,
    message: "User created successfully. Please verify your email.",
  });
};



/**
 * Login user and return JWT token.
 */

export const loginController = async (req: Request, res: Response) => {
  const { email, password } = loginSchema.parse(req.body);

  const user = await prismaclient.user.findFirst({ where: { email } , select:{id:true,password:true, status:true, email:true, firstName:true, lastName:true, role:true, phoneNumber:true}});
  if (!user || user.status === 'BLOCKED') throw new BadRequestError("Invalid Credentials");

  const isPasswordValid = await bcrypt.compare(password, user.password || "password");
  if (!isPasswordValid) throw new BadRequestError("Invalid Credentials");

  const { password: _, ...userData } = user; 

  const accessToken = await generateAuthToken(user.id);

  await createUserSession(user.id, req);


  res.status(200).send({
    success: true,
    accessToken,
    user: userData,
  });
};


/**
 * Change user password (requires old password).
 */

export const changePasswordController = async (req: Request, res: Response) => {
  let user = req.user as User; 
  const { currentPassword, newPassword } = changePasswordSchema.parse(req.body);

  const isOldPasswordValid = await bcrypt.compare(currentPassword, user.password || "password");
  if (!isOldPasswordValid) throw new BadRequestError("Old password is incorrect");

  const hashedNewPassword = await bcrypt.hash(newPassword, 12);

  await prismaclient.user.update({
    where: { id: user.id },
    data: { password: hashedNewPassword }
  });

  res.status(200).send({ success: true, message: "Password updated successfully" });

};

/**
 * Initiate password reset (sends reset link via email).
 */

export const forgotPasswordController = async (req: Request, res: Response) => {
  const { email, phoneNumber } = forgotPasswordSchema.parse(req.body);
  const user = await prismaclient.user.findFirst({ where: { OR: [ { email }, { phoneNumber } ] } });
  if (!user) throw new BadRequestError("User with this email does not exist");

  const otp = await generateOtp();

  await prismaclient.user.update({
    where: { id: user.id },
    data: { otp }
  });

  // await sendPasswordResetEmail(email, resetToken); // Implement this in `emailService.ts`
//TODO: REMOVE
  res.status(200).send({ success: true, otp:otp });
};



/**
 * verify token.
 */

export const verifyResetTokenController = async (req: Request, res: Response) => {
  const { email, phoneNumber, otp } = resetPasswordSchema.parse(req.body);

  if (!otp) throw new BadRequestError("Invalid or expired token");

  const user = await prismaclient.user.findFirst({
    where: {
      OR: [ { email }, { phoneNumber } ]
    , otp
    }
  });
  if (!user) throw new BadRequestError("Invalid or expired token");

  const validToken = await verifyOtp(otp);
  if (!validToken) throw new BadRequestError("Invalid or expired token");

  res.status(200).send({ success: true, message: "Token is valid" });
};


/**
 * Reset password using a valid token.
 */
export const resetPasswordController = async (req: Request, res: Response) => {
  const { email, phoneNumber, newPassword, otp } = resetPasswordSchema.parse(req.body);

  if (!otp || !newPassword || newPassword.length < 3 ) throw new BadRequestError("Invalid password reset request");


  const user = await prismaclient.user.findFirst({
    where: {
      OR: [ { email }, { phoneNumber } ]
    , otp
    }
  });
  if (!user) throw new BadRequestError("Invalid or expired OTP");

  if (user.otp !== otp) throw new BadRequestError("Invalid or expired OTP");



  const hashedPassword = await bcrypt.hash(newPassword, 12);
  await prismaclient.user.update({
    where: { id: user.id },
    data: { password: hashedPassword, otp: null }
  });

  res.status(200).send({ success: true, message: "Password reset successful" });
};



// ====================== END CONTROLLERS ====================== //
