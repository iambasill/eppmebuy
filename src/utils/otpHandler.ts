import speakeasy from 'speakeasy';
import { config } from '../config/envConfig';


export const generateOtp = async() => {
  const token = speakeasy.totp({
    secret: config.OTP_SECRET || "", 
    encoding: 'base32',
    step: 60      
  });

  return token;
};

export const verifyOtp = async(userToken:string) => {
  return speakeasy.totp.verify({
    secret: config.OTP_SECRET || "",
    token: userToken,
    encoding: 'base32',
    step: 60,
  });
} 
