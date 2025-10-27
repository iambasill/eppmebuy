import express, { Request, Response, NextFunction } from "express";
import { BadRequestError, unAuthorizedError } from "../httpClass/exceptions";
import { signupSchema, loginSchema } from "../schema/authSchema";
import bcrypt from 'bcrypt';
import { prismaclient } from "../lib/prisma-postgres";
import { generateAuthToken, generateLoginToken, verifyToken } from "../utils/func";
import { User, UserRole } from "../../generated/prisma";
import sanitize from "sanitize-html";



// ====================== CONTROLLERS ====================== //

/**
 * Register a new user.
 */
export const registerController = async (req: Request, res: Response, next: NextFunction) => {
  const validatedData = signupSchema.parse(req.body);
  const { email, firstName, lastName, phoneNumber } = validatedData;
  const userRole: UserRole = (validatedData.role ?? "ATTENDEE") as UserRole;

  const existingUser = await prismaclient.user.findFirst({ where: { email } });
    if (existingUser ){
    throw new BadRequestError('User already exists');
  }

  const hashedPassword = await bcrypt.hash("password", 12);
  const user = await prismaclient.user.create({
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

  const user = await prismaclient.user.findFirst({ where: { email } , select:{id:true,password:true, status:true}});
  if (!user || user.status === 'BLOCKED') throw new BadRequestError("Invalid Credentials");

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new BadRequestError("Invalid Credentials");

  const { password: _, ...userData } = user; 

  const {accessToken, refreshToken} = generateAuthToken(user.id);

    await prismaclient.userSession.create({
      data: {
        userId: user.id, 
        refreshToken,
        userAgent: req.headers['user-agent'] || 'Unknown',
        ipAddress: req.ip,
      },
    });


  res.status(200).send({
    success: true,
    accessToken,
    refreshToken,
    user: userData,
  });
};

/**
 * Refresh access token using refresh token.
 */

export const refreshTokenController = async (req: Request, res: Response) => {
  const refreshToken = sanitize(req.body.refreshToken );
  if (!refreshToken) throw new unAuthorizedError("No refresh token provided");

  const decoded = verifyToken(refreshToken);
  const userSession = await prismaclient.userSession.findFirst({ where: { id: decoded.id, refreshToken }, select: { userId: true } });
  const user:any = await prismaclient.user.findUnique({ where: { id: decoded.id }, select: { id: true ,status:true} });


  if (!user || user.status === "BLOCKED", !userSession) throw new unAuthorizedError("Invalid refresh token");

  const newToken = generateLoginToken(user.id);
  res.status(200).send({ success: true, accessToken: newToken });
};

/**
 * Change user password (requires old password).
 */
// export const changePasswordController = async (req: Request, res: Response) => {
//   const userId = req.user?.id; // Assuming `req.user` is set by auth middleware
//   const { oldPassword, newPassword } = changePasswordSchema.parse(req.body);

//   const user = await prisma.user.findUnique({ where: { id: userId } });
//   if (!user) throw new BadRequestError("User not found");

//   const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
//   if (!isOldPasswordValid) throw new BadRequestError("Old password is incorrect");

//   const hashedNewPassword = await bcrypt.hash(newPassword, 12);
//   await prisma.user.update({
//     where: { id: userId },
//     data: { password: hashedNewPassword }
//   });

//   res.status(200).send({ success: true, message: "Password updated successfully" });
// };

/**
 * Initiate password reset (sends reset link via email).
 */
// export const forgotPasswordController = async (req: Request, res: Response) => {
//   const { email } = req.body;
//   const user = await prisma.user.findFirst({ where: { email } });
//   if (!user) return res.status(200).send({ success: true }); // Don't reveal if user exists

//   const resetToken = crypto.randomBytes(20).toString('hex');
//   const resetTokenExpiry = new Date(Date.now() + PASSWORD_RESET_EXPIRY);

//   await prisma.user.update({
//     where: { id: user.id },
//     data: { resetToken, resetTokenExpiry }
//   });

//   await sendPasswordResetEmail(email, resetToken); // Implement this in `emailService.ts`

//   res.status(200).send({ success: true, message: "Password reset link sent to email" });
// };

/**
 * Reset password using a valid token.
 */
// export const resetPasswordController = async (req: Request, res: Response) => {
//   const { token, newPassword } = resetPasswordSchema.parse(req.body);

//   const user = await prisma.user.findFirst({
//     where: {
//       resetToken: token,
//       resetTokenExpiry: { gt: new Date() } // Token not expired
//     }
//   });

//   if (!user) throw new BadRequestError("Invalid or expired token");

//   const hashedPassword = await bcrypt.hash(newPassword, 12);
//   await prisma.user.update({
//     where: { id: user.id },
//     data: { password: hashedPassword, resetToken: null, resetTokenExpiry: null }
//   });

//   res.status(200).send({ success: true, message: "Password reset successful" });
// };

/**
 * Logout user (revokes refresh token).
 */
// export const logoutController = async (req: Request, res: Response) => {
//   const userId = req.user?.id;
//   if (!userId) throw new UnauthorizedError("Not authenticated");

//   await prisma.user.update({
//     where: { id: userId },
//     data: { refreshToken: null }
//   });

//   res.status(200).send({ success: true, message: "Logged out successfully" });
// };
