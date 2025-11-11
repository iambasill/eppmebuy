
import jwt from 'jsonwebtoken';
import { prismaclient } from '../lib/prisma-postgres';
import { config } from '../config';
import { BadRequestError } from '../logger/exceptions';

export function checkUser(id:string){
    const user = prismaclient.user.findUnique({
        where:{id},
    })
return user
}

export const generateAuthToken =async (userId: string) => {
    let accessToken =  jwt.sign({ id: userId }, config.AUTH_JWT_TOKEN as string);
    return accessToken 
  }


  export const generateToken =async (userId: string) => {
    let resetToken =  jwt.sign({ id: userId }, config.AUTH_JWT_TOKEN as string, { expiresIn: '24h' });
    return resetToken ;
  }


export const verifyToken = async(token: string,type:string="auth") => {
    if (!token) throw new BadRequestError('Token is required');
    try {
    const secret =
        type === 'reset'
            ? (config.AUTH_JWT_RESET_TOKEN as string)
            : (config.AUTH_JWT_TOKEN as string);

        const payload = jwt.verify(token, secret) as {
            id?: string;
            iat?: number;
            exp?: number;
            [key: string]: any;
        };

        if (!payload || typeof payload !== 'object' || !payload.id) {
            throw new BadRequestError('Invalid or expired token');
        }

        return payload;
        } catch (err) {
           throw new BadRequestError('Invalid or Expired token!');
        }
    }

export const createUserSession = async (userId:string, req:any) => {
    await prismaclient.userSession.updateMany({
        where: { userId: userId, loggedOutAt: null },
        data: { loggedOutAt: new Date() },
      });

        await prismaclient.userSession.create({
          data: {
            userId: userId, 
            userAgent: req.headers['user-agent'] || 'Unknown',
            ipAddress: req.ip,
          },
        });
}